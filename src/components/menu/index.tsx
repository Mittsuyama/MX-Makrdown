import React, { useState, useEffect } from 'react';
import Modal from '@/components/modal';

import './menu.less';

const { ipcRenderer, remote } = window.require('electron');
import newMenu from './folder_menu.ts';

export default () => {
  const [folderList, setFolderList] = useState([]);
  const [selectFolder, setSelectFolder] = useState('');
  const [modal, setModal] = useState({
    folder: 0,
    show: false,
    title: '新建文件夹',
    changeShow(isShow: bool) {
      setModal({
        ...modal,
        show: isShow,
      });
    },
  });

  const menuList = [
    { title: '所有文档', name: 'docuemnt', icon: 'document' },
    { title: '所有标签', name: 'tag', icon: 'tag' },
    { title: '标星', name: 'star', icon: 'star' },
    { title: '图片管理', name: 'iamge', icon: 'tupian' },
    { title: '废纸篓', name: 'trash', icon: 'shanchu' },
  ];

  const fetch = () => {
    const result = ipcRenderer.sendSync('getFolderList', {});
    console.log(result);
    setFolderList(result);
    // setFolderList(ipcRenderer.sendSync('getFolderList', {}));
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleNewFolderRequest = () => {
    setModal({
      ...modal,
      show: true,
      title: '新建文件夹',
    });
  };

  const sendNewFolderRquest = name => {
    ipcRenderer.sendSync('newFolder', { folder: selectFolder, name });
    fetch();
  };

  const folderMenu = newMenu({
    newFolder: handleNewFolderRequest,
  });

  const renderFolderList = (layer, info) => {
    return (
      <div className="folder-item" key={info.id}>
        <div
          className="title"
          style={{ paddingLeft: layer * 25 }}
          onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
            setSelectFolder(info.id);
            folderMenu.popup({
              window: remote.getCurrentWindow(),
            });
          }}
        >
          {info.children.length > 0 ? (
            <i
              className={`iconfont icon-${info.expand ? 'below' : 'right'}-s`}
            />
          ) : (
            <span style={{ width: 18 }} />
          )}
          <span>{info.name}</span>
        </div>
        <div className="children">
          {info.children.length > 0 &&
            info.expand &&
            info.children.map(item => renderFolderList(layer + 1, item))}
        </div>
      </div>
    );
  };

  return (
    <div className="menu-container">
      <div className="grap-region" />
      <div className="menu-head">
        {menuList.map(item => {
          return (
            <div className="menu-item" key={item.name}>
              <i className={`iconfont icon-${item.icon}`} />
              <span className="menu-title">{item.title}</span>
            </div>
          );
        })}
      </div>
      <div className="menu-main">
        <div className="menu-title">
          <span className="title">文件夹</span>
          <i
            className="iconfont icon-tianjia"
            onClick={() => {
              setSelectFolder(0);
              handleNewFolderRequest();
            }}
          />
        </div>
        <div className="folder-container">
          {folderList.map(item => renderFolderList(1, item))}
        </div>
      </div>
      <div className="bottom-box">同步</div>
      <Modal {...modal} ok={title => sendNewFolderRquest(title)} />
    </div>
  );
};
