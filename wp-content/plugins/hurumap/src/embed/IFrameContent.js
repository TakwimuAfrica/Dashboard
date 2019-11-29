import React from 'react';

import ReactResizeDetector from 'react-resize-detector';

import propTypes from '../propTypes';

function IframeContent({ children, expanded }) {
  const queryParams = new URLSearchParams(window.location.search);
  const onResize = (_width, height) => {
    if (window.frameElement) {
      window.frameElement.style.height = `${height}px`;
      window.frameElement.style.width = expanded
        ? '100%'
        : queryParams.get('width');
    } else {
      window.parent.postMessage(
        {
          id: `hurumap-card-${queryParams.get('id')}`,
          height: `${height}px`,
          width: expanded ? '100%' : queryParams.get('width')
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
  children: propTypes.children.isRequired,
  expanded: propTypes.bool.isRequired
};

export default IframeContent;
