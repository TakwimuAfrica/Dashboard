import React, { useMemo } from 'react';

import { __ } from '@wordpress/i18n';

import { InsightContainer } from '@codeforafrica/hurumap-ui';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import ChartFactory from './ChartFactory';

import useProfileLoader from './data/useProfileLoader';
import propTypes from './propTypes';

const useStyles = makeStyles(() => ({
  containerRoot: {
    width: '100%',
    minHeight: '500px',
    backgroundColor: '#f6f6f6',
    margin: 0
  }
}));

function Chart({ preview, geoId, chart }) {
  const classes = useStyles();
  const visuals = useMemo(() => (chart ? [chart.visual] : []), [chart]);
  const { profiles, chartData } = useProfileLoader(
    preview ? geoId : null,
    preview ? visuals : []
  );

  if (
    !preview ||
    !chart ||
    (!chartData.isLoading &&
      chartData.profileVisualsData[chart.visual.queryAlias] &&
      chartData.profileVisualsData[chart.visual.queryAlias].nodes.length === 0)
  ) {
    return (
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ height: '400px', backgroundColor: 'whitesmoke' }}
      >
        <Grid item>
          <Typography>
            {preview
              ? __('Data is missing for visualizing this chart.', 'hurumap-ui')
              : __(
                  'Enable preview and select a country to preview the chart configurations dynamically.',
                  'hurumap-ui'
                )}
          </Typography>
        </Grid>
      </Grid>
    );
  }
  return (
    <InsightContainer
      key={chart.id}
      loading={chartData.isLoading}
      title={chart.title}
      classes={{
        root: classes.containerRoot
      }}
    >
      {!chartData.isLoading &&
        chartData.profileVisualsData[chart.visual.queryAlias] &&
        ChartFactory.build(
          chart.stat,
          chartData.profileVisualsData,
          null,
          profiles
        )}
      {!chartData.isLoading &&
        chartData.profileVisualsData[chart.visual.queryAlias] &&
        ChartFactory.build(
          chart.visual,
          chartData.profileVisualsData,
          null,
          profiles
        )}
    </InsightContainer>
  );
}

Chart.propTypes = {
  geoId: propTypes.string,
  chart: propTypes.shape({
    id: propTypes.string,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    subtitle: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.shape({
      queryAlias: propTypes.string
    }),
    stat: propTypes.shape({
      queryAlias: propTypes.string
    }),
    queryAlias: propTypes.string
  }),
  preview: propTypes.bool
};

Chart.defaultProps = {
  geoId: undefined,
  chart: undefined,
  preview: false
};

export default Chart;
