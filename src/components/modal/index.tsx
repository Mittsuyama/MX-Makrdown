import React, { useState, useEffect, useRef } from 'react';

import './modal.less';

export default ({ ok, changeShow, title, show }) => {
  const inputRef = useRef(null);
  const [display, setDisplay] = useState({
    display: 'none',
  });
  const [dialog, setDialog] = useState({
    top: 0,
    opacity: 0,
  });

  useEffect(() => {
    if (show) {
      setDisplay({ display: 'block' });
      setTimeout(() => {
        inputRef.current.focus();
        setDialog({ top: 100, opacity: 1 });
      }, 20);
    } else {
      setDialog({ top: 0, opacity: 0 });
      setTimeout(() => {
        setDisplay({ display: 'none' });
      }, 250);
    }
  }, [show]);

  const handleInputKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      handleOk();
    }
  };

  const handleOk = () => {
    ok(inputRef.current.value);
    setTimeout(() => {
      inputRef.current.value = '';
    }, 200);
    changeShow(false);
  };

  return (
    <div
      className="modal-container"
      style={display}
      onClick={() => changeShow(false)}
    >
      <div
        className="modal-dialog"
        style={dialog}
        onClick={e => e.stopPropagation()}
      >
        <div className="title">{title}</div>
        <div className="input-box">
          <input ref={inputRef} onKeyUp={handleInputKeyUp} />
        </div>
        <div className="button-box">
          <span className="button ok" onClick={() => handleOk()}>
            确认
          </span>
          <span className="button cancel" onClick={() => changeShow(false)}>
            取消
          </span>
        </div>
      </div>
    </div>
  );
};
