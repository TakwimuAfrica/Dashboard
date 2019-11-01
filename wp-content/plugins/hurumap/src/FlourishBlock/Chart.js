/* eslint-disable react/no-danger */
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import makeStyles from '@material-ui/styles/makeStyles';
import propTypes from '../propTypes';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  title: {
    fontWeight: 'bold',
    lineHeight: 1.2,
    marginBottom: '0.625rem'
  },
  flourishContainer: {
    padding: '0.625rem',
    backgroundColor: theme.palette.data.light,
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      padding: '1.25rem'
    }
  }
}));

function Chart({ title, chartId, iframeKey }) {
  const classes = useStyles();
  return (
    <div className={classes.flourishContainer}>
      <Grid container direction="column" alignItems="center">
        <Typography align="center" className={classes.title}>
          {title}
        </Typography>
        <iframe
          key={iframeKey}
          frameBorder="0"
          scrolling="no"
          title={title}
          src={`/wp-json/hurumap-data/flourish/${chartId}/`}
          className={classes.root}
        />
      </Grid>
    </div>
  );
}

Chart.propTypes = {
  title: propTypes.string,
  chartId: propTypes.string,
  iframeKey: propTypes.number
};

Chart.defaultProps = {
  title: undefined,
  chartId: undefined,
  iframeKey: undefined
};

export default Chart;
