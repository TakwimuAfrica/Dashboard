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
import ChartDefintion from './HurumapChart';
import { getCharts, updateChart } from './api';
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
                          visual: '{"table":""}',
                          published: false
                        })
                      }
                    >
                      Add Chart
                    </Button>
                    <Grid container spacing={1} direction="column">
                      {form.values.hurumapCharts.map(chart => (
                        <Grid item xs={12}>
                          <ChartDefintion
                            chart={chart}
                            data={data}
                            sectionOptions={form.values.sections.map(s => ({
                              label: s.name,
                              value: s.id
                            }))}
                            onChange={changes => {
                              arrayHelper.replace(
                                form.values.hurumapCharts.indexOf(chart),
                                Object.assign(chart, changes)
                              );
                              updateChart(chart.id, chart);
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
                      onClick={() =>
                        arrayHelper.insert(0, {
                          published: false
                        })
                      }
                    >
                      Add Chart
                    </Button>
                    <Grid container>
                      {form.values.flourishCharts.map(chart => (
                        <Grid item xs={12}>
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
                          published: false
                        })
                      }
                    >
                      Add Section
                    </Button>
                    <Grid container direction="row" spacing={1}>
                      {form.values.sections.map(section => (
                        <Grid item xs={12} md={3}>
                          <ChartsSection
                            name={section.name}
                            published={section.published}
                            onChange={changes => {
                              arrayHelper.replace(
                                form.values.sections.indexOf(section),
                                Object.assign(section, changes)
                              );
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
