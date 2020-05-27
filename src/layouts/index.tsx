import React from 'react';
import Menu from '@/components/menu';

import '@/styles/home.less';

export default ({ children }) => {
  return (
    <div className="home-container">
      <div className="home-menu">
        <Menu />
      </div>
      <div className="home-children">{children}</div>
    </div>
  );
};
