import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

import { Grid } from '@material-ui/core';

import withRoot from '../withRoot';
import propTypes from '../propTypes';
import Chart from './Chart';
import config from '../config';

function Edit({
  attributes: {
    chartId: selectedChart,
    country: selectedCountry,
    title,
    description
  },
  setAttributes
}) {
  const [charts, setCharts] = useState([]);
  const [countryCharts, setCountryCharts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/wp-json/hurumap-data/charts?published=1');
      const { flourish } = await res.json();

      setCharts(flourish);
      setCountryCharts(
        flourish.filter(chart => chart.country === selectedCountry)
      );
    })();
  }, [selectedCountry]);

  const options = [
    { value: null, label: 'Select a flourish chart', disabled: true }
  ];

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Flourish Chart Selection', 'hurumap-data')} />
      </InspectorControls>

      <Grid container direction="row">
        <Grid item>
          <SelectControl
            label={__('Country', 'hurumap-data')}
            value={selectedCountry}
            options={config.countries.map(country => ({
              value: country.slug,
              label: country.name
            }))}
            onChange={country => {
              setAttributes({ country });
            }}
          />
        </Grid>
        <Grid item>
          <SelectControl
            label={__('Flourish Chart', 'hurumap-data')}
            value={selectedChart}
            options={options.concat(
              countryCharts.map(chart => ({
                label: chart.title,
                value: chart.id
              }))
            )}
            onChange={chartId => {
              const {
                title: chartTitle,
                description: chartDescription
              } = charts.find(chart => chart.id === chartId);
              setAttributes({
                chartId,
                title: chartTitle,
                description: chartDescription
              });
            }}
          />
        </Grid>
      </Grid>
      {selectedChart && (
        <Chart
          chartId={selectedChart}
          title={title}
          description={description}
        />
      )}
    </Fragment>
  );
}

Edit.propTypes = {
  attributes: propTypes.shape({
    country: propTypes.string,
    chartId: propTypes.string,
    title: propTypes.string,
    description: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(Edit);
