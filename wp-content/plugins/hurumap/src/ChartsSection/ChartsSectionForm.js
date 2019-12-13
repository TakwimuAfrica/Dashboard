import React, { useMemo, useRef, useState } from 'react';

import { Formik, Field } from 'formik';

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
    const section = window.initial.sections.find(
      // eslint-disable-next-line eqeqeq
      ({ id }) => document.getElementById('post_ID').value == id
    );
    if (!section) {
      window.initial.sections.push({
        id: document.getElementById('post_ID').value,
        order: window.initial.sections.length
      });
    }
    if (order !== undefined) {
      section.order = order;
    }
    return window.initial.sections.sort((a, b) => a.order - b.order);
  }, [order]);

  const initialCharts = useMemo(
    () =>
      window.initial.charts
        .filter(
          // eslint-disable-next-line eqeqeq
          ({ section }) => section == document.getElementById('post_ID').value
        )
        .map(({ id }) => id),
    []
  );

  return (
    <Formik
      ref={formRef}
      enableReinitialize
      initialValues={{
        section: window.initial.section || {
          id: document.getElementById('post_ID').value,
          order: window.initial.sections.length
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
              initialCharts.filter(id => !form.values.charts.includes(id))
            )}
          />
          <input
            hidden
            name="add_charts"
            value={JSON.stringify(
              form.values.charts.filter(id => !initialCharts.includes(id))
            )}
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
                    form.setFieldValue(name, Object.assign(section, changes));
                  }}
                  onAddChart={chartId => {
                    form.setFieldValue('charts', [
                      ...form.values.charts,
                      chartId
                    ]);
                  }}
                  onRemoveChart={chartId => {
                    form.setFieldValue(
                      'charts',
                      form.values.charts.filter(id => id !== chartId)
                    );
                  }}
                  charts={window.initial.charts
                    .filter(c => form.values.charts.includes(c.id))
                    .map(c => ({
                      label: c.title,
                      value: c.id
                    }))}
                  options={window.initial.charts.map(c => ({
                    label: c.title,
                    value: c.id
                  }))}
                />
              </React.Suspense>
            )}
          </Field>
        </>
      )}
    />
  );
}

export default ChartSectionForm;
