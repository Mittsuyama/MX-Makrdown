import React from 'react';
import { connect } from 'umi';

import './status-bar.less';

const statusBar = ({ dispatch, status }) => {
  const { name, cursor, font } = status;
  const { line, ch } = cursor;

  return (
    <div className="status-bar-container">
      <div className="status-bar-box left">
        <div className="function tag-container">TAGS: Computer, React</div>
        <div className="function mod-select">VIM, NORMAL</div>
        <div className="function view-select">VIEW:</div>
        <div className="function cursor-position">
          Ln: {line}, Col: {ch}
        </div>
      </div>
      <div className="status-bar-box right">
        <div className="function document-name">{name}</div>
        <div className="function create-time">创建日期：2020 年 5 月 25 日</div>
        <div className="function font-count">字数: {font}</div>
      </div>
    </div>
  );
};

export default connect(({ status }) => ({
  status,
}))(statusBar);
