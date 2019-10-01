import React from 'react';
import { Paper, Grid, TextField, Switch } from '@material-ui/core';
import Select from 'react-select';

import propTypes from './propTypes';

function ChartsSection({
  name,
  published: propPublished,
  onChange,
  charts,
  options
}) {
  return (
    <Paper style={{ padding: 10 }}>
      <Grid container direction="column">
        <Grid item>
          <TextField
            label="Name"
            value={name}
            fullWidth
            onChange={e => {
              onChange({ name: e.target.value });
            }}
          />
        </Grid>

        <Grid component="label" item container alignItems="center" spacing={1}>
          <Grid item>Draft</Grid>
          <Grid item>
            <Switch
              checked={propPublished}
              onChange={(_, published) => {
                onChange({ published });
              }}
            />
          </Grid>
          <Grid item>Published</Grid>
        </Grid>

        <Select
          placeholder="Select charts for section"
          isMulti
          value={charts}
          options={options}
        />
      </Grid>
    </Paper>
  );
}

ChartsSection.propTypes = {
  published: propTypes.bool.isRequired,
  name: propTypes.string.isRequired,
  onChange: propTypes.func.isRequired,
  charts: propTypes.arrayOf(propTypes.shape({})).isRequired,
  options: propTypes.arrayOf(propTypes.shape({})).isRequired
};

export default ChartsSection;
