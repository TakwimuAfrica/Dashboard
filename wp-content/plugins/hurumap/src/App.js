import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Formik, Field } from 'formik';
import Grid from '@material-ui/core/Grid';

import shortid from 'shortid';
import { Select, MenuItem, Typography, Paper } from '@material-ui/core';

const ChartDefintion = React.lazy(() => import('./HurumapChart'));
const FlourishChart = React.lazy(() => import('./FlourishChart'));

// import Actions from './Actions';

function App() {
  const [visualType, setVisualType] = React.useState('hurumap');

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

  return (
    <Formik
      enableReinitialize
      initialValues={{
        definition: window.initial.chart || {
          id: shortid.generate(),
          stat: {
            type: 'number',
            subtitle: '',
            description: '',
            aggregate: 'sum',
            unique: true,
            unit: 'percent'
          },
          visual: {
            typeProps: {}
          }
        },
        sections: []
      }}
      render={form => (
        <>
          <input
            hidden
            name="post_content"
            value={JSON.stringify(form.values.definition)}
          />
          <Field name="definition">
            {({ field: { name, value: definition } }) => (
              <React.Suspense fallback={<div>Loading...</div>}>
                <Grid container direction="column" spacing={2}>
                  <Grid item>
                    <Paper style={{ padding: 10 }}>
                      <Grid container wrap="nowrap">
                        <Typography variant="h2">Visual Type:</Typography>
                        <Select
                          name="post_excerpt"
                          value={visualType}
                          onChange={({ target: { value } }) =>
                            setVisualType(value)
                          }
                        >
                          <MenuItem value="hurumap">HURUmap</MenuItem>
                          <MenuItem value="flourish">Flourish</MenuItem>
                        </Select>
                      </Grid>
                    </Paper>
                  </Grid>
                  <Grid item>
                    {visualType === 'flourish' ? (
                      <FlourishChart
                        chart={definition}
                        sectionOptions={form.values.sections.map(s => ({
                          label: s.name,
                          value: s.id
                        }))}
                        onChange={changes => {
                          form.setFieldValue(
                            name,
                            Object.assign(definition, changes)
                          );
                        }}
                      />
                    ) : (
                      <ChartDefintion
                        data={data}
                        chart={definition}
                        sectionOptions={form.values.sections.map(s => ({
                          label: s.name,
                          value: s.id
                        }))}
                        onChange={changes => {
                          console.log(changes);
                          form.setFieldValue(
                            name,
                            Object.assign(definition, changes)
                          );
                        }}
                      />
                    )}
                  </Grid>
                </Grid>
              </React.Suspense>
            )}
          </Field>

          {/* <TabPanel value={value} index={1}>
              <FieldArray name="flourishCharts">
                {arrayHelper => (
                  <>
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
            </TabPanel> */}

          {/* <TabPanel value={value} index={2}>
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
                      {form.values.sections.map((section, q) => (
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
            </TabPanel> */}
        </>
      )}
    />
  );
}

export default App;
