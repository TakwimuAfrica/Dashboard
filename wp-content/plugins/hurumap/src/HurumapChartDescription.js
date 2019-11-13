import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';
import _ from 'lodash';

import makeStyles from '@material-ui/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Select from 'react-select';
import propTypes from './propTypes';

import Chart from './Chart';

import { GET_GEOGRAPHIES, tableGeoCountQuery } from './data/queries';

const useStyles = makeStyles({
  button: {
    backgroundColor: '#0073aa',
    color: 'white',
    marginBottom: 20
  },
  dialog: {
    height: '100%'
  },
  dialogTitle: {
    margin: 0,
    padding: '16px'
  },
  closeButton: {
    position: 'absolute',
    right: '8px',
    top: '8px'
  }
});

function HurumapChartDescription({ chart, onChange }) {
  const classes = useStyles();
  const client = useApolloClient();
  const [chartGeographies, setChartGeographies] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const description = useMemo(
    () => (chart.description ? JSON.parse(chart.description) : {}),
    [chart.description]
  );

  const source = useMemo(() => (chart.source ? JSON.parse(chart.source) : {}), [
    chart.source
  ]);
  const [selectedGeo, setSelectedGeo] = useState(
    chartGeographies.length > 0
      ? {
          value: `${chartGeographies[0].geoLevel}-${chartGeographies[0].geoCode}`,
          label: chartGeographies[0].name
        }
      : null
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

  return (
    <>
      <Button className={classes.button} onClick={() => setDialogOpen(true)}>
        Add Description
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        scroll="body"
        open={dialogOpen}
        classes={{ root: classes.dialog }}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle className={classes.dialogTitle}>
          <Typography>
            Select available geography and add description and/or sources for
            specific geo chart
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={() => setDialogOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container>
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
                    setSelectedGeo(val);
                  }}
                />
              </Grid>
              {selectedGeo && (
                <>
                  <Grid item>
                    <TextField
                      fullWidth
                      label="Description"
                      value={description[selectedGeo.value]}
                      type="text"
                      multiline
                      rows="4"
                      autoFocus
                      onBlur={e => {
                        const changes = {};
                        changes[selectedGeo.value] = e.target.value;
                        onChange({
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
                      value={
                        source[selectedGeo.value]
                          ? source[selectedGeo.value].title
                          : ''
                      }
                      type="text"
                      autoFocus
                      onBlur={e => {
                        const changes = {};
                        changes[selectedGeo.value] = {};
                        changes[selectedGeo.value].title = e.target.value;
                        onChange({
                          source: JSON.stringify(_.merge(source, changes))
                        });
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      fullWidth
                      label="Source Link"
                      value={
                        source[selectedGeo.value]
                          ? source[selectedGeo.value].link
                          : ''
                      }
                      rows="4"
                      autoFocus
                      onBlur={e => {
                        const changes = {};
                        changes[selectedGeo.value] = {};
                        changes[selectedGeo.value].href = e.target.value;
                        onChange({
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
        </DialogContent>
      </Dialog>
    </>
  );
}

HurumapChartDescription.propTypes = {
  chart: propTypes.shape({
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    subtitle: propTypes.string,
    source: propTypes.string,
    description: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.string,
    stat: propTypes.string
  }).isRequired,
  onChange: propTypes.func.isRequired
};

export default HurumapChartDescription;
