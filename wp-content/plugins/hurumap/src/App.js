import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Formik, FieldArray } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/styles/makeStyles';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import shortid from 'shortid';
import {
  updateOrCreateHurumapChart,
  updateOrCreateChartsSection,
  updateOrCreateFlourishChart,
  deleteFlourishChart,
  deleteChartsSection
} from './api';
import propTypes from './propTypes';

const ChartDefintion = React.lazy(() => import('./HurumapChart'));
const ChartsSection = React.lazy(() => import('./ChartsSection'));
const FlourishChart = React.lazy(() => import('./FlourishChart'));

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
      {/** don't render hidden form fields to improve render  */}
      {value === index && children}
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

  const handleMoveChartsSection = (form, arrayHelper, movement, index) => {
    let indexB;
    if (movement === 'up') {
      indexB = index - 1;
    } else {
      indexB = index + 1;
    }
    arrayHelper.swap(index, indexB);
    const section = form.values.sections[index];
    const swapSection = form.values.sections[indexB];

    updateOrCreateChartsSection([
      Object.assign(section, { order: indexB }),
      Object.assign(swapSection, { order: index })
    ]);
  };

  const handleDeleteChartsSection = (form, index) => {
    const section = form.values.sections[index];
    deleteChartsSection(section);
    // update order for all sections that come below the deleted sections
    form.values.sections.map(
      // eslint-disable-next-line array-callback-return
      (belowSection, p) => {
        if (p > index) {
          const updatedBelowSec = Object.assign(belowSection, {
            order: parseInt(belowSection.order, 10) - 1
          });
          updateOrCreateChartsSection(updatedBelowSec);
        }
      }
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
                          <React.Suspense fallback={<div>Loading...</div>}>
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
                          </React.Suspense>
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
                          <React.Suspense fallback={<div>Loading...</div>}>
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
                                deleteFlourishChart(flourishChart.id);
                              }}
                            />
                          </React.Suspense>
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
                        arrayHelper.push({
                          id: shortid.generate(),
                          order: form.values.sections.length,
                          published: false
                        })
                      }
                    >
                      Add Section
                    </Button>
                    <Grid container direction="column" spacing={2}>
                      {form.values.sections
                        .sort((a, b) => (a.order >= b.order ? 1 : -1))
                        .map((section, q) => (
                          <Grid key={section.id} item xs={12} md={6}>
                            <React.Suspense fallback={<div>Loading...</div>}>
                              <ChartsSection
                                section={Object.assign(section, { order: q })}
                                sectionsCount={form.values.sections.length}
                                onMove={movement => {
                                  handleMoveChartsSection(
                                    form,
                                    arrayHelper,
                                    movement,
                                    q
                                  );
                                }}
                                onDelete={() => {
                                  arrayHelper.remove(q);
                                  handleDeleteChartsSection(form, q);
                                }}
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
                            </React.Suspense>
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
