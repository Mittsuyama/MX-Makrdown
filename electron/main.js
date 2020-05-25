const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const api = require('./api');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    transparent: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.loadURL('http://localhost:8000');

  ipcMain.on('window-operation', (event, arg) => {
    if (arg === 'max-screen') {
      mainWindow.maximize();
    } else {
      mainWindow.unmaximize();
    }
    event.returnValue = 1;
  });

  api.main();

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
