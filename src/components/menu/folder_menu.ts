const { remote, ipcRenderer } = window.require('electron');
const { Menu, MenuItem } = remote;

export default (props: any) => {
  const { newFolder, moveToTrash, rename, id } = props;
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: '新建子文件夹',
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
      click() {},
    }),
  );
  menu.append(
    new MenuItem({
      label: '移动到废纸篓',
      click() {
        moveToTrash(id);
      },
    }),
  );
  menu.append(
    new MenuItem({
      label: '重命名',
      click() {
        rename(id);
      },
    }),
  );
  menu.append(
    new MenuItem({
      label: '标记为收藏',
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
      label: `文件夹 ID: ${id.substr(0, 12) + ' ...'}`,
    }),
  );
  menu.append(
    new MenuItem({
      label: `复制文件夹 ID`,
    }),
  );
  menu.append(
    new MenuItem({
      label: '详细信息',
      click() {},
    }),
  );

  return menu;
};
