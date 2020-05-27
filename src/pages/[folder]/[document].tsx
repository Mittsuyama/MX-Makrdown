import React from 'react';
import Editor from '@/components/editor';
import StatusBar from '@/components/status-bar';

import '@/styles/document.less';

export default (props: any) => {
  return (
    <div className="document-container">
      <Editor />
      <StatusBar />
    </div>
  );
};

