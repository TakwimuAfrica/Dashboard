import React, { useState, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import Select from 'react-select';
import Chart from './Chart';
import propTypes from './propTypes';

import { GET_GEOGRAPHIES, tableGeoCountQuery } from './data/queries';
import { updateOrCreateHurumapChart } from './api';

function HurumapChartPreview({ chart }) {
  const [preview, setPreview] = useState(false);
  const client = useApolloClient();
  const [chartGeographies, setChartGeographies] = useState([]);
  const [selectedGeo, setSelectedGeo] = useState(null);

  const [description, setDescription] = useState(
    chart.description ? JSON.parse(chart.description) : {}
  );

  const [source, setSource] = useState(
    chart.source ? JSON.parse(chart.source) : {}
  );

  const { data: options } = useQuery(GET_GEOGRAPHIES);

  useEffect(() => {
    // filter geography that has this chart
    (async () => {
      if (options) {
        const geographies = await Promise.all(
          options.geos.nodes.map(async geo => {
            const { data } = await client.query({
              query: tableGeoCountQuery(chart.visual.table),
              variables: {
                geoCode: geo.geoCode,
                geoLevel: geo.geoLevel
              }
            });
            return { ...geo, totalCount: data[chart.visual.table].totalCount };
          })
        );

        setChartGeographies(
          geographies.filter(geography => geography.totalCount !== 0)
        );
      }
    })();
  }, [options, chart.visual.table, client]);

  const handleUpdateHurumapChart = changes => {
    const updatedChart = { id: chart.id, ...changes };
    updateOrCreateHurumapChart(updatedChart);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={4}>
          <Select
            placeholder="Select Geography for preview"
            value={selectedGeo}
            options={
              chartGeographies
                ? chartGeographies.map(geo => ({
                    label: geo.name,
                    value: `${geo.geoLevel}-${geo.geoCode}`
                  }))
                : []
            }
            onChange={option => {
              setSelectedGeo(option);
              if (!description[option.value]) {
                setDescription({
                  ...description,
                  [option.value]: ''
                });
              }
              if (!source[option.value]) {
                setSource({
                  ...source,
                  [option.value]: { title: '', href: '' }
                });
              }
            }}
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
        {preview && (
          <Chart
            preview={preview}
            geoId={selectedGeo && selectedGeo.value}
            chart={{
              ...chart,
              queryAlias: 'chartPreview',
              visual: { ...chart.visual, queryAlias: 'vizPreview' },
              stat: { ...chart.stat, queryAlias: 'vizPreview' },
              description,
              source: { ...source }
            }}
          />
        )}
      </Grid>
      <Grid item container xs={12} md={7} direction="column" spacing={2}>
        {preview && selectedGeo && selectedGeo.value && (
          <>
            <Grid item>
              <Typography>
                <b>Add Description and Source for {selectedGeo.label}</b>
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows="4"
                value={description[selectedGeo.value]}
                type="text"
                onChange={e => {
                  setDescription({
                    ...description,
                    [selectedGeo.value]: e.target.value
                  });
                }}
                onBlur={e => {
                  setDescription({
                    ...description,
                    [selectedGeo.value]: e.target.value
                  });
                  handleUpdateHurumapChart({
                    description: JSON.stringify(
                      Object.assign(description, {
                        [selectedGeo.value]: e.target.value
                      })
                    )
                  });
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Source Title"
                placeholder="Source Title for Geography"
                value={source[selectedGeo.value].title}
                type="text"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => {
                  setSource({
                    ...source,
                    [selectedGeo.value]: {
                      ...source[selectedGeo.value],
                      title: e.target.value
                    }
                  });
                }}
                onBlur={e => {
                  setSource({
                    ...source,
                    [selectedGeo.value]: {
                      ...source[selectedGeo.value],
                      title: e.target.value
                    }
                  });
                  handleUpdateHurumapChart({
                    source: JSON.stringify({
                      ...source,
                      [selectedGeo.value]: {
                        ...source[selectedGeo.value],
                        title: e.target.value
                      }
                    })
                  });
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Source Link"
                placeholder="Source Link for Geography"
                value={source[selectedGeo.value].href}
                type="text"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => {
                  setSource({
                    ...source,
                    [selectedGeo.value]: {
                      ...source[selectedGeo.value],
                      href: e.target.value
                    }
                  });
                }}
                onBlur={e => {
                  setSource({
                    ...source,
                    [selectedGeo.value]: {
                      ...source[selectedGeo.value],
                      href: e.target.value
                    }
                  });
                  handleUpdateHurumapChart({
                    source: JSON.stringify({
                      ...source,
                      [selectedGeo.value]: {
                        ...source[selectedGeo.value],
                        href: e.target.value
                      }
                    })
                  });
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Grid>
  );
}

HurumapChartPreview.propTypes = {
  chart: propTypes.shape({
    id: propTypes.string,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    subtitle: propTypes.string,
    section: propTypes.string,
    source: propTypes.string,
    description: propTypes.string,
    type: propTypes.string,
    visual: propTypes.string,
    stat: propTypes.string
  }).isRequired
};

export default HurumapChartPreview;
