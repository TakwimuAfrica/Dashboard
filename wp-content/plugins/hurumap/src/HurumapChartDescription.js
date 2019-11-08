import React, { useState, useEffect } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import makeStyles from '@material-ui/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select';
import propTypes from './propTypes';

import { GET_GEOGRAPHIES, buildDataCountQuery } from './data/queries';

const useStyles = makeStyles({
  button: {
    backgroundColor: '#0073aa',
    color: 'white',
    marginBottom: 20
  }
});

function HurumapChartDescription({ chart }) {
  const classes = useStyles();
  const client = useApolloClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState(false);
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
    const geographies = geoIdMap.filter(async variable => {
      const { data } = await client.query({
        query: buildDataCountQuery([chart]),
        variables: variable
      });

      return data[table].totalCount !== 0;
    });
    setChartGeographies(geographies);
  }, [chart, client, geoIdMap]);

  return (
    <Grid container>
      <Grid item alignItems="flex-end">
        <Button className={classes.button} onClick={() => setDialogOpen(true)}>
          Add Description
        </Button>
        <Dialog
          fullWidth
          maxWidth="lg"
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        >
          <DialogTitle>
            Select Geography from the list and add description / source for each
            chart preview{' '}
          </DialogTitle>
          <Grid container>
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
            <Grid item>
              <TextField
                fullWidth
                label="Description"
                value={description}
                type="text"
                multiline
                rows="4"
                onChange={e => setDescription(e.target.value)}
              />
            </Grid>
          </Grid>
        </Dialog>
      </Grid>
    </Grid>
  );
}

HurumapChartDescription.propTypes = {
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

export default HurumapChartDescription;
