const { remote } = window.require('electron');
const { Menu, MenuItem } = remote;

export default ({ fullscreen = false } = {}) => {
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: '视图',
      submenu: [
        { label: '只显示编辑器', click() {} },
        { label: '都显示', click() {} },
        { label: '只显示预览器', click() {} },
      ],
    }),
  );
  menu.append(
    new MenuItem({
      label: '隐藏菜单',
      type: 'checkbox',
      checked: fullscreen,
    }),
  );
  menu.append(
    new MenuItem({
      type: 'separator',
    }),
  );
  menu.append(
    new MenuItem({
      label: '修改标签',
      click() {},
    }),
  );
  menu.append(
    new MenuItem({
      label: '查看详情',
      click() {},
    }),
  );
  return menu;
};
