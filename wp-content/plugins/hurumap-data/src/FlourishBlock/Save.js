import React from 'react';
import propTypes from '../propTypes';
import Chart from './Chart';

function Save({ attributes: { title, chartId } }) {
  return <Chart title={title} chartId={chartId} />;
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    chartId: propTypes.string,
    description: propTypes.string
  }).isRequired
};

export default Save;
