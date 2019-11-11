import React, { useState, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

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

import { GET_GEOGRAPHIES, buildDataCountQuery } from './data/queries';

const useStyles = makeStyles({
  button: {
    backgroundColor: '#0073aa',
    color: 'white',
    marginBottom: 20
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

function HurumapChartDescription({ chart }) {
  const classes = useStyles();
  const client = useApolloClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState(
    chart.description ? chart.description : {}
  );
  const [chartGeographies, setChartGeographies] = useState([]);
  const [selectedGeo, setSelectedGeo] = useState({
    value: 'country-NG',
    label: 'Nigeria'
  });

  const { loading, error, data: options } = useQuery(GET_GEOGRAPHIES);
  const geoIdMap =
    !loading && !error && options
      ? options.geos.nodes.map(geo => {
          return {
            geoCode: geo.geoCode,
            geoLevel: geo.geoLevel,
            name: geo.name
          };
        })
      : [];

  useEffect(() => {
    // filter geography that has this chart
    const { table } = chart.visual;
    const geographies = geoIdMap.filter(async ({ geoCode, geoLevel }) => {
      const { data } = await client.query({
        query: buildDataCountQuery([chart]),
        variables: {
          geoCode,
          geoLevel
        }
      });
      console.log(table);
      console.log(data);

      return data[table].totalCount !== 0;
    });
    setChartGeographies(geographies);
  }, [chart, client, geoIdMap]);

  return (
    <>
      <Button className={classes.button} onClick={() => setDialogOpen(true)}>
        Add Description
      </Button>
      <Dialog
        fullWidth
        scroll="body"
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <DialogTitle className={classes.dialogTitle}>
          <Typography>
            Select Geography from the list and add description / source for each
            chart preview{' '}
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
                  onChange={val => setSelectedGeo(val)}
                />
              </Grid>
              {selectedGeo && (
                <Grid item>
                  <TextField
                    fullWidth
                    label="Description"
                    value={description[selectedGeo]}
                    type="text"
                    multiline
                    rows="4"
                    autoFocus
                    onBlur={e => {
                      description[selectedGeo] = e.target.value;
                      setDescription(description);
                    }}
                  />
                </Grid>
              )}
            </Grid>
            <Grid item md={7} />
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
    description: propTypes.string,
    section: propTypes.string,
    type: propTypes.string,
    visual: propTypes.string,
    stat: propTypes.string
  }).isRequired
};

export default HurumapChartDescription;
