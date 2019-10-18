import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, TextField } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  }
}));

function FlourishChart() {
  const classes = useStyles();
  return (
    <Grid container direction="column">
      <TextField label="Title" fullWidth />
      <TextField label="Subtitle" fullWidth />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="zip-file">
        <input
          accept="image/*"
          className={classes.input}
          id="zip-file"
          type="file"
        />
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<CloudUploadIcon />}
        >
          Upload .zip file
        </Button>
      </label>
    </Grid>
  );
}

export default FlourishChart;
