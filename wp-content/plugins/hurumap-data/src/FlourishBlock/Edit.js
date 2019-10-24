import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

import { Grid } from '@material-ui/core';

import withRoot from '../withRoot';
import propTypes from '../propTypes';
import Chart from './Chart';

function Edit({
  clientId,
  attributes: { chartId: selectedChart, title },
  setAttributes
}) {
  const [allCharts, setAllCharts] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetch('/wp-json/hurumap-data/charts?published=1');
      const { flourish: charts } = await res.json();

      setAllCharts(charts);
    })();
  }, [clientId]);

  const options = allCharts.map(chart => ({
    label: chart.title,
    value: chart.id
  }));

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Flourish Chart Selection', 'hurumap-data')} />
      </InspectorControls>

      <Grid container direction="row" wrap="nowrap" spacing={1}>
        <Grid item>
          <SelectControl
            label={__('Flourish Chart', 'hurumap-ui')}
            value={
              allCharts.find(
                chart => chart.id === selectedChart && chart.title === title
              )
                ? selectedChart
                : ''
            }
            options={options.length > 0 ? options : []}
            onChange={chartId => {
              setAttributes({ chartId });
            }}
          />
        </Grid>
      </Grid>

      <Chart attributes={{ chartId: selectedChart, title }} />
    </Fragment>
  );
}

Edit.propTypes = {
  clientId: propTypes.string.isRequired,
  attributes: propTypes.shape({
    chartId: propTypes.string,
    title: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(Edit);
