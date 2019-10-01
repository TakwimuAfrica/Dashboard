import React, { useMemo } from 'react';
import Select from 'react-select';
import { SelectControl } from '@wordpress/components';
import pluralize from 'pluralize';
import { Grid } from '@material-ui/core';
import propTypes from './propTypes';

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
    <Grid container direction="column">
      <SelectControl
        label="Section"
        value={chart.section}
        options={[
          {
            label: 'Population',
            value: 'population'
          }
        ]}
        onChange={section => {
          onChange({ section });
        }}
      />
      <SelectControl
        label="Type"
        value={chart.type}
        options={[
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
            label: 'Typography',
            value: 'typography'
          }
        ]}
        onChange={type => {
          onChange({ type });
        }}
      />

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
      <SelectControl
        label="X"
        value={visual.x}
        options={tableFieldOptions.filter(option => option.value !== visual.y)}
        onChange={x => {
          handleUpdateVisual({ x });
        }}
      />
      <SelectControl
        label="Y"
        value={visual.y || 'total'}
        options={tableFieldOptions.filter(option => option.value !== visual.x)}
        onChange={y => {
          handleUpdateVisual({ y });
        }}
      />
      <SelectControl
        label="Group By"
        value={visual.groupBy}
        options={tableFieldOptions}
        onChange={groupBy => {
          handleUpdateVisual({ groupBy });
        }}
      />
      <SelectControl
        label="Aggregate"
        value={visual.aggregate}
        options={[
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
        ]}
        onChange={aggregate => {
          handleUpdateVisual({ aggregate });
        }}
      />
    </Grid>
  );
}

HurumapChart.propTypes = {
  chart: propTypes.shape({
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
