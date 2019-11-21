import React from 'react';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      id={`indicator-flourish-${attributes.chartId}`}
      data-chart-id={attributes.chartId}
      data-chart-title={attributes.title}
      data-chart-description={attributes.description}
      data-show-insight={attributes.showInsight}
      data-insight-title={attributes.insightTitle}
      data-insight-summary={attributes.insightSummary}
      data-data-link-title={attributes.dataLinkTitle}
      data-analysis-country={attributes.analysisCountry}
      data-analysis-link-title={attributes.analysisLinkTitle}
      data-data-geo-id={attributes.dataGeoId}
    />
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
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
