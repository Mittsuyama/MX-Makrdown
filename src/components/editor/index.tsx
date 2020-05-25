import React, { useState, useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
const { templeText } = require('@/utils/constant.js');
const electron = window.require('electron');

import './editor.less';
import 'codemirror/lib/codemirror.css';
import 'katex/dist/katex.min.css';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/keymap/vim';

const highLightJs = require('highlight.js');
import 'highlight.js/styles/atom-one-light.css';

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
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-underline'));

export default (props: any) => {
  const codeRef = useRef(null);
  const readerRef = useRef(null);
  const readerContainerRef = useRef(null);
  const [codeMirror, setCodeMirror] = useState(null);
  const [value, setValue] = useState(templeText);
  const [mousePosition, setMousePosition] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const options = {
    value,
    lineNumbers: true,
    smartIndent: true,
    lineWrapping: true,
    keyMap: 'vim',
    mode: 'markdown',
  };

  useEffect(() => {
    if (codeRef !== null) {
      //@ts-ignore
      const codeMirror = Codemirror(codeRef.current, { ...options });
      setCodeMirror(codeMirror);
      codeMirror.on('change', () => {
        setValue(codeMirror.getValue());
      });
      codeMirror.on('scroll', () => {
        if (mousePosition === 0) {
          const { top, height } = codeMirror.getScrollInfo();
          setScrollTop(top / (height - window.innerHeight));
        }
      });
    }
  }, [codeRef]);

  useEffect(() => {
    if (mousePosition === 0) {
      const reader: any = readerRef.current;
      const container: any = readerContainerRef.current;
      reader.scrollTo(
        0,
        (container.offsetHeight - window.innerHeight) * scrollTop,
      );
    } else {
      if (codeMirror !== null) {
        //@ts-ignore
        const { height } = codeMirror.getScrollInfo();
        //@ts-ignore
        codeMirror.scrollTo(0, scrollTop * (height - window.innerHeight));
      }
    }
  }, [scrollTop]);

  const readerScroll = (event: any) => {
    if (mousePosition === 1) {
      const el: any = event.target;
      const container: any = readerContainerRef.current;
      const { offsetHeight } = container;
      const { scrollTop } = el;
      setScrollTop(scrollTop / (offsetHeight - window.innerHeight));
    }
  };

  return (
    <div className="editor-container">
      <div
        className="codemirror"
        ref={codeRef}
        onMouseEnter={() => setMousePosition(0)}
      />
      <div
        className="reader"
        ref={readerRef}
        onMouseEnter={() => setMousePosition(1)}
        onScroll={readerScroll}
      >
        <div
          id="reader-container"
          ref={readerContainerRef}
          dangerouslySetInnerHTML={{ __html: md.render(value) }}
        />
      </div>
    </div>
  );
};
