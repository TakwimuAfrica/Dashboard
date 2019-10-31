/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import makeStyles from '@material-ui/styles/makeStyles';
import propTypes from '../propTypes';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  title: {
    fontWeight: 'bold',
    lineHeight: 1.2,
    marginBottom: '0.625rem'
  },
  flourishContainer: {
    padding: '0.625rem',
    backgroundColor: theme.palette.data.light,
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      padding: '1.25rem'
    }
  }
}));

function Chart({ title, chartId, iframeKey }) {
  const classes = useStyles();
  const [animated, setAnimated] = useState(false);
  const [animatedId, setAnimatedId] = useState('');

  useEffect(
    () => {
      let timer1;
      if (animated) {
        timer1 = setTimeout(() => setAnimated(true), 1000);
      }

      return () => {
        if (timer1) {
          clearTimeout(timer1);
        }
      };
    },
    [animated] // useEffect will run only one time
  );

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
    if (iframe) {
      // Most static charts have a wrapper element with id `wrapper`
      const wrapper = iframe.contentDocument.getElementById('wrapper');
      if (wrapper) {
        updateIframe(iframe, wrapper);
      } else {
        // The animated charts may or may not contain a wrapping element.
        // In case there is one, store its id in the component state for easier
        // lookup
        let wrapperId = '';
        if (
          iframe.contentDocument.getElementById('flourish-popup-constrainer')
        ) {
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
    }
  };
  if (animated) {
    const animatedIframe = document.getElementById(
      `data-indicator-flourish-${chartId}`
    );
    if (animatedIframe) {
      updateIframe(
        animatedIframe,
        animatedIframe.contentDocument.getElementById(animatedId)
      );
    }
  }

  return (
    <div className={classes.flourishContainer}>
      <Grid container direction="column" alignItems="center">
        <Typography align="center" className={classes.title}>
          {title}
        </Typography>
        <iframe
          id={`data-indicator-flourish-${chartId}`}
          key={iframeKey}
          frameBorder="0"
          scrolling="no"
          title={title}
          onLoad={handleIframeLoaded}
          src={`/wp-json/hurumap-data/flourish/${chartId}/`}
          className={classes.root}
        />
      </Grid>
    </div>
  );
}

Chart.propTypes = {
  title: propTypes.string,
  chartId: propTypes.string,
  iframeKey: propTypes.number
};

Chart.defaultProps = {
  title: undefined,
  chartId: undefined,
  iframeKey: undefined
};

export default Chart;
