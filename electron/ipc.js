const api = require('./api');
const { ipcMain } = require('electron');

module.exports = {
  main() {
    const userPre = api.getUserPreferences();
    const folderList = api.getFolderList();

    ipcMain.on('getUserPre', (event, arg) => {
      event.returnValue = userPre;
    });

    ipcMain.on('updateUserPre', (event, arg) => {
      event.returnValue = api.updateUserPre(arg);
    });

    ipcMain.on('newFolder', (event, arg) => {
      event.returnValue = api.newFolder(arg);
    });

    ipcMain.on('getFolderList', (event, arg) => {
      event.returnValue = api.getFolderList();
    });

    ipcMain.on('updateFolder', (event, arg) => {
      event.returnValue = api.updateFolder(arg);
    });

    ipcMain.on('moveFolderToTrash', (event, arg) => {
      event.returnValue = api.moveFolderToTrash(arg);
    });

    ipcMain.on('getDocList', (event, arg) => {
      event.returnValue = api.getDocList(arg);
    });

    ipcMain.on('addDoc', (event, arg) => {
      event.returnValue = api.addDoc(arg);
    });

    ipcMain.on('getDoc', (event, arg) => {
      event.returnValue = api.getDoc(arg);
    });
    ipcMain.on('updateDoc', (event, arg) => {
      event.returnValue = api.updateDoc(arg);
    });
  },
};
