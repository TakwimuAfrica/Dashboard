import React from 'react';
import { dataProps, TYPES } from '@hurumap-ui/content';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return <div {...dataProps(TYPES.FLOURISH_CHART, attributes)} />;
}

Save.propTypes = {
  attributes: propTypes.shape({
    chartWidth: propTypes.string,
    chartId: propTypes.chartId,
    title: propTypes.string,
    description: propTypes.string,
    showInsight: propTypes.bool,
    insightSummary: propTypes.string,
    insightTitle: propTypes.string,
    analysisCountry: propTypes.string,
    analysisLinkTitle: propTypes.string,
    dataLinkTitle: propTypes.string,
    dataGeoId: propTypes.string
  }).isRequired
};

export default Save;
