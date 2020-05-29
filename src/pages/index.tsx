import React from 'react';
import Editor from '@/components/editor';
import StatusBar from '@/components/status-bar';
import { history } from 'umi';

const { ipcRenderer } = window.require('electron');

import '@/styles/document.less';

export default () => {
  const { last } = ipcRenderer.sendSync('getUserPre');
  if (last.length > 5) {
    history.push(last);
  }
  return <div></div>;
};
