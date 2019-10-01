import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import Chart from './Chart';

import sections from '../data/charts';

import withRoot from '../withRoot';
import { GET_GEOGRAPHIES, buildDataCountQuery } from '../data/queries';
import propTypes from '../propTypes';

function EditChart({
  clientId,
  attributes: { chartId: selectedChart, geoId: selectedGeo, chartWidth },
  setAttributes
}) {
  const client = useApolloClient();

  const [availableCharts, setAvailableCharts] = useState([]);

  useEffect(() => {
    (async () => {
      const charts = sections.reduce((a, b) => a.concat(b.charts), []);
      const { data } = await client.query({
        query: buildDataCountQuery(charts),
        variables: {
          geoCode: selectedGeo.split('-')[1],
          geoLevel: selectedGeo.split('-')[0]
        }
      });

      setAvailableCharts(
        charts
          .filter(({ visual: { table } }) => data[table].totalCount !== 0)
          .map(chart => ({
            label: chart.title,
            value: chart.id
          }))
      );
    })();
  }, [client, selectedGeo]);

  const { loading, error, data: options } = useQuery(GET_GEOGRAPHIES);

  const blockDiv = document.querySelector(`div[data-block="${clientId}"]`);
  if (blockDiv) {
    blockDiv.style.width = chartWidth;
  }

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Chart Selection', 'hurumap-ui')} />
      </InspectorControls>

      {!loading && !error && (
        <Grid container direction="row" wrap="nowrap" spacing={1}>
          <Grid item>
            <SelectControl
              label={__('Geography', 'hurumap-ui')}
              value={selectedGeo}
              options={
                options
                  ? options.geos.nodes.map(geo => ({
                      label: geo.name,
                      value: `${geo.geoLevel}-${geo.geoCode}`
                    }))
                  : []
              }
              onChange={geoId => {
                setAttributes({ geoId });
              }}
            />
          </Grid>
          <Grid item>
            <SelectControl
              label={__('Chart', 'hurumap-ui')}
              value={selectedChart}
              options={availableCharts}
              onChange={chartId => {
                setAttributes({ chartId });
              }}
            />
          </Grid>
          <Grid item>
            <TextControl
              label={__('Width', 'hurumap-ui')}
              value={chartWidth}
              onChange={width => {
                setAttributes({ chartWidth: width });
              }}
            />
          </Grid>
        </Grid>
      )}

      <Chart geoId={selectedGeo} chartId={selectedChart} />
    </Fragment>
  );
}

EditChart.propTypes = {
  clientId: propTypes.string.isRequired,
  attributes: propTypes.shape({
    chartWidth: propTypes.string,
    chartId: propTypes.chartId,
    geoId: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(EditChart);
