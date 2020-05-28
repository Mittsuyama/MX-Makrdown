const api = require('./api');
const { ipcMain } = require('electron');

module.exports = {
  main() {
    const userPre = api.getUserPreferences();
    const folderList = api.getFolderList();

    ipcMain.on('getUserPreferences', (event, arg) => {
      event.returnValue = userPre;
    });

    ipcMain.on('newFolder', (event, arg) => {
      const result = api.newFolder(arg);
      event.returnValue = result;
    });

    ipcMain.on('getFolderList', (event, arg) => {
      const result = api.getFolderList();
      event.returnValue = result;
    });
  },
};
