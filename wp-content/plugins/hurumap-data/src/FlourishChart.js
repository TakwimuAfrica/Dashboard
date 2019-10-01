import React from 'react';
import { Grid, TextField } from '@material-ui/core';

function FlourishChart() {
  return (
    <Grid container direction="column">
      <TextField label="Title" fullWidth />
      <TextField label="Subtitle" fullWidth />
    </Grid>
  );
}

export default FlourishChart;
