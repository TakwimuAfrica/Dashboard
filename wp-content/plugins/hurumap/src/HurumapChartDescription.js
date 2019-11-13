import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import _ from 'lodash';

import makeStyles from '@material-ui/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import propTypes from './propTypes';

import Chart from './Chart';

import { GET_GEOGRAPHIES, tableGeoCountQuery } from './data/queries';
import { updateOrCreateHurumapChart } from './api';

const useStyles = makeStyles({
  button: {
    backgroundColor: '#0073aa',
    color: 'white',
    marginBottom: 20
  },
  dialog: {
    height: '100%',
    overflowY: 'unset'
  },
  dialogContent: {
    height: '100%'
  },
  dialogTitle: {
    margin: 0,
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItem: 'center'
  }
});

function HurumapChartDescription({ chart }) {
  const classes = useStyles();
  const client = useApolloClient();
  const [chartGeographies, setChartGeographies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGeo, setSelectedGeo] = useState(null);

  const description = useMemo(
    () => (chart.description ? JSON.parse(chart.description) : {}),
    [chart.description]
  );

  const source = useMemo(() => (JSON.parse(chart.source) ? chart.source : {}), [
    chart.source
  ]);

  const [geoIdDescription, setGeoIdDescription] = useState(
    selectedGeo ? description[selectedGeo.value] : ''
  );
  const [geoLevelSource, setGeoLevelSource] = useState(
    selectedGeo && source[selectedGeo.value.split('-')[0]]
      ? source[selectedGeo.value.split('-')[0]]
      : { title: '', href: '' }
  );

  const { data: options } = useQuery(GET_GEOGRAPHIES);

  const handleUpdateHurumapChart = changes => {
    const updatedChart = { id: chart.id, ...changes };
    updateOrCreateHurumapChart(updatedChart);
  };

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

  return (
    <>
      <Button className={classes.button} onClick={() => setDialogOpen(true)}>
        Add Description
      </Button>
      <Dialog
        maxWidth="lg"
        scroll="body"
        open={dialogOpen}
        classes={{ paper: classes.dialog }}
        onClose={() => setDialogOpen(false)}
      >
        <DialogContent classes={{ root: classes.dialogContent }}>
          <Grid container>
            <Grid
              container
              item
              md={12}
              alignItems="center"
              justify="space-between"
            >
              <Grid item>
                <Typography>Select Geography</Typography>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="close"
                  onClick={() => setDialogOpen(false)}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Grid container item md={12}>
              <Grid container item md={5} direction="column">
                <Grid item>
                  <Select
                    placeholder="Select Geography"
                    value={selectedGeo}
                    options={
                      chartGeographies
                        ? chartGeographies.map(geo => ({
                            label: geo.name,
                            value: `${geo.geoLevel}-${geo.geoCode}`
                          }))
                        : []
                    }
                    onChange={val => {
                      console.log(val);
                      setSelectedGeo(val);
                      if (!description[selectedGeo.value]) {
                        description[selectedGeo.value] = '';
                        setGeoIdDescription('');
                      }
                      if (!source[selectedGeo.value.split('-')[0]]) {
                        source[selectedGeo.value.split('-')[0]] = {
                          title: '',
                          link: ''
                        };
                        setGeoLevelSource({ title: '', href: '' });
                      }
                    }}
                  />
                </Grid>
                {selectedGeo && (
                  <>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Description"
                        value={geoIdDescription}
                        type="text"
                        multiline
                        rows="4"
                        onChange={e => setGeoIdDescription(e.target.value)}
                        onBlur={e => {
                          setGeoIdDescription(e.target.value);
                          const changes = {};
                          changes[selectedGeo.value] = geoIdDescription;
                          handleUpdateHurumapChart({
                            description: JSON.stringify(
                              Object.assign(description, changes)
                            )
                          });
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Source Title"
                        placeholder="Source Title for Geography Level"
                        value={geoLevelSource.title}
                        type="text"
                        onChange={e =>
                          setGeoLevelSource({
                            ...geoLevelSource,
                            title: e.target.value
                          })
                        }
                        onBlur={e => {
                          setGeoLevelSource({
                            ...geoLevelSource,
                            title: e.target.value
                          });
                          const changes = {};
                          changes[selectedGeo.value.split('-')[0]] = {};
                          changes[selectedGeo.value.split('-')[0]].title =
                            geoLevelSource.title;
                          handleUpdateHurumapChart({
                            source: JSON.stringify(_.merge(source, changes))
                          });
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Source Link"
                        placeholder="Source Link for Geography Level"
                        value={geoLevelSource.href}
                        type="text"
                        onChange={e =>
                          setGeoLevelSource({
                            ...geoLevelSource,
                            href: e.target.value
                          })
                        }
                        onBlur={e => {
                          setGeoLevelSource({
                            ...geoLevelSource,
                            href: e.target.value
                          });
                          const changes = {};
                          changes[selectedGeo.value.split('-')[0]] = {};
                          changes[selectedGeo.value.split('-')[0]].href =
                            geoLevelSource.href;
                          handleUpdateHurumapChart({
                            source: JSON.stringify(_.merge(source, changes))
                          });
                        }}
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid item md={7}>
                {selectedGeo && (
                  <Chart
                    preview
                    geoId={selectedGeo.value}
                    chart={{
                      ...chart,
                      queryAlias: 'chartPreview',
                      visual: { ...chart.visual, queryAlias: 'vizPreview' },
                      stat: { ...chart.stat, queryAlias: 'vizPreview' }
                    }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
}

HurumapChartDescription.propTypes = {
  chart: propTypes.shape({
    id: propTypes.string,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    subtitle: propTypes.string,
    source: propTypes.string,
    description: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.string,
    stat: propTypes.string
  }).isRequired
};

export default HurumapChartDescription;
