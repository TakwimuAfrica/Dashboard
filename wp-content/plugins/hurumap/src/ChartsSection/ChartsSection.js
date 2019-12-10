import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Select from 'react-select';

import propTypes from '../propTypes';

const useStyles = makeStyles({
  button: {
    padding: '4px'
  },
  deleteButton: {
    color: 'white',
    backgroundColor: 'rgb(191, 42, 60)'
  }
});

function ChartsSection({
  section,
  sections,
  onChange,
  onAddChart,
  onRemoveChart,
  onMove,
  charts,
  options
}) {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper style={{ padding: 10 }}>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="post_title"
                InputLabelProps={{
                  shrink: true
                }}
                value={section.name}
                onChange={e => {
                  onChange({ name: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows="3"
                InputLabelProps={{
                  shrink: true
                }}
                value={section.description}
                onChange={e => {
                  onChange({ description: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Charts</InputLabel>
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
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper style={{ padding: 10 }}>
          <Grid container direction="column">
            {sections.map(({ id, name }, i) => (
              <Grid item>
                <Grid
                  container
                  wrap="nowrap"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item xs={8}>
                    <Typography>
                      {i}.{' '}
                      {id !== section.id ? name : section.name || 'Section'}
                    </Typography>
                  </Grid>
                  {id === section.id && (
                    <Grid item xs={4}>
                      <Grid container justify="flex-end">
                        <Grid item>
                          <IconButton
                            className={classes.button}
                            disabled={section.order === 0}
                            onClick={() => onMove('up')}
                          >
                            <ArrowDropUp fontSize="large" />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            className={classes.button}
                            disabled={section.order === sections.length - 1}
                            onClick={() => onMove('down')}
                          >
                            <ArrowDropDown fontSize="large" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

ChartsSection.propTypes = {
  section: propTypes.shape({
    id: propTypes.string,
    order: propTypes.number,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    name: propTypes.string,
    description: propTypes.string
  }).isRequired,
  sections: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string,
      order: propTypes.number,
      published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
      name: propTypes.string,
      description: propTypes.string
    })
  ).isRequired,
  onChange: propTypes.func.isRequired,
  onAddChart: propTypes.func.isRequired,
  onRemoveChart: propTypes.func.isRequired,
  charts: propTypes.arrayOf(propTypes.shape({})).isRequired,
  options: propTypes.arrayOf(propTypes.shape({})).isRequired,
  onMove: propTypes.func.isRequired
};

export default ChartsSection;
