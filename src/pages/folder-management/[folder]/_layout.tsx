import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';

import '@/styles/folder.less';

const { ipcRenderer, remote } = window.require('electron');
const { Menu, MenuItem } = remote;

const Layout = (props: any) => {
  const { pathname } = history.location;
  const { children, status, save } = props;
  const { folder } = /\/folder-management\/(?<folder>[\w-]+)/.exec(pathname).groups;

  const [docList, setDocList] = useState([]);

  let pathSelectDoc = '';
  if(/\/folder-management\/[\w-]+\/[\w-]+/.test(pathname)) {
    pathSelectDoc = /\/folder-management\/[\w-]+\/(?<id>[\w-]+)/.exec(pathname).groups.id;
  }
  const [selectDoc, setSelectDoc] = useState(pathSelectDoc);

  const fetch = () => {
    const result = ipcRenderer.sendSync('getDocList', { folder });
    setDocList(result);
  };

  history.listen((location) => {
    const { pathname } = location;
    ipcRenderer.sendSync('updateUserPre', { last: pathname });
  });

  useEffect(() => {
    fetch();
  }, [folder, save]);

  const handleAddDocRequest = () => {
    const id = ipcRenderer.sendSync('addDoc', { folder });
    history.push(`/folder-management/${folder}/${id}`);
    fetch();
  };

  const docItemRedender = (item) => {
    const regResult = /\#\s(?<title>[^\n]+)/g.exec(item.text);
    const title = regResult !== null ? regResult.groups.title : 'NEW DOCUMENT';
    const text = item.text.replace('# ' + title, '');
    return (
      <div
        className="doc-item"
        style={selectDoc === item.id ? { backgroundColor: '#eee'} : null }
        key={item.id}
        onClick={e => {
          setSelectDoc(item.id);
          history.push(`/folder-management/${folder}/${item.id}`);
        }}
      >
        <div className="title">{title}</div>
        <div className="text">{text}</div>
      </div>
    );
  };

  return (
    <div className="folder-container">
      <div className="folder-list" style={{ display: status.menu ? 'block' : 'none' }}>
        <div className="head">
          <div className="input-box">
            <i className="search iconfont icon-search" />
            <input placeholder="搜索文档" />
          </div>
          <i
            className="add iconfont icon-tianjiawenjian"
            onClick={() => handleAddDocRequest()}
          />
        </div>
        <div className="main">
          {docList.map(item => docItemRedender(item))}
        </div>
      </div>
      <div className="editor">{ children }</div>
    </div>
  );
};

export default connect(({ status, save }) => ({
  status,
  save,
}))(Layout);

