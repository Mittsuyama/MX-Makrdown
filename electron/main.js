const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const ipc = require('./ipc');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    // backgroundColor: '#ffffff33',
    // transparent: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL('http://localhost:8000');

  ipc.main();

  ipcMain.on('window-operation', (event, arg) => {
    if (arg === 'max-screen') {
      mainWindow.maximize();
    } else {
      mainWindow.unmaximize();
    }
    event.returnValue = 1;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});
