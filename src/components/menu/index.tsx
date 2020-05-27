import React, { useState, useEffect } from 'react';
import Modal from '@/components/modal';

import './menu.less';

const { ipcRenderer } = window.require('electron');

export default () => {
  const [folder, setFolder] = useState([]);
  const [modal, setModal] = useState({
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

  useEffect(() => {
    // fetch folder list
  }, []);

  const handleNewFolderModal = (params: any) => {
    setModal({
      ...modal,
      show: true,
      title: '新建文件夹',
    });
    // const result = ipcRednerer.sendSync('newFolder', params);
  };

  const handleNewFolder = (folder, name) => {
    ipcRenderer.sendSync('newFolder', { folder, name });
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
            onClick={() => handleNewFolderModal()}
          />
        </div>
        main
      </div>
      <Modal {...modal} ok={title => handleNewFolder(0, title)} />
    </div>
  );
};
