import React from 'react';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      data-flourish-chart-id={attributes.chartId}
      data-chart-title={attributes.title}
    />
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    chartId: propTypes.chartId,
    title: propTypes.string
  }).isRequired
};

export default Save;
