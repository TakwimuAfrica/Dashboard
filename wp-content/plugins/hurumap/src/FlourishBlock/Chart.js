/* eslint-disable react/no-danger */
import React from 'react';

import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import makeStyles from '@material-ui/core/styles/makeStyles';
import propTypes from '../propTypes';

const useStyles = makeStyles({
  root: {
    width: '100%',
    padding: '1.25rem'
  },
  iframe: {},
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
  ...props
}) {
  const classes = useStyles(props);
  const handleIframeLoad = e => {
    const iframe = e.target;
    if (iframe) {
      document.domain = 'takwimu.africa';
      const wrapper =
        iframe.contentDocument.getElementById('wrapper') ||
        iframe.contentDocument.getElementById('flourish-popup-constrainer');
      const height =
        wrapper && wrapper.offsetHeight > 420 ? wrapper.offsetHeight : 420;
      iframe.style.height = `${height}px`;

      iframe.contentDocument.body.style.background = 'rgb(0,0,0) !important';
      const headers = iframe.contentDocument.getElementsByClassName(
        'flourish-header'
      );
      if (headers && headers.length) {
        headers[0].style.display = 'none';
      }
    }
  };
  return (
    <InsightContainer
      hideInsight={!showInsight}
      key={chartId}
      loading={false}
      title={title}
      description={description}
      embedCode="embed text"
      actions={{
        handleShare: () => {}
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
    >
      <div />
      <div className={classes.root}>
        <iframe
          key={iframeKey}
          frameBorder="0"
          scrolling="no"
          title={title}
          onLoad={handleIframeLoad}
          src={`/wp-json/hurumap-data/flourish/${chartId}/`}
          className={classes.iframe}
        />
      </div>
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
  analysisLinkTitle: propTypes.string
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
  analysisLinkTitle: undefined
};

export default Chart;
