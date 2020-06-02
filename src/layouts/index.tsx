import React, { useEffect } from 'react';
import Menu from '@/components/menu';
import { connect } from 'umi';
import mouseTrap from 'mousetrap';

import '@/styles/home.less';

const HomeLayout = ({ dispatch, status, children }) => {
  mouseTrap.bind('command+1', () =>
    dispatch({ type: 'status/update', payload: { view: 1 } }),
  );
  mouseTrap.bind('command+2', () =>
    dispatch({ type: 'status/update', payload: { view: 2 } }),
  );
  mouseTrap.bind('command+3', () =>
    dispatch({ type: 'status/update', payload: { view: 3 } }),
  );
  mouseTrap.bind('command+l', () =>
    dispatch({ type: 'status/update', payload: { menu: !status.menu } }),
  );

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
