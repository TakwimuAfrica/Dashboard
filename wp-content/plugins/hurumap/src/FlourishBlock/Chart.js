/* eslint-disable react/no-danger */
import React from 'react';

import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import makeStyles from '@material-ui/styles/makeStyles';
import propTypes from '../propTypes';

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: '1.25rem'
  },
  iframe: {}
});

function Chart({ title, description, chartId, iframeKey, ...props }) {
  const classes = useStyles(props);
  return (
    <InsightContainer
      hideInsight
      key={chartId}
      variant="analysis"
      loading={false}
      title={title}
      description={description}
      embedCode="embed text"
      actions={{
        handleShare: () => {}
      }}
    >
      <div />
      <div className={classes.root}>
        <iframe
          key={iframeKey}
          frameBorder="0"
          scrolling="no"
          title={title}
          src={`/wp-json/hurumap-data/flourish/${chartId}/`}
          className={classes.iframe}
        />
      </div>
    </InsightContainer>
  );
}

Chart.propTypes = {
  title: propTypes.string,
  description: propTypes.string,
  chartId: propTypes.string,
  iframeKey: propTypes.number
};

Chart.defaultProps = {
  title: undefined,
  description: undefined,
  chartId: undefined,
  iframeKey: undefined
};

export default Chart;
