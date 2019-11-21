import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
  CheckboxControl,
  PanelBody,
  SelectControl,
  PanelRow,
  TextControl,
  TextareaControl
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

import { Grid } from '@material-ui/core';
import { useQuery } from '@apollo/react-hooks';
import { GET_GEOGRAPHIES } from '../data/queries';

import withRoot from '../withRoot';
import propTypes from '../propTypes';
import Chart from './Chart';
import config from '../config';

function Edit({
  attributes: {
    chartId: selectedChart,
    country: selectedCountry,
    title,
    description,
    insightSummary,
    showInsight,
    insightTitle,
    dataLinkTitle,
    analysisCountry,
    dataGeoId,
    analysisLinkTitle
  },
  setAttributes
}) {
  const [charts, setCharts] = useState([]);
  const [countryCharts, setCountryCharts] = useState([]);
  const { loading, error, data: geoOptions } = useQuery(GET_GEOGRAPHIES);

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
        <PanelBody title={__('Flourish Chart Properties', 'hurumap-data')}>
          <PanelRow>
            <CheckboxControl
              label="Add Insight"
              help="Add insight summary to the chart"
              checked={showInsight}
              onChange={val => {
                setAttributes({ showInsight: val });
              }}
            />
          </PanelRow>
          {showInsight && (
            <Fragment>
              <TextControl
                label="Insight Title"
                value={insightTitle}
                onChange={val => {
                  setAttributes({ insightTitle: val });
                }}
              />
              <TextareaControl
                label="Insight Summary"
                value={insightSummary}
                onChange={val => {
                  setAttributes({ insightSummary: val });
                }}
              />
              <TextControl
                label="Analysis Link Title"
                value={analysisLinkTitle}
                onChange={val => {
                  setAttributes({ analysisLinkTitle: val });
                }}
              />
              <SelectControl
                label="Country Analysis Link"
                value={analysisCountry}
                options={[
                  ...[{ label: 'Select Country', value: '' }],
                  ...config.countries.map(country => ({
                    label: country.short_name,
                    value: country.slug
                  }))
                ]}
                onChange={val => {
                  setAttributes({ analysisCountry: val });
                }}
              />
              <TextControl
                label="Data Link Title"
                value={dataLinkTitle}
                onChange={val => {
                  setAttributes({ dataLinkTitle: val });
                }}
              />
              {!loading && !error && (
                <SelectControl
                  label="Data by Topic Link"
                  value={dataGeoId}
                  options={
                    geoOptions
                      ? geoOptions.geos.nodes.map(geo => ({
                          label: geo.name,
                          value: `${geo.geoLevel}-${geo.geoCode}`
                        }))
                      : []
                  }
                  onChange={val => {
                    setAttributes({ dataGeoId: val });
                  }}
                />
              )}
            </Fragment>
          )}
        </PanelBody>
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
              setAttributes({ country, analysisCountry: country });
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
          showInsight={showInsight}
          insightSummary={insightSummary}
          insightTitle={insightTitle}
          dataLinkTitle={dataLinkTitle}
          analysisCountry={analysisCountry}
          dataGeoId={dataGeoId}
          analysisLinkTitle={dataGeoId}
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
    description: propTypes.string,
    showInsight: propTypes.bool,
    insightSummary: propTypes.string,
    insightTitle: propTypes.string,
    analysisCountry: propTypes.string,
    analysisLinkTitle: propTypes.string,
    dataLinkTitle: propTypes.string,
    dataGeoId: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(Edit);
