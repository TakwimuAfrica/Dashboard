import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import {
  PanelBody,
  PanelRow,
  SelectControl,
  TextControl,
  TextareaControl,
  CheckboxControl
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

import { useQuery, useApolloClient } from '@apollo/react-hooks';
import { Grid } from '@material-ui/core';
import Chart from './Chart';

import withRoot from '../withRoot';
import { GET_GEOGRAPHIES, buildDataCountQuery } from '../data/queries';
import propTypes from '../propTypes';
import config from '../config';

function EditChart({
  clientId,
  attributes: {
    chartId: selectedChart,
    geoId: selectedGeo,
    chartWidth,
    insightSummary,
    showInsight,
    insightTitle,
    dataLinkTitle,
    analysisCountry,
    dataGeoId,
    analysisLinkTitle,
    showStatVisual
  },
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
        },
        description: JSON.parse(chart.description),
        source: JSON.parse(chart.source)
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
        <PanelBody title={__('Chart Properties', 'hurumap-data')}>
          <PanelRow>
            <CheckboxControl
              label="Add Insight"
              help="Add insight summary of the chart"
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
              <CheckboxControl
                label="Show Stat visual"
                help="Show number visual in the insight container"
                checked={showStatVisual}
                onChange={val => {
                  setAttributes({ showStatVisual: val });
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
              <SelectControl
                label="Data by Topic Link"
                value={dataGeoId}
                options={
                  options
                    ? options.geos.nodes.map(geo => ({
                        label: geo.name,
                        value: `${geo.geoLevel}-${geo.geoCode}`
                      }))
                    : []
                }
                onChange={val => {
                  setAttributes({ dataGeoId: val });
                }}
              />
            </Fragment>
          )}
        </PanelBody>
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
                setAttributes({ dataGeoId: geoId });
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

      <Chart
        geoId={selectedGeo}
        chartId={selectedChart}
        charts={allCharts}
        showInsight={showInsight}
        showStatVisual={showStatVisual}
        insightSummary={insightSummary}
        insightTitle={insightTitle}
        dataLinkTitle={dataLinkTitle}
        analysisCountry={analysisCountry}
        dataGeoId={dataGeoId}
        analysisLinkTitle={dataGeoId}
      />
    </Fragment>
  );
}

EditChart.propTypes = {
  clientId: propTypes.string.isRequired,
  attributes: propTypes.shape({
    chartWidth: propTypes.string,
    chartId: propTypes.chartId,
    geoId: propTypes.string,
    showInsight: propTypes.bool,
    showStatVisual: propTypes.bool,
    insightSummary: propTypes.string,
    insightTitle: propTypes.string,
    analysisCountry: propTypes.string,
    analysisLinkTitle: propTypes.string,
    dataLinkTitle: propTypes.string,
    dataGeoId: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(EditChart);
