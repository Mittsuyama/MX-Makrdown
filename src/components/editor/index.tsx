import React, { useState, useEffect, useRef } from 'react';
import { connect, useLocation } from 'umi';
import Codemirror from 'codemirror';

const { templeText } = require('@/utils/constant.js');
const { ipcRenderer, remote } = window.require('electron');

import './editor.less';
import 'codemirror/lib/codemirror.css';
import 'katex/dist/katex.min.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/keymap/vim';

const highLightJs = require('highlight.js');
import 'highlight.js/styles/github.css';

const md = require('markdown-it')({
  highlight: function(str: string, lang: string) {
    if (lang && highLightJs.getLanguage(lang)) {
      try {
        return (
          '<pre class="highLightJs"><code>' +
          highLightJs.highlight(lang, str, true).value +
          '</code></pre>'
        );
      } catch (__) {}
    }
    return (
      '<pre class="highLightJs"><code>' +
      md.utils.escapeHtml(str) +
      '</code></pre>'
    );
  },
})
  .use(require('@iktakahiro/markdown-it-katex'), {
    throwOnError: false,
    errorColor: ' #cc0000',
  })
  .use(require('markdown-it-container'), 'warning', {
    marker: ':',
  })
  .use(require('markdown-it-container'), 'tag', {
    marker: ':',
  })
  .use(require('markdown-it-multimd-table'), {
    rowspan: true,
  })
  .use(require('markdown-it-underline'))
  .use(require('markdown-it-plantuml'))
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-kbd'))
  .use(require('markdown-it-deflist'));

const Editor = ({ save, status, dispatch, hiostry }) => {
  const windowInnerHeight = window.innerHeight - 30;
  const codeRef = useRef(null);
  const readerRef = useRef(null);
  const readerContainerRef = useRef(null);
  const [codeMirror, setCodeMirror] = useState(null);
  const [value, setValue] = useState('');
  const [maxScreen, setMaxScren] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const {
      folder,
      id,
    } = /\/folder-management\/(?<folder>[\w-]+)\/(?<id>[\w-]+)/.exec(
      location.pathname,
    ).groups;
    const codeValue = value;

    Codemirror.Vim.defineEx('w', undefined, cm => {
      ipcRenderer.sendSync('updateDoc', { id, folder, text: cm.getValue() });
      dispatch({
        type: 'save/add',
      });
    });

    if (codeMirror !== null) {
      const result = ipcRenderer.sendSync('getDoc', { folder, id });
      codeMirror.setValue(result.text);
    }
  }, [location]);

  const handleEditorScroll = (scrollRate: number) => {
    if (codeMirror !== null) {
      //@ts-ignore
      const { height } = codeMirror.getScrollInfo();
      //@ts-ignore
      codeMirror.scrollTo(0, scrollRate * (height + 50 - windowInnerHeight));
    }
  };

  const handleReaderScroll = (scrollRate: number) => {
    const reader: any = readerRef.current;
    const container: any = readerContainerRef.current;
    reader.scrollTo(
      0,
      (container.offsetHeight - windowInnerHeight) * scrollRate,
    );
  };

  useEffect(() => {
    const {
      folder,
      id,
    } = /\/folder-management\/(?<folder>[\w-]+)\/(?<id>[\w-]+)/.exec(
      location.pathname,
    ).groups;
    const result = ipcRenderer.sendSync('getDoc', { folder, id });
    setValue(result.text);
    const options = {
      value: result.text,
      smartIndent: true,
      lineWrapping: true,
      keyMap: 'vim',
      mode: 'markdown',
    };

    if (codeRef !== null) {
      //@ts-ignore
      const codeMirror = Codemirror(codeRef.current, { ...options });
      setCodeMirror(codeMirror);
      codeMirror.on('change', () => {
        const value = codeMirror.getValue();
        setValue(value);
      });
      codeMirror.on('scroll', () => {
        const { top, height } = codeMirror.getScrollInfo();
        handleReaderScroll(top / (height + 50 - windowInnerHeight));
      });
    }
  }, [codeRef]);

  /*
  useEffect(() => {
    if (mousePosition === 0) {
      const reader: any = readerRef.current;
      const container: any = readerContainerRef.current;
      reader.scrollTo(
        0,
        (container.offsetHeight - windowInnerHeight) * scrollTop,
      );
    } else {
      if (codeMirror !== null) {
        //@ts-ignore
        const { height } = codeMirror.getScrollInfo();
        //@ts-ignore
        codeMirror.scrollTo(0, scrollTop * (height + 50 - windowInnerHeight));
      }
    }
  }, [scrollTop]);
  */

  const handleHeadDoubleClick = (event: any) => {
    if (maxScreen === 0) {
      const _ = ipcRenderer.sendSync('window-operation', 'max-screen');
      setMaxScren(1);
    } else {
      const _ = ipcRenderer.sendSync('window-operation', 'un-max-screen');
      setMaxScren(0);
    }
  };

  const handleReaderWheel = () => {
    const { scrollTop } = readerRef.current;
    const { offsetHeight } = readerContainerRef.current;
    const scrollRate = scrollTop / (offsetHeight - windowInnerHeight);
    handleEditorScroll(scrollRate);
  };

  const { view, menu } = status;

  return (
    <div className="editor-container">
      <div className="editor-head">
        <div className="vacant-box" onDoubleClick={handleHeadDoubleClick}></div>
        <div className="button-box" onClick={() => {}}>
          <i className="iconfont icon-more" />
        </div>
      </div>
      <div className="editor-main">
        <div
          className="codemirror"
          style={{ width: `${(3 - view) * 50}%` }}
          ref={codeRef}
        />
        <div
          className="reader"
          style={{ width: `${(view - 1) * 50}%` }}
          ref={readerRef}
          onWheel={handleReaderWheel}
        >
          <div
            id="reader-container"
            ref={readerContainerRef}
            dangerouslySetInnerHTML={{ __html: md.render(value) }}
          />
        </div>
      </div>
    </div>
  );
};

export default connect(({ save, status }) => ({
  save,
  status,
}))(Editor);
