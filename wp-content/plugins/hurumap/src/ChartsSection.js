import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Switch from '@material-ui/core/Switch';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Select from 'react-select';

import propTypes from './propTypes';

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
  onChange,
  onAddChart,
  onRemoveChart,
  onDelete,
  onMove,
  charts,
  options
}) {
  const classes = useStyles();
  return (
    <Paper style={{ padding: 10 }}>
      <Grid container direction="row">
        <Grid item container md={7}>
          <Grid item md={12}>
            <TextField
              label="Name"
              fullWidth
              value={section.name}
              onChange={e => {
                onChange({ name: e.target.value });
              }}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              label="Description"
              multiline
              fullWidth
              rows="3"
              value={section.description}
              onChange={e => {
                onChange({ description: e.target.value });
              }}
            />
          </Grid>
          <Grid item md={12}>
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
        <Grid item container md={5}>
          <Grid item container justify="flex-end">
            <Grid item>
              <IconButton
                className={classes.button}
                onClick={() => onMove('up')}
              >
                <ArrowDropUp fontSize="large" />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                className={classes.button}
                onClick={() => onMove('down')}
              >
                <ArrowDropDown fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
          <Grid
            component="label"
            item
            container
            justify="flex-end"
            alignItems="center"
            spacing={2}
          >
            <Grid item>Draft</Grid>
            <Grid item>
              <Switch
                defaultChecked={false}
                checked={
                  section.published === '1' || section.published === true
                }
                onChange={(_, published) => {
                  onChange({ published });
                }}
              />
            </Grid>
            <Grid item>Published</Grid>
            <Grid item>
              <Button
                className={classes.deleteButton}
                onClick={() => onDelete()}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
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
  options: propTypes.arrayOf(propTypes.shape({})).isRequired,
  onDelete: propTypes.func.isRequired,
  onMove: propTypes.func.isRequired
};

export default ChartsSection;
