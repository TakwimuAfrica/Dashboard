/* eslint-disable react/no-danger */
import React, { useState } from 'react';

import { makeStyles } from '@material-ui/styles';
import propTypes from '../propTypes';

const useStyles = makeStyles({
  root: {
    width: '100%'
  }
});

function Chart({ attributes: { title, chartId } }) {
  const classes = useStyles();
  const [animated, setAnimated] = useState(false);
  const [animatedId, setAnimatedId] = useState('');

  const updateIframe = (iframe, wrapper) => {
    /* eslint-disable no-param-reassign */
    // In rear cases we don't have `wrapper` element to reference from, just
    // provide a default height to start
    const height =
      wrapper && wrapper.offsetHeight > 420 ? wrapper.offsetHeight : 420;
    iframe.style.height = `${height}px`;
    iframe.contentDocument.body.style.background = 'rgb(0,0,0) !important';
    const headers = iframe.contentDocument.getElementsByClassName(
      'flourish-header'
    );
    if (headers && headers.length) {
      headers[0].style.display = 'none';
    }
  };

  const handleIframeLoaded = e => {
    const iframe = e.target;
    // Most static charts have a wrapper element with id `wrapper`
    const wrapper = iframe.contentDocument.getElementById('wrapper');
    if (wrapper) {
      updateIframe(iframe, wrapper);
    } else {
      // The animated charts may or may not contain a wrapping element.
      // In case there is one, store its id in the component state for easier
      // lookup
      let wrapperId = '';
      if (iframe.contentDocument.getElementById('flourish-popup-constrainer')) {
        wrapperId = 'flourish-popup-constrainer';
      }
      setAnimated(true);
      setAnimatedId(wrapperId);
    }

    // Add htm2canvas
    const frameHead = iframe.contentDocument
      .getElementsByTagName('head')
      .item(0);
    const script = iframe.contentDocument.createElement('script');
    script.type = 'text/javascript';
    script.src =
      'https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.1/dist/html2canvas.min.js';
    frameHead.appendChild(script);

    // Override `body` inline style
    const style = iframe.contentDocument.createElement('style');
    style.type = 'text/css';
    style.append('body[style] { background: none !important; }');
    frameHead.appendChild(style);
  };

  if (animated) {
    const iframe = document.getElementById(
      `data-indicator-flourish-${chartId}`
    );
    updateIframe(iframe, iframe.contentDocument.getElementById(animatedId));
  }
  return (
    <>
      <iframe
        id={`data-indicator-flourish-${chartId}`}
        frameBorder="0"
        scrolling="no"
        title={title}
        onLoad={handleIframeLoaded}
        src={`/wp-json/hurumap-data/flourish/${chartId}`}
        className={classes.root}
      />
      <div id={`data-indicator-flourish-actions-${chartId}`} />
    </>
  );
}

Chart.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    chartId: propTypes.chartId
  }).isRequired
};

export default Chart;
