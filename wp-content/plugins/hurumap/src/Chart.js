import React, { useMemo } from 'react';

import { __ } from '@wordpress/i18n';

import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/styles/makeStyles';
import ChartFactory from '@codeforafrica/hurumap-ui/factory/ChartFactory';
import useProfileLoader from '@codeforafrica/hurumap-ui/factory/useProfileLoader';
import propTypes from './propTypes';

const useStyles = makeStyles(() => ({
  containerRoot: ({ loading }) => ({
    minHeight: loading && '500px'
  })
}));

function Chart({ preview, geoId, chart }) {
  const visuals = useMemo(() => (chart ? [chart.visual] : []), [chart]);
  const { profiles, chartData } = useProfileLoader({
    geoId: preview ? geoId : null,
    visuals: preview ? visuals : []
  });
  const classes = useStyles({ loading: chartData.isLoading });

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
              ? __(
                  'Data is missing for visualizing this chart.',
                  'hurumap-data'
                )
              : __(
                  'Enable preview and select a country to preview the chart configurations dynamically.',
                  'hurumap-data'
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
      description={chart.description && chart.description[geoId]}
      classes={{
        root: classes.containerRoot
      }}
      insight={{
        analysisLink: '#',
        dataLink: '#',
        description: 'Summary per country goes here.',
        title: 'Summary'
      }}
      source={
        chart.source && chart.source[geoId] && chart.source[geoId].title
          ? chart.source[geoId]
          : null
      }
    >
      {!chartData.isLoading && (
        <ChartFactory
          profiles={profiles}
          definition={chart.stat}
          data={chartData.profileVisualsData[chart.visual.queryAlias].nodes}
        />
      )}
      {!chartData.isLoading && (
        <ChartFactory
          profiles={profiles}
          definition={chart.visual}
          data={chartData.profileVisualsData[chart.visual.queryAlias].nodes}
        />
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
    description: propTypes.shape({}),
    source: propTypes.shape({}),
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
