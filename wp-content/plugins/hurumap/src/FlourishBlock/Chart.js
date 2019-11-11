/* eslint-disable react/no-danger */
import React from 'react';

import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import makeStyles from '@material-ui/styles/makeStyles';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import propTypes from '../propTypes';

const useStyles = makeStyles(({ palette, breakpoints }) => ({
  root: {
    width: '100%',
    padding: '1.25rem'
  },
  iframe: {},
  descriptionWrapper: {
    margin: '1.25rem auto 0',
    [breakpoints.up('md')]: {
      width: '90%'
    }
  },
  description: {
    color: palette.data.main,
    display: 'flex',
    marginLeft: '1.25rem'
  },
  /** TODO:
   * This custom sourceGrid style hides the tag Source:undefined on charts
   * It will be remove one the source bug on insight chart container is fixed and merged
   * */
  sourceGrid: {
    display: 'none'
  }
}));

function Chart({ title, description, chartId, iframeKey, ...props }) {
  const classes = useStyles(props);
  return (
    <>
      <InsightContainer
        hideInsight
        key={chartId}
        variant="analysis"
        loading={false}
        title={title}
        embedCode="embed text"
        classes={{ sourceGrid: classes.sourceGrid }}
        actions={{
          handleShare: () => {}
        }}
        source={{}}
      >
        <div />
        <div className={classes.root}>
          <iframe
            key={iframeKey}
            frameBorder="0"
            scrolling="no"
            title={title}
            src={`/wp-json/hurumap-data/flourish/${chartId}/`}
            className={classes.iframe}
          />
        </div>
      </InsightContainer>
      {description && (
        <div className={classes.descriptionWrapper}>
          <Grid container alignItems="flex-start" wrap="nowrap">
            <Grid item>
              <ArrowDropUp color="primary" />
            </Grid>
            <Grid item>
              <Typography variant="caption" className={classes.description}>
                {description}
              </Typography>
            </Grid>
          </Grid>
        </div>
      )}
    </>
  );
}

Chart.propTypes = {
  title: propTypes.string,
  description: propTypes.string,
  chartId: propTypes.string,
  iframeKey: propTypes.number
};

Chart.defaultProps = {
  title: undefined,
  description: undefined,
  chartId: undefined,
  iframeKey: undefined
};

export default Chart;
