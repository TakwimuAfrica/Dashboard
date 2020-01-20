import React, { useMemo, useState, useCallback } from 'react';
import Select from 'react-select';
import pluralize from 'pluralize';
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';

import { HURUmapChart } from '@codeforafrica/hurumap-ui/cms';

import propTypes from '../propTypes';
import GeoSelect from '../GeoSelect';

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
  },
  {
    label: 'Line',
    value: 'line'
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

function HurumapChartDefinition({ chart, data, sectionOptions, onChange }) {
  const stat = useMemo(() => chart.stat || {}, [chart.stat]);
  const visual = useMemo(() => chart.visual || {}, [chart.visual]);
  const description = useMemo(() => chart.description || {}, [
    chart.description
  ]);

  const [geoId, setGeoId] = useState(null);

  const visualTableName = useCallback(
    table => (table ? pluralize.singular(table.slice(3)) : ''),
    []
  );

  const tableFieldOptions = useMemo(() => {
    if (visual.table) {
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
    }
    return [];
  }, [visual.table, visualTableName, data]);

  const handleUpdate = (key, changes) => {
    onChange({
      [key]: _.merge(chart[key], changes)
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Paper style={{ padding: 10 }}>
          <Grid item>
            <TextField
              label="Title"
              name="post_title"
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
                handleUpdate('stat', { subtitle: e.target.value });
              }}
              fullWidth
            />
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper style={{ padding: 10 }}>
              <Grid item>
                <InputLabel shrink>Section</InputLabel>
                <Select
                  placeholder="Select section"
                  // eslint-disable-next-line eqeqeq
                  value={sectionOptions.find(o => o.value == chart.section)}
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
                  // eslint-disable-next-line eqeqeq
                  value={chartTypeOptions.find(o => o.value == visual.type)}
                  options={chartTypeOptions}
                  onChange={({ value: type }) => {
                    handleUpdate('visual', { type });
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
                      checked={visual.typeProps.horizontal}
                      onChange={(_ignore, horizontal) => {
                        handleUpdate('visual', { typeProps: { horizontal } });
                      }}
                    />
                  </Grid>
                  <Grid item>Horizontal</Grid>
                </Grid>
              )}

              <Grid item>
                <InputLabel shrink>Data Table</InputLabel>
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
                    handleUpdate('visual', { table });
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
                    handleUpdate('visual', { x });
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
                      handleUpdate('visual', { style });
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
                        handleUpdate('visual', { customUnit: e.target.value });
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
                        handleUpdate('visual', { currency: e.target.value });
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
                      handleUpdate('visual', { aggregate });
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
                      handleUpdate('visual', { y });
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
                    handleUpdate('visual', { groupBy });
                  }}
                />
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: 10 }}>
              <Grid item>
                <Typography>Statistic</Typography>
              </Grid>
              <Grid item>
                <TextField
                  rows="2"
                  label="Description"
                  placeholder="Statistic visual description"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={stat.description}
                  onChange={e => {
                    handleUpdate('stat', { description: e.target.value });
                  }}
                  fullWidth
                  multiline
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel shrink>Aggregate</InputLabel>
                <Select
                  defaultValue={dataAggregateOptions[0]}
                  placeholder="Aggregate"
                  value={dataAggregateOptions.find(
                    o => o.value === stat.aggregate
                  )}
                  options={dataAggregateOptions}
                  onChange={({ value: aggregate }) => {
                    handleUpdate('stat', { aggregate });
                  }}
                />
              </Grid>
              <Grid
                item
                container
                component="label"
                alignItems="center"
                spacing={1}
                wrap="nowrap"
              >
                <Grid item>
                  <Switch
                    size="small"
                    defaultChecked={false}
                    checked={stat.unique}
                    onChange={(_ignore, unique) => {
                      handleUpdate('stat', { unique });
                    }}
                  />
                </Grid>
                <Grid item>
                  Aggregate{' '}
                  <b>{stat.unique ? 'with respect' : 'irrespective'}</b>{' '}
                  {stat.unique ? 'to' : 'of'} <b>Data Label</b>
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
                      handleUpdate('stat', { style });
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  {stat.style === 'currency' ? (
                    <TextField
                      label="Currency Code"
                      InputLabelProps={{
                        shrink: true
                      }}
                      value={stat.currency}
                      onChange={e => {
                        handleUpdate('stat', {
                          currency: e.target.value,
                          customUnit: ''
                        });
                      }}
                      fullWidth
                    />
                  ) : (
                    <TextField
                      label="Unit"
                      value={stat.customUnit}
                      InputLabelProps={{
                        shrink: true
                      }}
                      onChange={e => {
                        handleUpdate('stat', { customUnit: e.target.value });
                      }}
                      fullWidth
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper style={{ padding: 10 }}>
              <Grid item>
                <Typography>Geo</Typography>
              </Grid>
              <GeoSelect
                placeholder={
                  visual.table ? 'Select Geography' : 'Select Data Table'
                }
                handleChartGeos={onChange}
                table={visual.table}
                onChange={setGeoId}
              />
              {geoId && (
                <TextField
                  fullWidth
                  multiline
                  rows="4"
                  type="text"
                  label="Description"
                  placeholder="Description for geo"
                  InputLabelProps={{
                    shrink: true
                  }}
                  value={description[geoId]}
                  onChange={e => {
                    handleUpdate('description', {
                      [geoId]: e.target.value
                    });
                  }}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={8}>
        <Paper style={{ padding: 10 }}>
          {geoId && !!visual.x && !!visual.y && (
            <HURUmapChart
              showStatVisual
              geoId={geoId}
              definition={{
                ...chart,
                description,
                queryAlias: 'chartPreview',
                stat: { ...stat, queryAlias: 'vizPreview' },
                visual: { ...visual, queryAlias: 'vizPreview' }
              }}
            />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

HurumapChartDefinition.propTypes = {
  chart: propTypes.shape({
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    subtitle: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.string,
    stat: propTypes.string,
    description: propTypes.shape({})
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

export default HurumapChartDefinition;
