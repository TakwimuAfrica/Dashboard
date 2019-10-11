import React, { useMemo } from 'react';

import { __ } from '@wordpress/i18n';

import { ChartContainer } from '@codeforafrica/hurumap-ui';
import { Placeholder } from '@wordpress/components';
import ChartFactory from '../ChartFactory';

import useProfileLoader from '../data/useProfileLoader';
import propTypes from '../propTypes';
import { Typography, Grid } from '@material-ui/core';

function Chart({ geoId, chartId, charts }) {
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
      <Grid container justify="center" aligItems="center">
        <Typography>{__('Data is missing for visualizing this chart.', 'hurumap-ui')}</Typography>
      </Grid>
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
