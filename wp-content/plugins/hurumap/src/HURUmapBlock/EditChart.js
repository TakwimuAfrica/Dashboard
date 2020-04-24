import React from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState, useCallback } from '@wordpress/element';
import {
  PanelBody,
  PanelRow,
  SelectControl,
  TextControl,
  TextareaControl,
  CheckboxControl
} from '@wordpress/components';

import { BlockControls } from '@wordpress/block-editor';
import { InspectorControls } from '@wordpress/editor';

import Select from 'react-select';

import { useApolloClient } from '@apollo/react-hooks';
import { Grid, InputLabel } from '@material-ui/core';

import { HURUmapChart } from '@hurumap-ui/core';

import { select } from '@wordpress/data';
import useGeos from '../hooks/useGeos';
import getPostLanguage from '../utils/getPostLanguage';

import { buildDataCountQueryWithGeos } from '../data/queries';

import useFilteredCharts from '../hooks/useFilteredCharts';

import PostModal, { PostModalAction } from '../PostModal';

import withRoot from '../withRoot';
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

  const { options: geoOptions, geos } = useGeos();

  const [allCharts, setAllCharts] = useState([]);
  const chartOptions = useFilteredCharts(selectedGeo, allCharts);

  const loadCharts = useCallback(async language => {
    const res = await fetch(
      `/wp-json/hurumap-data/charts?sectioned=0&type=hurumap&lang=${language}`
    );

    const charts = await res.json();

    setAllCharts(charts);

    return charts;
  }, []);

  // Initial
  useEffect(() => {
    const language = getPostLanguage(select);
    loadCharts(language);
  }, [loadCharts]);

  const setSelected = useCallback(
    async ({ geoId, ...attributes }) => {
      let charts = allCharts;
      if (!charts.length) {
        charts = await loadCharts();
      }

      if (geoId && geoId !== selectedGeo) {
        setAttributes({ geoId, ...attributes });
      }
    },
    [allCharts, selectedGeo, loadCharts, setAttributes]
  );

  const reloadWithSelected = useCallback(
    async chartId => {
      const charts = await loadCharts();

      if (chartId) {
        const chart = charts.find(({ id }) => `${id}` === `${chartId}`);

        const { data } = await client.query({
          query: buildDataCountQueryWithGeos(geos, chart.visual.table)
        });

        const availableGeos = geos.filter(
          geo => data[geo.geoCode].totalCount !== 0
        );

        if (
          !availableGeos.length ||
          (selectedGeo &&
            availableGeos.find(
              ({ geoLevel, geoCode }) =>
                `${geoLevel}-${geoCode}` === selectedGeo
            ))
        ) {
          setAttributes({
            chartId
          });
          return;
        }

        const defaultGeo = availableGeos[0];
        const geoId = `${defaultGeo.geoLevel}-${defaultGeo.geoCode}`;

        setSelected({ geoId, chartId, dataGeoId: geoId });
      }
    },
    [loadCharts, client, geos, selectedGeo, setSelected, setAttributes]
  );

  const blockDiv = document.querySelector(`div[data-block="${clientId}"]`);
  if (blockDiv) {
    blockDiv.style.width = chartWidth;
  }

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Chart Properties', 'hurumap-data')}>
          <PanelRow>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <InputLabel shrink>Country</InputLabel>
                <Select
                  value={
                    selectedGeo &&
                    geoOptions.find(
                      ({ value }) => `${value}` === `${selectedGeo}`
                    )
                  }
                  options={geoOptions}
                  onChange={({ value: geoId }) => setSelected({ geoId })}
                />
              </Grid>
              {selectedGeo && (
                <Grid item>
                  <InputLabel shrink>HURUmap Chart</InputLabel>
                  <Select
                    placeholder="Select HURUmap Chart"
                    value={
                      selectedChart &&
                      chartOptions.find(
                        ({ value }) => `${value}` === `${selectedChart}`
                      )
                    }
                    options={chartOptions}
                    onChange={({ value: chartId }) => {
                      setAttributes({ chartId });
                    }}
                  />
                </Grid>
              )}
              <Grid item>
                <InputLabel shrink>Width</InputLabel>
                <TextControl
                  label=""
                  value={chartWidth}
                  onChange={width => {
                    setAttributes({ chartWidth: width });
                  }}
                />
              </Grid>
            </Grid>
          </PanelRow>
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
                options={geoOptions}
                onChange={val => {
                  setAttributes({ dataGeoId: val });
                }}
              />
            </Fragment>
          )}
        </PanelBody>
      </InspectorControls>

      <BlockControls>
        <PostModal
          visualType="hurumap"
          postId={selectedChart}
          onClose={(action, isPublished, chartId) => {
            reloadWithSelected(
              action === PostModalAction.create && isPublished
                ? chartId
                : undefined
            );
          }}
        />
      </BlockControls>

      <HURUmapChart
        key={selectedChart}
        chartId={`${selectedChart}`}
        geoId={selectedGeo}
        showInsight={showInsight}
        showStatVisual={showStatVisual}
        insightSummary={insightSummary}
        insightTitle={insightTitle}
        dataGeoId={dataGeoId}
        dataLinkTitle={dataLinkTitle}
        analysisLinkTitle={analysisLinkTitle}
        analysisLinkCountrySlug={analysisCountry}
        chart={allCharts.find(({ id }) => `${id}` === `${selectedChart}`)}
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
