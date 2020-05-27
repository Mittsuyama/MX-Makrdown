const api = require('./api');
const { ipcMain } = require('electron');

module.exports = {
  main() {
    const userPre = api.getUserPreferences();
    const { pathname: workPath } = userPre;
    const folderList = api.getFolderList(workPath);

    ipcMain.on('getUserPreferences', (event, arg) => {
      event.returnValue = userPre;
    });

    ipcMain.on('newFolder', (event, arg) => {
      api.newFolder(workPath, arg);
      event.returnValue = 200;
    });
  },
};
