import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import Chart from './Chart';

import withRoot from '../withRoot';
import { GET_GEOGRAPHIES, buildDataCountQuery } from '../data/queries';
import propTypes from '../propTypes';

function EditChart({
  clientId,
  attributes: { chartId: selectedChart, geoId: selectedGeo, chartWidth },
  setAttributes
}) {
  const client = useApolloClient();

  const [allCharts, setAllCharts] = useState([]);
  const [availableCharts, setAvailableCharts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/wp-json/hurumap-data/charts?published=1');
      const json = await res.json();
      const charts = json.hurumap.map((chart, index) => ({
        ...chart,
        queryAlias: `chart${index}`,
        visual: {
          ...JSON.parse(chart.visual),
          queryAlias: `viz${index}`
        },
        stat: {
          ...JSON.parse(chart.stat),
          queryAlias: `viz${index}`
        }
      }));

      setAllCharts(charts);

      if (selectedGeo) {
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
            .concat([{ value: '', label: '' }])
        );
      }
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
        <PanelBody title={__('Chart Selection', 'hurumap-data')} />
      </InspectorControls>

      {!loading && !error && (
        <Grid container direction="row" wrap="nowrap" spacing={1}>
          <Grid item>
            <SelectControl
              label={__('Geography', 'hurumap-data')}
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
              label={__('Chart', 'hurumap-data')}
              value={
                availableCharts.find(({ value }) => value === selectedChart)
                  ? selectedChart
                  : ''
              }
              options={availableCharts}
              onChange={chartId => {
                setAttributes({ chartId });
              }}
            />
          </Grid>
          <Grid item>
            <TextControl
              label={__('Width', 'hurumap-data')}
              value={chartWidth}
              onChange={width => {
                setAttributes({ chartWidth: width });
              }}
            />
          </Grid>
        </Grid>
      )}

      <Chart geoId={selectedGeo} chartId={selectedChart} charts={allCharts} />
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
