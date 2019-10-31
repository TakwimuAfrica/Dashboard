import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
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
            InputLabelProps={{
              shrink: true
            }}
            onChange={e => {
              onChange({ name: e.target.value });
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Description"
            multiline
            value={section.description}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
            onChange={e => {
              onChange({ description: e.target.value });
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

        <Grid item xs={12}>
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
      </Grid>
    </Paper>
  );
}

ChartsSection.propTypes = {
  section: propTypes.shape({
    id: propTypes.string,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    name: propTypes.string,
    description: propTypes.string
  }).isRequired,
  onChange: propTypes.func.isRequired,
  onAddChart: propTypes.func.isRequired,
  onRemoveChart: propTypes.func.isRequired,
  charts: propTypes.arrayOf(propTypes.shape({})).isRequired,
  options: propTypes.arrayOf(propTypes.shape({})).isRequired
};

export default ChartsSection;
