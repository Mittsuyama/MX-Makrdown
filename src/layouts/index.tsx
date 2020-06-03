import React, { useEffect } from 'react';
import Menu from '@/components/menu';
import { connect } from 'umi';
import mouseTrap from 'mousetrap';

const { ipcRenderer } = window.require('electron');

import '@/styles/home.less';

const HomeLayout = ({ dispatch, status, children }) => {
  ipcRenderer.once('change-view', (event, arg) => {
    console.log(arg);
    if (arg === 'l') {
      dispatch({
        type: 'status/update',
        payload: { menu: !status.menu },
      });
    } else {
      dispatch({
        type: 'status/update',
        payload: { view: arg },
      });
    }
  });

  return (
    <div className="home-container">
      <div
        className="home-menu"
        style={{ display: status.menu ? 'block' : 'none' }}
      >
        <Menu />
      </div>
      <div className="home-children">{children}</div>
    </div>
  );
};

export default connect(({ status }) => ({
  status,
}))(HomeLayout);
