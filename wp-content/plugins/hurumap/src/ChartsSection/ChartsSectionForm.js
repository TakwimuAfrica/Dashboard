import React, { useMemo, useRef, useState } from 'react';

import { Formik, Field } from 'formik';

const ChartsSection = React.lazy(() => import('./ChartsSection'));

function ChartSectionForm() {
  const formRef = useRef();
  const [order, setOrder] = useState();
  const sections = useMemo(() => {
    const index = window.initial.sections.findIndex(
      ({ id }) => document.getElementById('post_ID').value === id
    );

    function move(arr, fromIndex, toIndex) {
      const element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    }

    if (index === -1) {
      window.initial.sections.push({
        id: document.getElementById('post_ID').value,
        order: window.initial.sections.length
      });
    }

    if (order) {
      move(window.initial.sections, index, order);
    }
    return window.initial.sections;
  }, [order]);

  return (
    <Formik
      ref={formRef}
      enableReinitialize
      initialValues={{
        section: window.initial.section || {
          id: document.getElementById('post_ID').value,
          order: window.initial.sections.length
        }
      }}
      render={form => (
        <>
          <input hidden name="post_excerpt" value="chart_section" />
          <input
            hidden
            name="post_content"
            value={JSON.stringify(form.values.section)}
          />
          <Field name="section">
            {({ field: { name, value: section } }) => (
              <React.Suspense fallback={<div>Loading...</div>}>
                <ChartsSection
                  section={section}
                  sections={sections}
                  onMove={movement => {
                    const change = {
                      order:
                        movement === 'up'
                          ? section.order - 1
                          : section.order + 1
                    };
                    form.setFieldValue(name, Object.assign(section, change));
                    setOrder(change.order);
                  }}
                  onChange={changes => {
                    form.setFieldValue(name, Object.assign(section, changes));
                  }}
                  onAddChart={() => {
                    // let chart = form.values.hurumapCharts.find(
                    //   c => c.id === chartId
                    // );
                    // if (chart) {
                    //   handleUpdateHurumapChart(form, chart, {
                    //     section: section.id
                    //   });
                    // } else {
                    //   chart = form.values.flourishCharts.find(
                    //     c => c.id === chartId
                    //   );
                    // }
                  }}
                  onRemoveChart={() => {
                    // let chart = form.values.hurumapCharts.find(
                    //   c => c.id === chartId
                    // );
                    // if (chart) {
                    //   handleUpdateHurumapChart(form, chart, {
                    //     section: null
                    //   });
                    // } else {
                    //   chart = form.values.flourishCharts.find(
                    //     c => c.id === chartId
                    //   );
                    // }
                  }}
                  charts={window.initial.charts
                    .filter(c => c.section === section.id)
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
