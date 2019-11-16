import React, { useState, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

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
    <>
      <Button className={classes.button} onClick={() => setDialogOpen(true)}>
        Add Description
      </Button>
      <Dialog
        fullWidth
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
                <Typography>
                  Add chart description and source for each available geography.
                </Typography>
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
                    onChange={option => {
                      setSelectedGeo(option);
                      if (!description[option.value]) {
                        setDescription({ ...description, [option.value]: '' });
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
                {selectedGeo && selectedGeo.value && (
                  <>
                    <Grid item>
                      <TextField
                        fullWidth
                        label="Description"
                        value={description[selectedGeo.value]}
                        type="text"
                        multiline
                        rows="4"
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
