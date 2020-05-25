import React from 'react';
import Editor from '@/components/editor';
import StatusBar from '@/components/status-bar';

import '@/styles/home.less';

export default (props: any) => {
  return (
    <div className="home-container">
      <Editor />
      <StatusBar />
    </div>
  );
};
