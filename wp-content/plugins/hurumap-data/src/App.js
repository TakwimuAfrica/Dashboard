import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Formik, FieldArray } from 'formik';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import shortid from 'shortid';
import ChartDefintion from './HurumapChart';
import {
  updateOrCreateHurumapChart,
  updateOrCreateChartsSection,
  updateOrCreateFlourishChart,
  deleFlourishChart
} from './api';
import ChartsSection from './ChartsSection';
import propTypes from './propTypes';
import FlourishChart from './FlourishChart';
// import Actions from './Actions';

const useStyles = makeStyles({
  button: {
    backgroundColor: '#0073aa',
    color: 'white',
    marginBottom: 20
  }
});

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {children}
    </div>
  );
}

TabPanel.propTypes = {
  children: propTypes.children.isRequired,
  index: propTypes.number.isRequired,
  value: propTypes.number.isRequired
};

function App() {
  const classes = useStyles();
  const [timeoutId, setTimeoutId] = React.useState(null);
  const [value, setValue] = React.useState(0);
  const [charts] = useState({
    ...window.initial.charts,
    loading: true
  });
  const { data } = useQuery(gql`
    query {
      __schema {
        types {
          name
          fields {
            name
            type {
              name
            }
          }
        }
      }
    }
  `);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleUpdateHurumapChart = (form, chart, changes) => {
    const updatedChart = Object.assign(chart, changes);
    /**
     * Update without array helper
     */
    const index = form.values.hurumapCharts.indexOf(chart);
    form.setFieldValue('hurumapCharts', [
      ...form.values.hurumapCharts.slice(0, index),
      updatedChart,
      ...form.values.hurumapCharts.slice(index + 1)
    ]);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    setTimeoutId(
      setTimeout(() => {
        updateOrCreateHurumapChart(updatedChart);
      }, 3000)
    );
  };

  const renderAppBar = () => {
    return ReactDOM.createPortal(
      <AppBar position="fixed">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Hurumap Charts" {...a11yProps(0)} />
          <Tab label="Flourish Charts" {...a11yProps(1)} />
          <Tab label="Chart Sections" {...a11yProps(2)} />
        </Tabs>
      </AppBar>,
      document.getElementById('wp-hurumap-data-app-bar')
    );
  };
  return (
    <div style={{ position: 'relative' }}>
      {renderAppBar()}

      <Formik
        enableReinitialize
        initialValues={{
          sections: charts.sections,
          hurumapCharts: charts.hurumap,
          flourishCharts: charts.flourish
        }}
        render={form => (
          <form>
            <TabPanel value={value} index={0}>
              <FieldArray name="hurumapCharts">
                {arrayHelper => (
                  <>
                    <Button
                      className={classes.button}
                      onClick={() =>
                        arrayHelper.insert(0, {
                          id: shortid.generate(),
                          published: false
                        })
                      }
                    >
                      Add Chart
                    </Button>
                    {/* <Actions
                      actions={[
                        {
                          label: 'Publish Selected',
                          value: 'publish:selected'
                        },
                        { label: 'Publish All', value: 'publish:all' },
                        { label: 'Delete Selected', value: 'delete:selected' },
                        { label: 'Delete All', value: 'delete:all' }
                      ]}
                    /> */}
                    <Grid container spacing={1} direction="column">
                      {form.values.hurumapCharts.map((chart, i) => (
                        <Grid key={chart.id} item xs={12}>
                          <ChartDefintion
                            chart={chart}
                            data={data}
                            sectionOptions={form.values.sections.map(s => ({
                              label: s.name,
                              value: s.id
                            }))}
                            onChange={changes =>
                              handleUpdateHurumapChart(form, chart, changes)
                            }
                            onAction={action => {
                              if (action === 'delete') {
                                arrayHelper.remove(i);
                              }
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </FieldArray>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <FieldArray name="flourishCharts">
                {arrayHelper => (
                  <>
                    <Button
                      className={classes.button}
                      onClick={() =>
                        arrayHelper.insert(0, {
                          id: shortid.generate(),
                          published: false
                        })
                      }
                    >
                      Add Chart
                    </Button>
                    {/* <Actions
                      actions={[
                        {
                          label: 'Publish Selected',
                          value: 'publish:selected'
                        },
                        { label: 'Publish All', value: 'publish:all' },
                        { label: 'Delete Selected', value: 'delete:selected' },
                        { label: 'Delete All', value: 'delete:all' }
                      ]}
                    /> */}
                    <Grid container>
                      {form.values.flourishCharts.map((flourishChart, j) => (
                        <Grid key={flourishChart.id} item xs={12}>
                          <FlourishChart
                            chart={flourishChart}
                            sectionOptions={form.values.sections.map(s => ({
                              label: s.name,
                              value: s.id
                            }))}
                            onChange={changes => {
                              const updatedFlourish = Object.assign(
                                flourishChart,
                                changes
                              );
                              arrayHelper.replace(
                                form.values.flourishCharts.indexOf(
                                  flourishChart
                                ),
                                updatedFlourish
                              );
                              updateOrCreateFlourishChart(updatedFlourish);
                            }}
                            onDelete={() => {
                              arrayHelper.remove(j);
                              deleFlourishChart(flourishChart.id);
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </FieldArray>
            </TabPanel>

            <TabPanel value={value} index={2}>
              <FieldArray name="sections">
                {arrayHelper => (
                  <>
                    <Button
                      className={classes.button}
                      onClick={() =>
                        arrayHelper.insert(0, {
                          id: shortid.generate(),
                          published: false
                        })
                      }
                    >
                      Add Section
                    </Button>
                    {/* <Actions
                      actions={[
                        {
                          label: 'Publish Selected',
                          value: 'publish:selected'
                        },
                        { label: 'Publish All', value: 'publish:all' },
                        { label: 'Delete Selected', value: 'delete:selected' },
                        { label: 'Delete All', value: 'delete:all' }
                      ]}
                    /> */}
                    <Grid container direction="row" spacing={1}>
                      {form.values.sections.map(section => (
                        <Grid key={section.id} item xs={12} md={4}>
                          <ChartsSection
                            section={section}
                            onChange={changes => {
                              const updatedSection = Object.assign(
                                section,
                                changes
                              );
                              arrayHelper.replace(
                                form.values.sections.indexOf(section),
                                updatedSection
                              );
                              updateOrCreateChartsSection(updatedSection);
                            }}
                            onAddChart={chartId => {
                              let chart = form.values.hurumapCharts.find(
                                c => c.id === chartId
                              );
                              if (chart) {
                                handleUpdateHurumapChart(form, chart, {
                                  section: section.id
                                });
                              } else {
                                chart = form.values.flourishCharts.find(
                                  c => c.id === chartId
                                );
                              }
                            }}
                            onRemoveChart={chartId => {
                              let chart = form.values.hurumapCharts.find(
                                c => c.id === chartId
                              );
                              if (chart) {
                                handleUpdateHurumapChart(form, chart, {
                                  section: null
                                });
                              } else {
                                chart = form.values.flourishCharts.find(
                                  c => c.id === chartId
                                );
                              }
                            }}
                            charts={form.values.hurumapCharts
                              .filter(c => c.section === section.id)
                              .map(c => ({
                                label: c.title,
                                value: c.id
                              }))}
                            options={form.values.hurumapCharts.map(c => ({
                              label: c.title,
                              value: c.id
                            }))}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </>
                )}
              </FieldArray>
            </TabPanel>
          </form>
        )}
      />
    </div>
  );
}

export default App;
