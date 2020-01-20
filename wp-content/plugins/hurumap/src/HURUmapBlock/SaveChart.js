import React from 'react';
import { dataProps, TYPES } from '@codeforafrica/hurumap-ui/cms';
import propTypes from '../propTypes';

function SaveChart({ attributes }) {
  return <div {...dataProps(TYPES.HURUMAP_CHART, attributes)} />;
}

SaveChart.propTypes = {
  attributes: propTypes.shape({
    chartWidth: propTypes.string,
    chartId: propTypes.chartId,
    geoId: propTypes.string,
    showInsight: propTypes.bool,
    showStatVisual: propTypes.bool,
    insightSummary: propTypes.string,
    insightTitle: propTypes.string,
    analysisCountry: propTypes.string,
    analysisLinkTitle: propTypes.string,
    dataLinkTitle: propTypes.string,
    dataGeoId: propTypes.string
  }).isRequired
};

export default SaveChart;
