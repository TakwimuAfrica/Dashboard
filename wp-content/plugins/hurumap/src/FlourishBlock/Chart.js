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
    marginTop: '1.25rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    [breakpoints.up('md')]: {
      width: '90%'
    }
  },
  descriptionContainer: {
    width: 'auto'
  },
  description: {
    color: palette.data.main,
    marginLeft: '1.25rem'
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
          <Grid
            container
            justify="center"
            alignItems="flex-start"
            wrap="nowrap"
            className={classes.descriptionContainer}
          >
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
