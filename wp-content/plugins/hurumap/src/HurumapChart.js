import React, { useMemo } from 'react';
import Select from 'react-select';
import pluralize from 'pluralize';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';

import propTypes from './propTypes';
import HurumapChartPreview from './HurumapChartPreview';
import HurumapChartDescription from './HurumapChartDescription';
// import Actions from './Actions';

const dataValueStyle = [
  {
    label: 'Custom',
    value: ''
  },
  {
    label: 'Percent',
    value: 'percent'
  },
  {
    label: 'Currency',
    value: 'currency'
  }
];

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
    value: 'raw'
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
    label: 'Sum',
    value: 'sum'
  },
  {
    label: 'Sum (Percent)',
    value: 'sum:percent'
  },
  {
    label: 'First',
    value: 'first'
  },
  {
    label: 'First (Percent)',
    value: 'first:percent'
  },
  {
    label: 'Last',
    value: 'last'
  },
  {
    label: 'Last (Percent)',
    value: 'last:percent'
  }
];

function HurumapChart({ chart, data, sectionOptions, onChange }) {
  const stat = useMemo(
    () =>
      chart.stat
        ? JSON.parse(chart.stat)
        : {
            type: 'number',
            subtitle: chart.subtitle,
            description: '',
            aggregate: 'sum',
            unique: true,
            unit: 'percent'
          },
    [chart]
  );
  const visual = useMemo(() => (chart.visual ? JSON.parse(chart.visual) : {}), [
    chart.visual
  ]);
  const visualTableName = table =>
    table ? pluralize.singular(table.slice(3)) : '';
  const tableFieldOptions = useMemo(() => {
    const tableName = visualTableName(visual.table);
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
  const handleUpdateStat = changes => {
    onChange({
      stat: JSON.stringify(Object.assign(stat, changes))
    });
  };

  return (
    <Paper style={{ padding: 10 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3} container direction="column" spacing={1}>
          {/* <Grid item container justify="space-between">
            <Grid item>
              <Checkbox />
            </Grid>
            <Grid item>
              <Actions
                id={chart.id}
                actions={[{ label: 'Delete', value: 'delete' }]}
                onAction={onAction}
              />
            </Grid>
          </Grid> */}
          <Grid item>
            <TextField
              label="Title"
              value={chart.title}
              InputLabelProps={{
                shrink: true
              }}
              onChange={e => {
                onChange({ title: e.target.value });
              }}
              fullWidth
            />
          </Grid>
          <Grid item>
            <TextField
              label="Subtitle"
              InputLabelProps={{
                shrink: true
              }}
              value={chart.subtitle}
              onChange={e => {
                onChange({ subtitle: e.target.value });
                handleUpdateStat({ subtitle: e.target.value });
              }}
              fullWidth
            />
          </Grid>
          <Grid item>
            <InputLabel shrink>Section</InputLabel>
            <Select
              placeholder="Select section"
              value={sectionOptions.find(o => o.value === chart.section)}
              options={sectionOptions}
              onChange={({ value: section }) => {
                onChange({ section });
              }}
            />
          </Grid>
          <Grid item>
            <InputLabel shrink>Visual type</InputLabel>
            <Select
              placeholder="Select chart type"
              value={chartTypeOptions.find(o => o.value === visual.type)}
              options={chartTypeOptions}
              onChange={({ value: type }) => {
                handleUpdateVisual({ type });
              }}
            />
          </Grid>

          {visual.type && visual.type.includes('column') && (
            <Grid
              item
              container
              component="label"
              alignItems="center"
              spacing={1}
            >
              <Grid item>Column: Vertical</Grid>
              <Grid item>
                <Switch
                  size="small"
                  defaultChecked={false}
                  checked={visual.horizontal}
                  onChange={(_, horizontal) => {
                    handleUpdateVisual({ horizontal });
                  }}
                />
              </Grid>
              <Grid item>Horizontal</Grid>
            </Grid>
          )}

          <Grid item>
            <InputLabel shrink>Table</InputLabel>
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
                label: visualTableName(visual.table)
              }}
              onChange={({ value: table }) => {
                handleUpdateVisual({ table });
              }}
            />
          </Grid>

          <Grid item>
            <InputLabel shrink>Data Label</InputLabel>
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
            <Grid item xs={6}>
              <InputLabel shrink>Data Unit Style</InputLabel>
              <Select
                defaultValue={dataValueStyle[0]}
                placeholder="Style"
                value={dataValueStyle.find(o => o.value === visual.style)}
                options={dataValueStyle}
                onChange={({ value: style }) => {
                  handleUpdateVisual({ style });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              {!visual.style && (
                <TextField
                  label="Unit"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={visual.customUnit}
                  onChange={e => {
                    handleUpdateVisual({ customUnit: e.target.value });
                  }}
                  fullWidth
                />
              )}
              {visual.style === 'currency' && (
                <TextField
                  label="Currency Code"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={visual.currency}
                  onChange={e => {
                    handleUpdateVisual({ currency: e.target.value });
                  }}
                  fullWidth
                />
              )}
            </Grid>
          </Grid>

          <Grid item container spacing={1}>
            <Grid item xs={4}>
              <InputLabel shrink>Aggregate</InputLabel>
              <Select
                defaultValue={dataAggregateOptions[0]}
                placeholder="Aggregate"
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
              <InputLabel shrink>Data Value</InputLabel>
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
            <InputLabel shrink>Group by</InputLabel>
            <Select
              placeholder="Select group by field (optional)"
              value={
                tableFieldOptions.find(o => o.value === visual.groupBy) || {
                  label: 'none',
                  value: ''
                }
              }
              options={[...tableFieldOptions, { label: 'none', value: '' }]}
              onChange={({ value: groupBy }) => {
                handleUpdateVisual({ groupBy });
              }}
            />
          </Grid>

          <Grid item>
            <Typography>Stat</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Description"
              placeholder="Statistic visual description"
              InputLabelProps={{
                shrink: true
              }}
              value={stat.description}
              onChange={e => {
                handleUpdateStat({ description: e.target.value });
              }}
              fullWidth
              multiline
            />
          </Grid>

          <Grid item container spacing={1}>
            <Grid item xs={6}>
              <InputLabel shrink>Aggregate</InputLabel>
              <Select
                defaultValue={dataAggregateOptions[0]}
                placeholder="Aggregate"
                value={dataAggregateOptions.find(
                  o => o.value === stat.aggregate
                )}
                options={dataAggregateOptions}
                onChange={({ value: aggregate }) => {
                  handleUpdateStat({ aggregate });
                }}
              />
            </Grid>
            <Grid
              item
              xs={6}
              component="label"
              container
              alignItems="center"
              spacing={1}
              wrap="nowrap"
            >
              <Grid item>
                <Switch
                  size="small"
                  defaultChecked={false}
                  checked={stat.unique}
                  onChange={(_, unique) => {
                    handleUpdateStat({ unique });
                  }}
                />
              </Grid>
              <Grid item>
                Aggregate <b>{stat.unique ? 'with respect' : 'irrespective'}</b>{' '}
                {stat.unique ? 'to' : 'of'} <b>Data Label</b>
              </Grid>
            </Grid>
          </Grid>

          <Grid item container spacing={1}>
            <Grid item xs={6}>
              <InputLabel shrink>Statistic Unit Style</InputLabel>
              <Select
                defaultValue={dataValueStyle[0]}
                placeholder="Style"
                value={dataValueStyle.find(o => o.value === visual.style)}
                options={dataValueStyle}
                onChange={({ value: style }) => {
                  handleUpdateStat({ style });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              {!visual.style && (
                <TextField
                  label="Unit"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={visual.customUnit}
                  onChange={e => {
                    handleUpdateStat({ customUnit: e.target.value });
                  }}
                  fullWidth
                />
              )}
              {visual.style === 'currency' && (
                <TextField
                  label="Currency Code"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={visual.currency}
                  onChange={e => {
                    handleUpdateStat({ currency: e.target.value });
                  }}
                  fullWidth
                />
              )}
            </Grid>
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
                defaultChecked={false}
                checked={chart.published === '1' || chart.published === true}
                onChange={(_, published) => {
                  onChange({ published });
                }}
              />
            </Grid>
            <Grid item>Published</Grid>
          </Grid>
        </Grid>

        <Grid item container xs={12} md={9}>
          <Grid item md={12}>
            <HurumapChartPreview
              chart={{
                ...chart,
                visual,
                stat
              }}
            />
          </Grid>
          <Grid item md={12}>
            <HurumapChartDescription
              chart={{
                ...chart,
                visual,
                stat
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

HurumapChart.propTypes = {
  chart: propTypes.shape({
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    subtitle: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.string,
    stat: propTypes.string
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
  onChange: propTypes.func.isRequired,
  sectionOptions: propTypes.arrayOf(propTypes.shape({})).isRequired
};

export default HurumapChart;
