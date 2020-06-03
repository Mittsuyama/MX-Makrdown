const { app, Menu } = require('electron');

module.exports = contents => {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac
      ? [
          {
            label: 'MX-MARKDOWN',
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: '文件',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
              },
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
      ],
    },
    {
      label: '视图',
      submenu: [
        {
          label: '只显示编辑器',
          accelerator: 'CmdOrCtrl+1',
          click() {
            contents.webContents.send('change-view', 1);
          },
        },
        {
          label: '都显示',
          accelerator: 'CmdOrCtrl+2',
          click() {
            contents.webContents.send('change-view', 2);
          },
        },
        {
          label: '只显示预览器',
          accelerator: 'CmdOrCtrl+3',
          click() {
            contents.webContents.send('change-view', 3);
          },
        },
        {
          label: '隐藏/显示菜单栏',
          accelerator: 'CmdOrCtrl+shift+l',
          click() {
            contents.webContents.send('change-view', 'l');
          },
        },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ];

  return template;
};
