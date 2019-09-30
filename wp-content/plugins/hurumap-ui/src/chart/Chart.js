import React, { useMemo } from 'react';

import { __ } from '@wordpress/i18n';

import { ChartContainer } from '@codeforafrica/hurumap-ui';
import { Placeholder } from '@wordpress/components';
import ChartFactory from '../ChartFactory';

import useChartDefinitions from '../data/useChartDefinitions';
import useProfileLoader from '../data/useProfileLoader';
import propTypes from '../propTypes';

function Chart({ geoId, chartId }) {
  const sections = useChartDefinitions();
  const charts = useMemo(
    () => sections.reduce((a, b) => a.concat(b.charts), []),
    [sections]
  );
  const chart = useMemo(() => charts.find(c => c.id === chartId), [
    charts,
    chartId
  ]);

  const visuals = useMemo(() => (chart ? [chart.visual] : []), [chart]);
  const { profiles, chartData } = useProfileLoader(geoId, visuals);

  if (
    !chart ||
    (!chartData.isLoading &&
      chartData.profileVisualsData[chart.visual.queryAlias] &&
      chartData.profileVisualsData[chart.visual.queryAlias].nodes.length === 0)
  ) {
    return (
      <Placeholder icon="admin-post" label={__('Chart', 'hurumap-ui')}>
        {__('Data is missing for visualizing this chart.', 'hurumap-ui')}
      </Placeholder>
    );
  }
  return (
    <ChartContainer
      key={chart.id}
      loading={chartData.isLoading}
      title={chart.title}
      subtitle={chart.subtitle}
      source={
        !chartData.isLoading && chartData.sources[chart.visual.table]
          ? chartData.sources[chart.visual.table].source
          : {}
      }
    >
      {!chartData.isLoading &&
        chartData.profileVisualsData[chart.visual.queryAlias] &&
        ChartFactory.build(
          chart.visual,
          chartData.profileVisualsData,
          null,
          profiles
        )}
    </ChartContainer>
  );
}

Chart.propTypes = {
  geoId: propTypes.string,
  chartId: propTypes.string
};

Chart.defaultProps = {
  geoId: undefined,
  chartId: undefined
};

export default Chart;
