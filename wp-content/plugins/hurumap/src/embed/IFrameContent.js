import React from 'react';

import ReactResizeDetector from 'react-resize-detector';

import propTypes from '../propTypes';

function IframeContent({ children }) {
  const queryParams = new URLSearchParams(window.location.search);
  const onResize = (width, height) => {
    if (window.frameElement) {
      window.frameElement.style.height = `${height}px`;
    } else {
      window.parent.postMessage(
        {
          id: `hurumap-card-${queryParams.get('id')}`,
          height: `${height}px`,
          width: `${width}px`
        },
        '*'
      );
    }
  };
  /**
   * document.domain = 'localhost';
   */
  return (
    <>
      <ReactResizeDetector handleWidth handleHeight onResize={onResize} />
      {children}
    </>
  );
}

IframeContent.propTypes = {
  children: propTypes.children.isRequired
};

export default IframeContent;
