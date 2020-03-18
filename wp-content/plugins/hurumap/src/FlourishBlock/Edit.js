import React from 'react';
import { __ } from '@wordpress/i18n';

import {
  Fragment,
  useState,
  useCallback,
  useMemo,
  useEffect
} from '@wordpress/element';

import {
  CheckboxControl,
  PanelBody,
  SelectControl,
  PanelRow,
  TextControl,
  TextareaControl
} from '@wordpress/components';

import { FlourishChart } from '@hurumap-ui/core';
import { InspectorControls, BlockControls } from '@wordpress/editor';

import Select from 'react-select';

import { Grid, InputLabel } from '@material-ui/core';
import { select } from '@wordpress/data';

import withRoot from '../withRoot';
import propTypes from '../propTypes';
import config from '../config';
import PostModal, { PostModalAction } from '../PostModal';
import useGeos from '../hooks/useGeos';
import getPostLanguage from '../utils/getPostLanguage';

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
  const { options: geoOptions } = useGeos();

  const loadCharts = useCallback(async language => {
    const res = await fetch(
      `/wp-json/hurumap-data/charts?sectioned=0&type=flourish&lang=${language}`
    );
    const c = await res.json();

    setCharts(c);

    return c;
  }, []);

  // Initial
  useEffect(() => {
    const language = getPostLanguage(select);
    loadCharts(language);
  }, [loadCharts]);

  const selectedChartAttributes = useCallback((chartId, c) => {
    const { title: chartTitle, description: chartDescription } = c.find(
      ({ id }) => `${id}` === chartId
    );
    return {
      chartId,
      title: chartTitle,
      description: chartDescription
    };
  }, []);

  const selectedCountyAttributes = useCallback(
    slug => ({
      country: slug,
      analysisCountry: slug,
      dataGeoId: `country-${
        config.countries.find(country => country.slug === slug).iso_code
      }`
    }),
    []
  );

  const reloadWithSelected = useCallback(
    async chartId => {
      const c = await loadCharts();
      if (chartId) {
        const chart = c.find(({ id }) => `${id}` === chartId);
        setAttributes({
          ...selectedChartAttributes(chartId, c),
          ...selectedCountyAttributes(chart.country)
        });
      }
    },
    [
      loadCharts,
      selectedChartAttributes,
      selectedCountyAttributes,
      setAttributes
    ]
  );

  const countryOptions = useMemo(
    () =>
      config.countries.map(country => ({
        value: country.slug,
        label: country.name
      })),
    []
  );

  const chartOptions = useMemo(
    () =>
      charts
        .filter(chart => chart.country === selectedCountry)
        .map(chart => ({
          label: chart.title,
          value: chart.id
        })),
    [charts, selectedCountry]
  );

  const getIframeKey = useCallback(() => {
    const chart = charts.find(({ id }) => `${id}` === selectedChart);
    if (!chart) {
      return undefined;
    }
    return chart.fileId + chart.name;
  }, [charts, selectedChart]);

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
          visualType="flourish"
          postId={selectedChart}
          onClose={(action, isPublished, postId) =>
            reloadWithSelected(
              action === PostModalAction.create && isPublished
                ? postId
                : undefined
            )
          }
        />
      </BlockControls>

      <Grid container direction="row" spacing={1}>
        <Grid item xs={4}>
          <InputLabel shrink>Country</InputLabel>
          <Select
            styles={{
              control: provided => ({
                ...provided,
                width: '100%'
              })
            }}
            value={countryOptions.find(
              ({ value }) => value === selectedCountry
            )}
            options={countryOptions}
            onChange={({ value: slug }) => {
              setAttributes(selectedCountyAttributes(slug));
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <InputLabel shrink>Flourish Chart</InputLabel>
          <Select
            styles={{
              control: provided => ({
                ...provided,
                width: '100%'
              })
            }}
            value={chartOptions.find(
              ({ value }) => `${value}` === selectedChart
            )}
            options={chartOptions}
            onChange={({ value: chartId }) => {
              setAttributes(selectedChartAttributes(chartId, charts));
            }}
          />
        </Grid>
      </Grid>
      {selectedChart && (
        <FlourishChart
          title={title}
          id={selectedChart}
          description={description}
          showInsight={showInsight}
          insightSummary={insightSummary}
          insightTitle={insightTitle}
          dataGeoId={dataGeoId}
          dataLinkTitle={dataLinkTitle}
          analysisLinkCountrySlug={analysisCountry}
          analysisLinkTitle={analysisLinkTitle}
          src={`${config.WP_BACKEND_URL}/wp-json/hurumap-data/flourish/${selectedChart}/`}
          iframeKey={getIframeKey()}
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
