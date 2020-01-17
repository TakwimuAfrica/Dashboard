/* eslint-disable react/no-danger */
import React from 'react';

import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import makeStyles from '@material-ui/core/styles/makeStyles';
import propTypes from '../propTypes';
import config from '../config';

const useStyles = makeStyles({
  iframe: {
    width: '100%'
  },
  statViz: {
    display: 'none'
  }
});

function Chart({
  title,
  description,
  chartId,
  iframeKey,
  showInsight,
  insightSummary,
  insightTitle,
  dataLinkTitle,
  analysisCountry,
  dataGeoId,
  analysisLinkTitle,
  handleShare,
  embedCode,
  ...props
}) {
  const classes = useStyles(props);
  return (
    <InsightContainer
      hideInsight={!showInsight}
      key={chartId}
      loading={false}
      title={title}
      description={description}
      embedCode={embedCode}
      actions={{
        handleShare
      }}
      classes={{ highlightGrid: classes.statViz }} // flourish charts do not have number visual charts
      variant={showInsight ? 'data' : 'analysis'}
      insight={
        showInsight
          ? {
              description: insightSummary,
              title: insightTitle,
              analysisLink: analysisCountry
                ? {
                    href: `${config.WP_BACKEND_URL}/profiles/${analysisCountry}`,
                    title: analysisLinkTitle
                  }
                : null,
              dataLink: dataGeoId
                ? {
                    href: `${config.WP_BACKEND_URL}/profiles/${dataGeoId}`,
                    title: dataLinkTitle
                  }
                : null
            }
          : {}
      }
    >
      <div />
      <iframe
        id={`data-indicator-${chartId}`}
        key={iframeKey}
        frameBorder="0"
        scrolling="no"
        title={title}
        src={`${config.WP_BACKEND_URL}/wp-json/hurumap-data/flourish/${chartId}/`}
        className={classes.iframe}
      />
    </InsightContainer>
  );
}

Chart.propTypes = {
  title: propTypes.string,
  description: propTypes.string,
  chartId: propTypes.string,
  iframeKey: propTypes.number,
  showInsight: propTypes.bool,
  insightSummary: propTypes.string,
  insightTitle: propTypes.string,
  dataLinkTitle: propTypes.string,
  analysisCountry: propTypes.string,
  dataGeoId: propTypes.string,
  analysisLinkTitle: propTypes.string,
  handleShare: propTypes.func,
  embedCode: propTypes.string
};

Chart.defaultProps = {
  title: undefined,
  description: undefined,
  chartId: undefined,
  iframeKey: undefined,
  showInsight: undefined,
  insightSummary: undefined,
  insightTitle: undefined,
  dataLinkTitle: undefined,
  analysisCountry: undefined,
  dataGeoId: undefined,
  analysisLinkTitle: undefined,
  embedCode: '',
  handleShare: () => {}
};

export default Chart;
