import React from 'react';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      id={`indicator-flourish-${attributes.chartId}`}
      data-chart-id={attributes.chartId}
      data-chart-title={attributes.title}
      data-chart-description={attributes.description}
    />
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    chartId: propTypes.chartId,
    title: propTypes.string,
    description: propTypes.string
  }).isRequired
};

export default Save;
