const fs = require('fs-extra');
const path = require('path');
const { dialog } = require('electron');
const uuid = require('uuid');

let folderMap = new Map();
let pathMap = new Map();

// get user's preferesnce
let userPre = fs.readJsonSync(path.join(__dirname, './user.json'));
let { pathname: workPath } = userPre;
if (workPath.length < 3 || !fs.pathExistsSync(workPath)) {
  const pathString = dialog.showOpenDialogSync({
    properties: ['openDirectory'],
  })[0];
  workPath = pathString;
  userPre = {
    ...userPre,
    pathname: pathString,
  };
  fs.writeJSONSync(path.join(__dirname, './user.json'), userPre);
}

const getFilePath = pathname => {
  return path.join(workPath, pathname);
};

fs.ensureDirSync(getFilePath('folder'));
fs.ensureDirSync(getFilePath('trash'));
fs.ensureDirSync(getFilePath('document'));

const globalGetFolderList = (refresh = false) => {
  if (refresh) {
    folderMap.clear();
    pathMap.clear();
  }

  const getFileLoop = nowPath => {
    const info = fs.readJSONSync(getFilePath(`${nowPath}/_folder.json`));
    const { id, folder } = info;

    if (refresh) {
      folderMap.set(id, folder);
      pathMap.set(id, nowPath);
    }

    const filesList = fs.readdirSync(getFilePath(nowPath));
    let children = [];
    filesList.forEach(itemId => {
      if (/\w+\-\w+\-\w+\-\w+\-\w+/.test(itemId)) {
        children.push(getFileLoop(`${nowPath}/${itemId}`));
      }
    });

    children = children.sort((x, y) => x.createTime - y.createTime);
    const result = {
      ...info,
      children,
    };
    return result;
  };

  let folderList = [];
  const fileList = fs.readdirSync(getFilePath('folder'));
  fileList.forEach(id => {
    if (/\w+\-\w+\-\w+\-\w+\-\w+/.test(id)) {
      folderList.push(getFileLoop(`folder/${id}`));
    }
  });
  console.log(folderList);
  folderList = folderList.sort((x, y) => x.createTime - y.createTime);
  console.log(folderList);
  return folderList;
};

// get folder list
let folderList = globalGetFolderList(true);

// api export
module.exports = {
  updateUserPre(params) {
    userPre = {
      ...userPre,
      ...params,
    };
    fs.writeJSONSync(path.join(__dirname, './user.json'), userPre);
  },
  getUserPreferences() {
    return userPre;
  },
  getFolderList() {
    return globalGetFolderList(false);
  },
  newFolder(params) {
    const newId = uuid.v1();
    const createTime = new Date().getTime();
    const { folder } = params;
    let folderPath = 'folder';
    if (folder !== 0) {
      folderPath = pathMap.get(folder);
    }
    const newPath = `${folderPath}/${newId}`;
    folderMap.set(newId, folder);
    pathMap.set(newId, newPath);
    fs.ensureDirSync(getFilePath(newPath));
    fs.writeJSONSync(getFilePath(`${folderPath}/${newId}/_folder.json`), {
      name: '新建文件夹',
      ...params,
      id: newId,
      path: `${folderPath}/${newId}`,
      createTime,
      updateTime: createTime,
    });
    return 200;
  },
  updateFolder(params) {
    const { id } = params;
    const pathname = pathMap.get(id) + '/_folder.json';
    const json = fs.readJSONSync(getFilePath(pathname));
    fs.writeJSONSync(getFilePath(pathname), {
      ...json,
      ...params,
    });
    return 200;
  },
  moveFolderToTrash(params) {
    const { id } = params;
    const pathname = pathMap.get(id);
    fs.moveSync(getFilePath(pathname), getFilePath(`trash/${id}`));
    return 200;
  },
  getDocList(params) {
    const { folder } = params;
    const folderPath = getFilePath(`document/${folder}`);
    fs.ensureDirSync(folderPath);
    const fileList = fs.readdirSync(folderPath);
    let docList = [];
    fileList.forEach(id => {
      if (/\w+\-\w+\-\w+\-\w+\-\w+\.json/.test(id)) {
        docList.push(fs.readJSONSync(`${folderPath}/${id}`));
      }
    });
    return docList;
  },
  addDoc(params) {
    const { folder } = params;
    const newId = uuid.v1();
    const newTime = new Date().getTime();
    fs.writeJSONSync(getFilePath(`document/${folder}/${newId}.json`), {
      id: newId,
      folder,
      tags: [],
      creatTime: newTime,
      updateTime: newTime,
      text: '# NEW DOCUMENT \n\n',
    });
  },
  getDoc(params) {
    const { folder, id } = params;
    const result = fs.readJSONSync(
      getFilePath(`document/${folder}/${id}.json`),
    );
    return result;
  },
  updateDoc(params) {
    const { text, folder, id } = params;
    const pathname = getFilePath(`document/${folder}/${id}.json`);
    const result = fs.readJSONSync(pathname);
    fs.writeJSONSync(pathname, {
      ...result,
      text,
    });
    return 200;
  },
};
