const fs = require('fs-extra');
const path = require('path');
const { dialog } = require('electron');
const uuid = require('uuid');

const getPath = pathname => path.join(__dirname, pathname);

module.exports = {
  getUserPreferences() {
    let userPre = fs.readJsonSync(getPath('./user.json'));
    const { pathname } = userPre;
    if (pathname.length < 3 || !fs.pathExistsSync(pathname)) {
      const workPath = dialog.showOpenDialogSync({
        properties: ['openDirectory'],
      })[0];
      userPre = {
        ...userPre,
        pathname: workPath,
      };
      fs.writeJSONSync(getPath('./user.json'), userPre);
    }
    return userPre;
  },
  getFolderList(workPath) {
    fs.ensureDirSync(path.join(workPath, 'folder'));
    const fileList = fs.readdirSync(path.join(workPath, 'folder'));
    const folderList = fileList.filter(value => {
      if (value.substr(0, 7) === 'folder-') {
        return true;
      }
    });
    console.log(folderList);
  },
  newFolder(workPath, params) {
    const newId = uuid.v1();
    const createTime = new Date().getTime();
    fs.ensureDirSync(path.join(workPath, 'folder'));
    fs.writeJSONSync(path.join(workPath, `folder/folder-${newId}.json`), {
      ...params,
      createTime,
      updateTime: createTime,
    });
  },
};
