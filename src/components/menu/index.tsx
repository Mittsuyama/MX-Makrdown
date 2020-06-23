import React, { useState, useEffect } from 'react';
import Modal from '@/components/modal';
import { history } from 'umi';

import './menu.less';

const { ipcRenderer, remote } = window.require('electron');
import newMenu from './folder_menu.ts';

export default () => {
  const { pathname } = history.location;
  let temp = '';
  if (/\/folder-management\/[\w-]+/g.test(pathname)) {
    temp = /\/folder-management\/(?<folder>[\w-]+)/g.exec(pathname).groups
      .folder;
  }
  const [selectFolder, setSelectFolder] = useState(temp);

  const [folderList, setFolderList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modal, setModal] = useState({
    id: 0,
    title: '新建文件夹',
    ok: () => {},
    changeShow(value: boolean) {
      setShowModal(value);
    },
  });

  const menuList = [
    { title: '所有文档', name: 'doc', icon: 'paper' },
    { title: '标签', name: 'tag', icon: 'tag-o' },
    { title: '收藏文档', name: 'star', icon: 'star' },
    { title: '图片', name: 'iamge', icon: 'tupian' },
    { title: '废纸篓', name: 'trash', icon: 'trash' },
  ];

  const fetch = () => {
    const result = ipcRenderer.sendSync('getFolderList', {});
    setFolderList(result);
  };

  useEffect(() => {
    fetch();
  }, []);

  const updateExpandFolder = (id: string, expand: boolean) => {
    ipcRenderer.sendSync('updateFolder', { id, expand });
  };

  const sendNewFolderRquest = (name: string, id: string) => {
    ipcRenderer.sendSync('newFolder', { folder: id, name });
    if (modal.id !== 0) updateExpandFolder(id, true);
    fetch();
  };

  const handleNewFolderRequest = (id: string) => {
    setModal({
      ...modal,
      title: '新建文件夹',
      ok: value => sendNewFolderRquest(value, id),
    });
    setShowModal(true);
  };

  const moveFolderToTrashRequest = (id: string) => {
    ipcRenderer.sendSync('moveFolderToTrash', { id });
    fetch();
  };

  const sendRenameRequest = (name: string, id: string) => {
    ipcRenderer.sendSync('updateFolder', { id, name });
    fetch();
  };

  const rename = (id: string) => {
    setModal({
      ...modal,
      title: '重命名',
      ok: value => sendRenameRequest(value, id),
    });
    setShowModal(true);
  };

  const renderFolderList = (layer, info) => {
    let style = { paddingLeft: layer * 20 };
    if (selectFolder === info.id) {
      style = { ...style, backgroundColor: '#dfdfdf' };
    }
    return (
      <div className="folder-item" key={info.id}>
        <div
          className="title"
          style={style}
          onClick={e => {
            e.stopPropagation();
            if (selectFolder !== info.id) {
              history.push(`/folder-management/${info.id}`);
            }
            setSelectFolder(info.id);
          }}
          onContextMenu={e => {
            e.stopPropagation();
            newMenu({
              id: info.id,
              newFolder: handleNewFolderRequest,
              moveToTrash: moveFolderToTrashRequest,
              rename: rename,
            }).popup({
              window: remote.getCurrentWindow(),
            });
          }}
        >
          {info.children.length > 0 ? (
            <i
              className={`iconfont icon-${info.expand ? 'below' : 'right'}-s`}
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                updateExpandFolder(info.id, !info.expand);
                fetch();
              }}
            />
          ) : (
            <span style={{ width: 23 }} />
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
          <span className="title">
            <i className="iconfont icon-folder1" />
            文件夹
          </span>
          <i
            className="iconfont icon-tianjia"
            onClick={() => {
              handleNewFolderRequest(0);
            }}
          />
        </div>
        <div className="folder-box">
          {folderList.map(item => renderFolderList(1, item))}
        </div>
      </div>
      <div className="bottom-box">
        <i className="iconfont icon-refresh" />
      </div>
      <Modal show={showModal} {...modal} />
    </div>
  );
};
