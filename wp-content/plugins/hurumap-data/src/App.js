import React, { useEffect, useState } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Formik, FieldArray } from 'formik';
import { Grid, Button } from '@material-ui/core';

// import AceEditor from "react-ace";

// import 'brace';
// import 'brace/mode/json';
// import 'brace/theme/github';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import shortid from 'shortid';
import ChartDefintion from './HurumapChart';
import {
  getCharts,
  updateOrCreateHurumapChart,
  updateOrCreateChartsSection
} from './api';
import ChartsSection from './ChartsSection';
import propTypes from './propTypes';
import FlourishChart from './FlourishChart';

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
      component="div"
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
  const [value, setValue] = React.useState(0);
  const [hurumapCharts, setHurumapCharts] = useState([]);
  const [flourishCharts, setFlourishCharts] = useState([]);
  const [sections, setSections] = useState([]);
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

  useEffect(() => {
    getCharts()
      .then(res => res.json())
      .then(res => {
        setHurumapCharts(res.hurumap);
        setFlourishCharts(res.flourish);
        setSections(res.sections);
      });
  }, []);

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
    updateOrCreateHurumapChart(updatedChart);
  };
  return (
    <div style={{ position: 'relative' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Hurumap Charts" {...a11yProps(0)} />
          <Tab label="Flourish Charts" {...a11yProps(1)} />
          <Tab label="Chart Sections" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <Formik
        enableReinitialize
        initialValues={{ sections, hurumapCharts, flourishCharts }}
        render={form => (
          <form>
            <TabPanel value={value} index={0}>
              <FieldArray name="hurumapCharts">
                {arrayHelper => (
                  <>
                    <Button
                      onClick={() =>
                        arrayHelper.insert(0, {
                          id: shortid.generate(),
                          published: false
                        })
                      }
                    >
                      Add Chart
                    </Button>
                    <Grid container spacing={1} direction="column">
                      {form.values.hurumapCharts.map(chart => (
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
                      onClick={() =>
                        arrayHelper.insert(0, {
                          id: shortid.generate(),
                          published: false
                        })
                      }
                    >
                      Add Chart
                    </Button>
                    <Grid container>
                      {form.values.flourishCharts.map(chart => (
                        <Grid key={chart.id} item xs={12}>
                          <FlourishChart
                            chart={chart}
                            onChange={changes => {
                              arrayHelper.replace(
                                form.values.flourishCharts.indexOf(chart),
                                Object.assign(chart, changes)
                              );
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
                      onClick={() =>
                        arrayHelper.insert(0, {
                          id: shortid.generate(),
                          published: false
                        })
                      }
                    >
                      Add Section
                    </Button>
                    <Grid container direction="row" spacing={1}>
                      {form.values.sections.map(section => (
                        <Grid key={section.id} item xs={12} md={3}>
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
      {/* <AceEditor
        enableLiveAutocompletion
        enableBasicAutocompletion
        theme="github"
        mode="json"
        name="1234"
        value={"{}"}
        editorProps={{ $blockScrolling: true }}
      /> */}
    </div>
  );
}

export default App;
