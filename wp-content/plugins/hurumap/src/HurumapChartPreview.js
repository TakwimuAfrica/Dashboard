import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import Chart from './Chart';
import propTypes from './propTypes';

import { GET_GEOGRAPHIES, buildDataCountQueryWithGeos } from './data/queries';
import { updateOrCreateHurumapChart } from './api';

function HurumapChartPreview({ chart }) {
  const preview = useMemo(
    () => !!chart.visual.table && !!chart.visual.x && !!chart.visual.y,
    [chart]
  );
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
      if (chart.visual.table && options && options.geos && options.geos.nodes) {
        const { data } = await client.query({
          query: buildDataCountQueryWithGeos(
            options.geos.nodes,
            chart.visual.table
          )
        });
        const geographies = options.geos.nodes.filter(
          geo => data[geo.geoCode].totalCount !== 0
        );
        setChartGeographies(geographies);
        setSelectedGeo(prev =>
          prev && geographies.find(x => x.geoCode === prev.geoCode)
            ? selectedGeo
            : geographies.length && {
                label: geographies[0].name,
                value: `${geographies[0].geoLevel}-${geographies[0].geoCode}`
              }
        );
      }
    })();
  }, [chart.visual.table, preview, client, options, selectedGeo]);

  const handleUpdateHurumapChart = changes => {
    const updatedChart = { id: chart.id, ...changes };
    updateOrCreateHurumapChart(updatedChart);
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container xs={12} direction="row" justify="space-evenly">
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
      </Grid>
      <Grid item xs={12}>
        {preview && selectedGeo && (
          <Chart
            preview={preview}
            geoId={selectedGeo.value}
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
                value={
                  source[selectedGeo.value] && source[selectedGeo.value].title
                }
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
                value={
                  source[selectedGeo.value] && source[selectedGeo.value].href
                }
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
