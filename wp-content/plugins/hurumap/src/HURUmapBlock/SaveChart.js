import React from 'react';
import propTypes from '../propTypes';

function SaveChart({ attributes }) {
  return (
    <div
      id={`indicator-hurumap-${attributes.chartId}`}
      style={{ width: attributes.chartWidth }}
      data-chart-id={attributes.chartId}
      data-geo-type={attributes.geoId}
      data-hide-insight={attributes.hideInsight}
      data-hide-statvisual={attributes.hideStatVisual}
      data-insight-title={attributes.insightTitle}
      data-insight-summary={attributes.insightSummary}
      data-width={attributes.chartWidth}
    />
  );
}

SaveChart.propTypes = {
  attributes: propTypes.shape({
    chartWidth: propTypes.string,
    chartId: propTypes.chartId,
    geoId: propTypes.string,
    hideInsight: propTypes.bool,
    hideStatVisual: propTypes.bool,
    insightSummary: propTypes.string,
    insightTitle: propTypes.string
  }).isRequired
};

export default SaveChart;
