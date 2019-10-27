import React from 'react';
import propTypes from '../propTypes';

function SaveChart({ attributes }) {
  return (
    <div
      style={{ width: attributes.chartWidth }}
      data-chart-id={attributes.chartId}
      data-geo-type={attributes.geoId}
      data-width={attributes.chartWidth}
    />
  );
}

SaveChart.propTypes = {
  attributes: propTypes.shape({
    chartWidth: propTypes.string,
    chartId: propTypes.chartId,
    geoId: propTypes.string
  }).isRequired
};

export default SaveChart;
