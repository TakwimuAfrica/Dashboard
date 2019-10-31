import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import { useQuery } from '@apollo/react-hooks';
import Select from 'react-select';
import Chart from './Chart';
import { GET_GEOGRAPHIES } from './data/queries';
import propTypes from './propTypes';

function HurumapChartPreview({ chart }) {
  const [preview, setPreview] = useState(false);
  const [selected, setSelected] = useState({
    value: 'country-NG',
    label: 'Nigeria'
  });
  const { data: options } = useQuery(GET_GEOGRAPHIES);
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={4}>
          <Select
            placeholder="Select country to preview"
            value={selected}
            options={
              options
                ? options.geos.nodes.map(geo => ({
                    label: geo.name,
                    value: `${geo.geoLevel}-${geo.geoCode}`
                  }))
                : []
            }
            onChange={setSelected}
          />
        </Grid>
        <Grid item>
          <Grid
            component="label"
            item
            container
            alignItems="center"
            spacing={1}
          >
            <Grid item>Disable Preview</Grid>
            <Grid item>
              <Switch
                defaultChecked={false}
                checked={preview}
                onChange={() => {
                  setPreview(!preview);
                }}
              />
            </Grid>
            <Grid item>Enable Preview</Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Chart
          preview={preview}
          geoId={selected && selected.value}
          chart={{
            ...chart,
            queryAlias: 'chartPreview',
            visual: { ...chart.visual, queryAlias: 'vizPreview' },
            stat: { ...chart.stat, queryAlias: 'vizPreview' }
          }}
        />
      </Grid>
    </Grid>
  );
}

HurumapChartPreview.propTypes = {
  chart: propTypes.shape({
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    subtitle: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.string,
    stat: propTypes.string
  }).isRequired
};

export default HurumapChartPreview;
