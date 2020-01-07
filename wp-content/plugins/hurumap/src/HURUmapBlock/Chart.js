import React, { useMemo } from 'react';

import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChartFactory from '@codeforafrica/hurumap-ui/factory/ChartFactory';
import makeStyles from '@material-ui/core/styles/makeStyles';

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
  chart: propChart,
  showInsight,
  showStatVisual,
  insightSummary,
  insightTitle,
  dataLinkTitle,
  analysisCountry,
  dataGeoId,
  analysisLinkTitle,
  ...props
}) {
  const classes = useStyles(props);
  const chart = useMemo(() => propChart || charts.find(c => c.id === chartId), [
    propChart,
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
      <Grid container justify="center" alignItems="center">
        <Typography>Data is missing for visualizing this chart.</Typography>
      </Grid>
    );
  }
  return (
    <InsightContainer
      hideInsight={!showInsight}
      key={chart.id}
      variant={showInsight || showStatVisual ? 'data' : 'analysis'}
      loading={chartData.isLoading}
      title={chart.title}
      description={chart.description && chart.description[geoId]}
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
                    href: `/profiles/${dataGeoId || geoId}`,
                    title: dataLinkTitle
                  }
                : null
            }
          : {}
      }
      classes={!showStatVisual && { highlightGrid: classes.statViz }}
      source={
        chart.source && chart.source[geoId] && chart.source[geoId].title
          ? chart.source[geoId]
          : null
      }
      embedCode="embed text"
      action={{
        handleShare: () => {}
      }}
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
          definition={{ id: `data-indicator-${chart.id}`, ...chart.visual }}
          data={chartData.profileVisualsData[chart.visual.queryAlias].nodes}
        />
      )}
    </InsightContainer>
  );
}

Chart.propTypes = {
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
  charts: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string,
      description: propTypes.shape({}),
      source: propTypes.shape({})
    })
  ),
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
  chart: undefined,
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
