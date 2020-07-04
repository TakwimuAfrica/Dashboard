import React, { useMemo, useState, useCallback, useEffect } from 'react';
import Select from 'react-select';
import pluralize from 'pluralize';
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import { HURUmapChart } from '@hurumap-ui/core';

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

const lineInterpolationOptions = [
  {
    label: 'Basis',
    value: 'basis'
  },
  {
    label: 'Bundle',
    value: 'bundle'
  },
  {
    label: 'Cardinal',
    value: 'cardinal'
  },
  {
    label: 'CatmullRom',
    value: 'catmullRom'
  },
  {
    label: 'Linear',
    value: 'linear'
  },
  {
    label: 'MonotoneX',
    value: 'monotoneX'
  },
  {
    label: 'MonotoneY',
    value: 'monotoneY'
  },
  {
    label: 'Natural',
    value: 'natural'
  },
  {
    label: 'Step',
    value: 'step'
  },
  {
    label: 'StepAfter',
    value: 'stepAfer'
  },
  {
    label: 'StepBefore',
    value: 'stepBefore'
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
    label: 'Raw (Percent)',
    value: 'raw:percent'
  },
  {
    label: 'Avg',
    value: 'avg'
  },
  {
    label: 'Avg (Percent)',
    value: 'avg:percent'
  },
  {
    label: 'Max',
    value: 'max'
  },
  {
    label: 'Max (Percent)',
    value: 'max:percent'
  },
  {
    label: 'Min',
    value: 'min'
  },
  {
    label: 'Min (Percent)',
    value: 'min:percent'
  },
  {
    label: 'Sum',
    value: 'sum'
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

  const [alignment, setAlignment] = useState(
    chart.visual.typeProps && chart.visual.typeProps.horizontal
      ? 'horizontal'
      : 'vertical'
  );

  const [otherProps, setOtherProps] = useState(null);

  useEffect(() => {
    if (chart.visual.typeProps) {
      const { horizontal, interpolation, ...y } = chart.visual.typeProps;
      setOtherProps(JSON.stringify(y));
    }
  }, [chart.visual.typeProps]);

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

  const autoSelectAggregate = useCallback(
    type => {
      if (type.includes('grouped')) {
        return (visual.style || '').includes('percent') ? 'raw:percent' : 'raw';
      }
      return visual.aggregate;
    },
    [visual.aggregate, visual.style]
  );

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
      <Grid item xs={12} md={3}>
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
                <InputLabel required shrink>
                  Visual type (required)
                </InputLabel>
                <Select
                  placeholder="Select chart type"
                  // eslint-disable-next-line eqeqeq
                  value={chartTypeOptions.find(o => o.value == visual.type)}
                  options={chartTypeOptions}
                  onChange={({ value: type }) => {
                    handleUpdate('visual', {
                      type,
                      aggregate: autoSelectAggregate(type)
                    });
                  }}
                />
              </Grid>

              {visual.type && visual.type.includes('column') && (
                <Grid
                  item
                  container
                  component="label"
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      name="position"
                      value={alignment}
                      onChange={e => {
                        setAlignment(e.target.value);
                        handleUpdate('visual', {
                          typeProps: {
                            horizontal: e.target.value === 'horizontal'
                          }
                        });
                      }}
                    >
                      <FormControlLabel
                        value="horizontal"
                        control={<Radio size="small" />}
                        label="Horizontal"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="vertical"
                        control={<Radio size="small" />}
                        label="Vertical"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              )}
              {visual.type && visual.type.includes('line') && (
                <Grid item>
                  <InputLabel shrink>Interpolation</InputLabel>
                  <Select
                    defaultValue={lineInterpolationOptions[4]}
                    placeholder="Interpolation"
                    value={lineInterpolationOptions.find(o => {
                      return o.value === visual.typeProps.interpolation;
                    })}
                    options={lineInterpolationOptions}
                    onChange={({ value }) => {
                      handleUpdate('visual', {
                        typeProps: { interpolation: value }
                      });
                    }}
                  />
                </Grid>
              )}

              <Grid item>
                <InputLabel required shrink>
                  Data Table (required)
                </InputLabel>
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
                <InputLabel required shrink>
                  Data Label (required)
                </InputLabel>
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
              {visual.type && visual.type.includes('number') && (
                <Grid item>
                  <TextField
                    label="Number description"
                    value={visual.description}
                    InputLabelProps={{
                      shrink: true
                    }}
                    onChange={e => {
                      handleUpdate('visual', { description: e.target.value });
                    }}
                    fullWidth
                  />
                </Grid>
              )}

              <Grid item container spacing={1} alignItems="stretch">
                <Grid item xs={6}>
                  <InputLabel shrink>Data Unit Style</InputLabel>
                  <Select
                    defaultValue={dataValueStyle[0]}
                    placeholder="Style"
                    value={dataValueStyle.find(o => o.value === visual.style)}
                    options={dataValueStyle}
                    onChange={({ value: style }) => {
                      if (
                        style === 'percent' &&
                        !(visual.aggregate || 'raw').includes('sum')
                      ) {
                        handleUpdate('visual', {
                          style,
                          aggregate: `${(visual.aggregate || 'raw').split(
                            ':'
                          )}:percent`
                        });
                      } else {
                        handleUpdate('visual', { style });
                      }
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
                    isDisabled={!visual.type}
                    defaultValue={dataAggregateOptions[0]}
                    value={dataAggregateOptions.find(o => {
                      if (visual.type && visual.type.includes('grouped')) {
                        return (
                          o.value ===
                          (visual.aggregate.includes('raw')
                            ? visual.aggregate
                            : 'raw')
                        );
                      }
                      return o.value === visual.aggregate;
                    })}
                    options={dataAggregateOptions.filter(
                      ({ value }) =>
                        (visual.type && !visual.type.includes('grouped')) ||
                        value.includes('raw')
                    )}
                    onChange={({ value: aggregate }) => {
                      handleUpdate('visual', { aggregate });
                    }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <InputLabel required shrink>
                    Data (number) Value
                  </InputLabel>
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

              {visual.type && ['grouped_column', 'line'].includes(visual.type) && (
                <Grid item>
                  <InputLabel required shrink>
                    Group By (required)
                  </InputLabel>
                  <Select
                    placeholder="Select group by field (required)"
                    value={
                      tableFieldOptions.find(
                        o => o.value === visual.groupBy
                      ) || {
                        label: 'none',
                        value: ''
                      }
                    }
                    options={[
                      ...tableFieldOptions,
                      { label: 'none', value: '' }
                    ]}
                    onChange={({ value: groupBy }) => {
                      handleUpdate('visual', { groupBy });
                    }}
                  />
                </Grid>
              )}
              <Grid item>
                <TextField
                  label="Other properties"
                  multiline
                  rows="3"
                  value={otherProps}
                  onChange={e => {
                    const { value } = e.target;
                    setOtherProps(value);
                    setTimeout(() => {
                      onChange({
                        visual: {
                          ...chart.visual,
                          typeProps: {
                            horizontal: chart.visual.typeProps.horizontal,
                            interpolation: chart.visual.typeProps.interpolation,
                            ...JSON.parse(value)
                          }
                        }
                      });
                    }, 3000);
                  }}
                  fullWidth
                />
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
      <Grid item xs={12} md={9}>
        <Paper style={{ padding: 10, minHeight: 350 }}>
          {geoId &&
            !!visual.type &&
            !!visual.x &&
            !!visual.y &&
            (visual.type !== 'grouped_column' || !!visual.groupBy) && (
              <HURUmapChart
                geoId={geoId}
                chart={{
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
    visual: propTypes.shape({
      typeProps: propTypes.shape({
        horizontal: propTypes.bool,
        interpolation: propTypes.string
      })
    }),
    stat: propTypes.shape({}),
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
  }),
  onChange: propTypes.func.isRequired,
  sectionOptions: propTypes.arrayOf(propTypes.shape({}))
};

HurumapChartDefinition.defaultProps = {
  sectionOptions: [],
  data: undefined
};

export default HurumapChartDefinition;
