import React from 'react';
import propTypes from '../propTypes';

function SaveChart({ attributes }) {
  return (
    <div
      id={`indicator-hurumap-${attributes.chartId}`}
      style={{ width: attributes.chartWidth }}
      data-chart-id={attributes.chartId}
      data-geo-type={attributes.geoId}
      data-show-insight={attributes.showInsight}
      data-show-statvisual={attributes.showStatVisual}
      data-insight-title={attributes.insightTitle}
      data-insight-summary={attributes.insightSummary}
      data-data-link-title={attributes.dataLinkTitle}
      data-analysis-link-href={`/profiles/${attributes.analysisCountry}`}
      data-analysis-link-title={attributes.analysisLinkTitle}
      data-data-geoId={attributes.dataGeoId}
      data-width={attributes.chartWidth}
    />
  );
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
