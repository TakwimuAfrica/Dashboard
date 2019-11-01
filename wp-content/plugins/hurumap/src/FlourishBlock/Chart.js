/* eslint-disable react/no-danger */
import React from 'react';

import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import propTypes from '../propTypes';

function Chart({ title, chartId, iframeKey }) {
  return (
    <InsightContainer
      hideInsight
      key={chartId}
      variant="analysis"
      loading={false}
      title={title}
    >
      <div />
      <div>
        <iframe
          key={iframeKey}
          frameBorder="0"
          scrolling="no"
          title={title}
          src={`/wp-json/hurumap-data/flourish/${chartId}/`}
        />
      </div>
    </InsightContainer>
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
