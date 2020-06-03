const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');

const ipc = require('./ipc');
const getMenu = require('./menu.js');

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
  // mainWindow.loadFile(path.join(__dirname, '../build/index.html'));

  ipc.main();
  const menu = Menu.buildFromTemplate(getMenu(mainWindow));
  Menu.setApplicationMenu(menu);

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
