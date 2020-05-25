import React from 'react';

import './status-bar.less';

export default (props: any) => {
  return (
    <div className="status-bar-container">
      <div className="status-bar-left">
        <div className="cursor-position">Ln 12, Col 48</div>
        <div className="tag-container">tags: computer, react</div>
        <div className="mod-select">vim, normal</div>
        <div className="view-select">1, 2, 3</div>
      </div>
      <div className="status-bar-right">
        <div className="document-name">React 官方文档学习笔记</div>
        <div className="create-time">创建日期：2020 年 5 月 25 日</div>
        <div className="font-count">fonts: {54590}</div>
      </div>
    </div>
  );
};
