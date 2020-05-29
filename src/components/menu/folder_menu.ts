const { remote, ipcRenderer } = window.require('electron');
const { Menu, MenuItem } = remote;

export default (props: any) => {
  const { newFolder, moveToTrash, rename, id } = props;
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: '新建子文件夹',
      type: 'normal',
      click() {
        newFolder(id);
      },
    }),
  );
  menu.append(
    new MenuItem({
      type: 'separator',
    }),
  );
  menu.append(
    new MenuItem({
      label: '移动到...',
      type: 'normal',
      click() {},
    }),
  );
  menu.append(
    new MenuItem({
      label: '移动到废纸篓',
      type: 'normal',
      click() {
        moveToTrash(id);
      },
    }),
  );
  menu.append(
    new MenuItem({
      label: '重命名',
      type: 'normal',
      click() {
        rename(id);
      },
    }),
  );
  menu.append(
    new MenuItem({
      type: 'separator',
    }),
  );
  menu.append(
    new MenuItem({
      label: `文件夹 ID: ${id}`,
      type: 'normal',
    }),
  );
  menu.append(
    new MenuItem({
      label: '详细信息',
      type: 'normal',
      click() {},
    }),
  );

  return menu;
};
