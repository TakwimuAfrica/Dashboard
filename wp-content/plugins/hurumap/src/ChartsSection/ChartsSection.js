import React from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Link from '@material-ui/core/Link';
import Select from 'react-select';
import { Formik, FieldArray } from 'formik';
import shortid from 'shortid';

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

const layoutOptions = [
  { value: '1', label: 'A whole' },
  { value: '1/2', label: 'A half' },
  { value: '1/3', label: 'A third' },
  { value: '2/3', label: 'Two thirds' }
];

function ChartsSection({
  section,
  sections,
  onChange,
  onAddChart,
  onRemoveChart,
  onMove,
  charts: sectionCharts,
  options
}) {
  const classes = useStyles();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={9}>
        <Paper style={{ padding: 10 }}>
          <Grid container spacing={2}>
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
              <Formik
                enableReinitialize
                initialValues={{
                  charts: sectionCharts
                }}
                render={form => (
                  <form>
                    <FieldArray name="charts">
                      {arrayHelper => (
                        <>
                          <Button
                            className={classes.button}
                            onClick={() =>
                              arrayHelper.push({
                                value: shortid.generate(),
                                label: 'Select Chart',
                                layout: layoutOptions[0].value
                              })
                            }
                          >
                            Add Chart
                          </Button>
                          <Grid container direction="column">
                            {form.values.charts.map((chart, index) => (
                              <Grid item container key={chart.value}>
                                <Grid item xs={12} md={5}>
                                  <InputLabel>Charts</InputLabel>
                                  <Select
                                    placeholder="Select chart"
                                    value={options.find(
                                      o => o.value === chart.value
                                    )}
                                    options={options}
                                    onChange={selectedChart => {
                                      arrayHelper.replace(
                                        form.values.charts.indexOf(chart),
                                        Object.assign(chart, selectedChart)
                                      );
                                      onAddChart(form.values.charts);
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <InputLabel>Layout</InputLabel>
                                  <Select
                                    placeholder="Select chart layout"
                                    value={layoutOptions.find(
                                      x => x.value === chart.layout
                                    )}
                                    options={layoutOptions}
                                    onChange={({ value }) => {
                                      const updatedChart = Object.assign(
                                        chart,
                                        { layout: value }
                                      );
                                      arrayHelper.replace(
                                        form.values.charts.indexOf(chart),
                                        updatedChart
                                      );
                                      onAddChart(form.values.charts);
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                  <IconButton
                                    onClick={() => {
                                      onRemoveChart(chart.value);
                                      arrayHelper.remove(index);
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Grid>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )}
                    </FieldArray>
                  </form>
                )}
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper style={{ padding: 10 }}>
          <Grid container direction="column">
            <Typography>Section Order</Typography>
            {sections.map(({ id, name }, i) => (
              <Grid item>
                <Grid
                  container
                  wrap="nowrap"
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item xs={8}>
                    <Link href={`/wp-admin/post.php?post=${id}&action=edit`}>
                      <Typography
                        style={{
                          fontWeight: id === section.id && 'bold',
                          color: '#0085ba'
                        }}
                      >
                        {i + 1}-{' '}
                        {id !== section.id ? name : section.name || 'Section'}
                      </Typography>
                    </Link>
                  </Grid>
                  {id === section.id && (
                    <Grid item xs={4}>
                      <Grid container justify="flex-end">
                        <Grid item>
                          <IconButton
                            className={classes.button}
                            disabled={i === 0}
                            onClick={() => onMove(-1)}
                          >
                            <ArrowDropUp fontSize="large" />
                          </IconButton>
                        </Grid>
                        <Grid item>
                          <IconButton
                            className={classes.button}
                            disabled={i === sections.length - 1}
                            onClick={() => onMove(1)}
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
