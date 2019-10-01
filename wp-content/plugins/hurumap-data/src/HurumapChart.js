import React, { useMemo } from 'react';
import Select from 'react-select';
import pluralize from 'pluralize';
import { Grid, Switch, Paper, TextField } from '@material-ui/core';
import propTypes from './propTypes';
import HurumapChartPreview from './HurumapChartPreview';

const chartTypeOptions = [
  {
    label: 'Pie',
    value: 'pie'
  },
  {
    label: 'Column',
    value: 'column'
  },
  {
    label: 'Grouped Column',
    value: 'grouped_column'
  },
  {
    label: 'Number',
    value: 'number'
  }
];

const dataAggregateOptions = [
  {
    label: 'Raw',
    value: ''
  },
  {
    label: 'Sum',
    value: 'sum'
  },
  {
    label: 'Avg',
    value: 'avg'
  },
  {
    label: 'Max',
    value: 'max'
  },
  {
    label: 'Min',
    value: 'min'
  },
  {
    label: 'Percentage',
    value: 'sum:percentage'
  }
];

function HurumapChart({ chart, data, onChange }) {
  const visual = useMemo(() => JSON.parse(chart.visual), [chart.visual]);
  const tableFieldOptions = useMemo(() => {
    const tableName = pluralize.singular(visual.table.slice(3));
    /* eslint-disable-next-line no-underscore-dangle */
    return data && data.__schema.types.find(type => tableName === type.name)
      ? /* eslint-disable-next-line no-underscore-dangle */
        data.__schema.types
          .find(type => tableName === type.name)
          /* Filter out some table attributes */
          .fields.filter(field => !/id|nodeId|By/g.test(field.name))
          .map(field => ({
            label: field.name,
            value: field.name
          }))
      : [];
  }, [data, visual]);
  const handleUpdateVisual = changes => {
    onChange({
      visual: JSON.stringify(Object.assign(visual, changes))
    });
  };
  return (
    <Paper style={{ padding: 10 }}>
      <Grid container>
        <Grid item xs={12} md={4} container direction="column" spacing={1}>
          <Grid item>
            <TextField
              label="Title"
              value={chart.title}
              onChange={e => {
                onChange({ title: e.target.value });
              }}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label="Subtitle"
              value={chart.subtitle}
              onChange={e => {
                onChange({ subtitle: e.target.value });
              }}
              fullWidth
            />
          </Grid>
          <Grid item>
            <Select
              placeholder="Select section"
              value={{
                value: chart.section,
                label: chart.section
              }}
              options={[
                {
                  label: 'Population',
                  value: 'population'
                }
              ]}
              onChange={({ value: section }) => {
                onChange({ section });
              }}
            />
          </Grid>
          <Grid item>
            <Select
              placeholder="Select chart type"
              value={chartTypeOptions.find(o => o.value === chart.type)}
              options={chartTypeOptions}
              onChange={({ value: type }) => {
                onChange({ type });
              }}
            />
          </Grid>
          <Grid item>
            <Select
              placeholder="Select a chart table"
              options={
                data
                  ? /* eslint-disable-next-line no-underscore-dangle */
                    data.__schema.types[0].fields
                      .filter(field => field.name.slice(0, 3) === 'all')
                      .filter(
                        field =>
                          /* Filter out some tables */
                          !/Takwimu|Wagtail|Django|Hurumap|Wazimap|Account|Auth|Census/g.test(
                            field.name
                          ) || /WazimapGeographies/g.test(field.name)
                      )
                      .map(field => ({
                        label: pluralize.singular(field.name.slice(3)),
                        value: field.name
                      }))
                  : []
              }
              value={{
                value: visual.table,
                label: pluralize.singular(visual.table.slice(3))
              }}
              onChange={({ value: table }) => {
                handleUpdateVisual({ table });
              }}
            />
          </Grid>

          <Grid item>
            <Select
              placeholder="Select labels field"
              value={tableFieldOptions.find(o => o.value === visual.x)}
              options={tableFieldOptions.filter(
                option => option.value !== visual.y
              )}
              onChange={({ value: x }) => {
                handleUpdateVisual({ x });
              }}
            />
          </Grid>

          <Grid item container spacing={1}>
            <Grid item xs={4}>
              <Select
                placeholder="Aggregate (optional)"
                value={dataAggregateOptions.find(
                  o => o.value === visual.aggregate
                )}
                options={dataAggregateOptions}
                onChange={({ value: aggregate }) => {
                  handleUpdateVisual({ aggregate });
                }}
              />
            </Grid>
            <Grid item xs={8}>
              <Select
                placeholder="Select data field"
                value={tableFieldOptions.find(o => o.value === visual.y)}
                options={tableFieldOptions.filter(
                  option => option.value !== visual.x
                )}
                onChange={({ value: y }) => {
                  handleUpdateVisual({ y });
                }}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Select
              placeholder="Select group by field (optional)"
              value={tableFieldOptions.find(o => o.value === visual.groupBy)}
              options={tableFieldOptions}
              onChange={({ value: groupBy }) => {
                handleUpdateVisual({ groupBy });
              }}
            />
          </Grid>

          <Grid
            component="label"
            item
            container
            alignItems="center"
            spacing={1}
          >
            <Grid item>Draft</Grid>
            <Grid item>
              <Switch
                checked={chart.published}
                onChange={(_, published) => {
                  onChange({ published });
                }}
              />
            </Grid>
            <Grid item>Published</Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={8}>
          <HurumapChartPreview />
        </Grid>
      </Grid>
    </Paper>
  );
}

HurumapChart.propTypes = {
  chart: propTypes.shape({
    published: propTypes.bool,
    title: propTypes.string,
    subtitle: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.string
  }).isRequired,
  data: propTypes.shape({
    __schema: propTypes.shape({
      types: propTypes.arrayOf(
        propTypes.shape({
          fields: propTypes.arrayOf(propTypes.shape({}))
        })
      )
    })
  }).isRequired,
  onChange: propTypes.func.isRequired
};

export default HurumapChart;
