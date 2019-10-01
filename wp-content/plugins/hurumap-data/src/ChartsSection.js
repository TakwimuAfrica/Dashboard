import React from 'react';
import { Paper, Grid, TextField, Switch } from '@material-ui/core';
import Select from 'react-select';

import propTypes from './propTypes';

function ChartsSection({
  section,
  onChange,
  onAddChart,
  onRemoveChart,
  charts,
  options
}) {
  return (
    <Paper style={{ padding: 10 }}>
      <Grid container direction="column">
        <Grid item>
          <TextField
            label="Name"
            value={section.name}
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
              defaultChecked={false}
              checked={section.published === '1' || section.published === true}
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
          isClearable={false}
          value={charts}
          options={options}
          onChange={(_, { removedValue, option }) => {
            if (removedValue) {
              onRemoveChart(removedValue.value);
            } else if (option) {
              onAddChart(option.value);
            } else {
              //
            }
          }}
        />
      </Grid>
    </Paper>
  );
}

ChartsSection.propTypes = {
  section: propTypes.shape({
    id: propTypes.string,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    name: propTypes.string
  }).isRequired,
  onChange: propTypes.func.isRequired,
  onAddChart: propTypes.func.isRequired,
  onRemoveChart: propTypes.func.isRequired,
  charts: propTypes.arrayOf(propTypes.shape({})).isRequired,
  options: propTypes.arrayOf(propTypes.shape({})).isRequired
};

export default ChartsSection;
