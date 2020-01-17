import React, { useMemo } from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { Formik, Field } from 'formik';

import { Grid, Select, MenuItem, Typography, Paper } from '@material-ui/core';

const ChartDefintion = React.lazy(() => import('./HurumapChart'));
const FlourishChart = React.lazy(() => import('./FlourishChart'));

function ChartDefinition() {
  const formRef = React.useRef();
  const hideVisualSelector = useMemo(
    () =>
      new URLSearchParams(window.location.search).get('visual_selector') ===
      'hidden',
    []
  );
  const [visualType, setVisualType] = React.useState(
    (window.initial && window.initial.visualType) ||
      new URLSearchParams(window.location.search).get('visual_type') ||
      'hurumap'
  );
  const initialDefinition = React.useMemo(() => {
    if (window.initial.chart && visualType === window.initial.visualType) {
      return window.initial.chart;
    }

    if (formRef.current && formRef.current) {
      // Temporay hold values when switching between visual types
      if (!window.cache) {
        window.cache = {};
      }

      const prevValue = formRef.current.getFormikBag().values;
      window.cache[prevValue.visualType] = prevValue;

      let returnValue;
      if (window.cache && window.cache[visualType]) {
        returnValue = window.cache[visualType].definition;
      }

      if (returnValue) {
        return returnValue;
      }
    }

    return visualType === 'hurumap'
      ? {
          id: document.getElementById('post_ID').value,
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
        }
      : {
          id: document.getElementById('post_ID').value
        };
  }, [visualType]);

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
      ref={formRef}
      enableReinitialize
      initialValues={{
        visualType,
        definition: initialDefinition
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
                  {hideVisualSelector ? (
                    <input hidden name="post_excerpt" value={visualType} />
                  ) : (
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
                  )}
                  <Grid item>
                    {visualType === 'flourish' ? (
                      <FlourishChart
                        chart={definition}
                        sectionOptions={window.initial.sections.map(
                          section => ({
                            label: section.name,
                            value: section.id
                          })
                        )}
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
                        sectionOptions={window.initial.sections.map(
                          section => ({
                            label: section.name,
                            value: section.id
                          })
                        )}
                        onChange={changes => {
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
        </>
      )}
    />
  );
}

export default ChartDefinition;
