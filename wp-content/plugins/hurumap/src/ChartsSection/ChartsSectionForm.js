import React, { useMemo, useRef, useState } from 'react';

import { Formik, Field } from 'formik';
import Grid from '@material-ui/core/Grid';

const ChartsSection = React.lazy(() => import('./ChartsSection'));

function slugify(word) {
  if (!word) return '';

  return word
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function ChartSectionForm() {
  const formRef = useRef();
  const [order, setOrder] = useState();
  const sections = useMemo(() => {
    const section =
      window.initial &&
      window.initial.sections.find(
        // eslint-disable-next-line eqeqeq
        ({ id }) => document.getElementById('post_ID').value == id
      );
    if (!section && window.initial) {
      window.initial.sections.push({
        id: document.getElementById('post_ID').value,
        order: window.initial.sections.length
      });
    }
    if (order !== undefined) {
      section.order = order;
    }
    return window.initial
      ? window.initial.sections.sort((a, b) => a.order - b.order)
      : [];
  }, [order]);

  const initialCharts = useMemo(
    () =>
      window.initial
        ? window.initial.charts
            .filter(
              ({ section }) =>
                // eslint-disable-next-line eqeqeq
                section == document.getElementById('post_ID').value
            )
            .map(chart => {
              return {
                id: chart.id,
                title: chart.title,
                layout: chart.layout || '1'
              };
            })
        : [],
    []
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Formik
          ref={formRef}
          enableReinitialize
          initialValues={{
            section: (window.initial && window.initial.section) || {
              id: document.getElementById('post_ID').value,
              order:
                window.initial && window.initial.sections
                  ? window.initial.sections.length
                  : 0
            },
            charts: initialCharts
          }}
          render={form => (
            <>
              <input hidden name="post_excerpt" value="chart_section" />
              <input
                hidden
                name="post_content"
                value={JSON.stringify(
                  Object.assign(form.values.section, {
                    slug: slugify(form.values.section.name)
                  })
                )}
              />
              <input
                hidden
                name="remove_charts"
                value={JSON.stringify(
                  initialCharts
                    .map(({ id }) => id)
                    .filter(
                      x => !form.values.charts.map(({ id: z }) => z).includes(x)
                    )
                )}
              />
              <input
                hidden
                name="add_charts"
                value={JSON.stringify(form.values.charts)}
              />
              <Field name="section">
                {({ field: { name, value: section } }) => (
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <ChartsSection
                      section={section}
                      sections={sections}
                      onMove={movement => {
                        let o;
                        const index = sections.findIndex(
                          ({ id }) =>
                            // eslint-disable-next-line eqeqeq
                            id == document.getElementById('post_ID').value
                        );
                        if (movement === 1 && index < sections.length - 1) {
                          if (index + 2 < sections.length - 1) {
                            o =
                              (sections[index + 1].order +
                                sections[index + 2].order) /
                              2;
                          } else {
                            o = sections[index + 1].order + 1;
                          }
                        } else if (index > 0) {
                          if (index - 2 >= 0) {
                            o =
                              (sections[index - 1].order +
                                sections[index - 2].order) /
                              2;
                          } else {
                            o = sections[index - 1].order - 1;
                          }
                        }

                        if (o === undefined) {
                          return;
                        }
                        form.setFieldValue(
                          name,
                          Object.assign(section, {
                            order: o
                          })
                        );
                        setOrder(o);
                      }}
                      onChange={changes => {
                        form.setFieldValue(
                          name,
                          Object.assign(section, changes)
                        );
                      }}
                      onAddChart={charts => {
                        form.setFieldValue(
                          'charts',
                          charts.map(chart => {
                            return {
                              id: chart.value,
                              layout: chart.layout
                            };
                          })
                        );
                      }}
                      onRemoveChart={chartId => {
                        form.setFieldValue(
                          'charts',
                          form.values.charts.filter(({ id }) => id !== chartId)
                        );
                      }}
                      charts={form.values.charts.map(chart => {
                        return {
                          value: chart.id,
                          label: chart.title,
                          layout: chart.layout || '1'
                        };
                      })}
                      options={
                        window.initial && window.initial.charts
                          ? window.initial.charts.map(c => ({
                              label: c.title,
                              value: c.id
                            }))
                          : []
                      }
                    />
                  </React.Suspense>
                )}
              </Field>
            </>
          )}
        />
      </Grid>
      <Grid item md={8} />
    </Grid>
  );
}

export default ChartSectionForm;
