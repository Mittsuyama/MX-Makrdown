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

    const result = {
      ...info,
      children,
    };
    return result;
  };

  let folderList = [];
  fs.ensureDirSync(path.join(workPath, 'folder'));
  const fileList = fs.readdirSync(getFilePath('folder'));
  fileList.forEach(id => {
    if (/\w+\-\w+\-\w+\-\w+\-\w+/.test(id)) {
      folderList.push(getFileLoop(`folder/${id}`));
    }
  });
  return folderList;
};

// get folder list
let folderList = globalGetFolderList(true);

// api export
module.exports = {
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
      ...params,
      id: newId,
      createTime,
      updateTime: createTime,
    });
    return 200;
  },
};
