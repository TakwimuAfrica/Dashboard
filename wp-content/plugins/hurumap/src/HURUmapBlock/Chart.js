import React, { useMemo } from 'react';

import { __ } from '@wordpress/i18n';

import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChartFactory from '@codeforafrica/hurumap-ui/factory/ChartFactory';
import makeStyles from '@material-ui/styles/makeStyles';

import useProfileLoader from '@codeforafrica/hurumap-ui/factory/useProfileLoader';
import propTypes from '../propTypes';

const useStyles = makeStyles({
  statViz: {
    display: 'none'
  }
});

function Chart({
  geoId,
  chartId,
  charts,
  showInsight,
  showStatVisual,
  insightSummary,
  insightTitle,
  dataLinkTitle,
  analysisCountry,
  dataGeoId,
  analysisLinkTitle
}) {
  const classes = useStyles();
  const chart = useMemo(() => charts.find(c => c.id === chartId), [
    charts,
    chartId
  ]);

  const visuals = useMemo(() => (chart ? [chart.visual] : []), [chart]);
  const { profiles, chartData } = useProfileLoader({ geoId, visuals });

  if (
    !chart ||
    (!chartData.isLoading &&
      chartData.profileVisualsData[chart.visual.queryAlias] &&
      chartData.profileVisualsData[chart.visual.queryAlias].nodes.length === 0)
  ) {
    return (
      <Grid container justify="center" aligItems="center">
        <Typography>
          {__('Data is missing for visualizing this chart.', 'hurumap-data')}
        </Typography>
      </Grid>
    );
  }
  return (
    <InsightContainer
      hideInsight={!showInsight}
      key={chart.id}
      variant={showInsight ? 'data' : 'analysis'}
      loading={chartData.isLoading}
      title={chart.title}
      insight={
        showInsight
          ? {
              description: insightSummary,
              title: insightTitle,
              analysisLink: analysisCountry
                ? {
                    href: `/profiles/${analysisCountry}`,
                    title: analysisLinkTitle
                  }
                : null,
              dataLink: dataGeoId
                ? {
                    href: `/profiles/${dataGeoId}`,
                    title: dataLinkTitle
                  }
                : null
            }
          : {}
      }
      classes={!showStatVisual && { highlightGrid: classes.statViz }}
    >
      {!chartData.isLoading && showStatVisual ? (
        <ChartFactory
          profiles={profiles}
          definition={chart.stat}
          data={chartData.profileVisualsData[chart.visual.queryAlias].nodes}
        />
      ) : (
        <div />
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
  charts: propTypes.arrayOf(propTypes.shape({ id: propTypes.string })),
  geoId: propTypes.string,
  chartId: propTypes.string,
  showInsight: propTypes.bool,
  showStatVisual: propTypes.bool,
  insightSummary: propTypes.string,
  insightTitle: propTypes.string,
  dataLinkTitle: propTypes.string,
  analysisCountry: propTypes.string,
  dataGeoId: propTypes.string,
  analysisLinkTitle: propTypes.string
};

Chart.defaultProps = {
  charts: [],
  geoId: undefined,
  chartId: undefined,
  showInsight: undefined,
  showStatVisual: undefined,
  insightSummary: undefined,
  insightTitle: undefined,
  dataLinkTitle: undefined,
  analysisCountry: undefined,
  dataGeoId: undefined,
  analysisLinkTitle: undefined
};

export default Chart;
