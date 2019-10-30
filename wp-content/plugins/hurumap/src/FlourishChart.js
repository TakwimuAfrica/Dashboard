import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Paper
} from '@material-ui/core';
import FileUploadIcon from '@material-ui/icons/CloudUpload';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { saveFlourishChartInMedia } from './api';

import propTypes from './propTypes';
import Chart from './FlourishBlock/Chart';
import config from './config';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: '20px'
  },
  button: {
    backgroundColor: '#0073aa',
    color: 'white',
    marginBottom: 20
  },
  input: {
    display: 'none'
  },
  textField: {
    display: 'flex'
  },
  disabledButton: {
    backgroundColor: 'inherit',
    color: 'black'
  },
  uploadDiv: {
    display: 'flex',
    backgroundColor: '#e0e0e0',
    padding: '6px 16px',
    height: '80px',
    minWidth: '60px',
    borderRadius: '4px',
    boxShadow: theme.shadows[2]
  },
  successFile: {
    color: '#155724'
  },
  rejectedFile: {
    color: '#721c24'
  },
  dropContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  },
  dropActive: {
    color: '#004085'
  },
  buttonGrid: {
    marginTop: theme.spacing(2)
  }
}));

function FlourishChart({ chart, onChange, onDelete }) {
  const classes = useStyles();
  const [reloadIframe, setReloadIframe] = useState(0);
  const [timeoutId, setTimeoutId] = React.useState(null);

  const onDrop = useCallback(
    async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const data = new FormData();
        data.append('file', acceptedFiles[0], acceptedFiles[0].name);
        const result = await saveFlourishChartInMedia(data);
        const { id: fileId, name } = await result.json();
        onChange({
          name,
          media_id: fileId,
          published: false
        });
        // reload iframe; but give it some time
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        setTimeoutId(
          setTimeout(() => {
            setReloadIframe(reloadIframe + 1);
          }, 4000)
        );
      }
    },
    [onChange, reloadIframe, timeoutId]
  );

  const {
    isDragActive,
    getRootProps,
    getInputProps,
    isDragReject,
    acceptedFiles
  } = useDropzone({
    onDrop,
    accept: 'application/zip',
    minSize: 0,
    multiple: false
  });

  return (
    <Paper>
      <Grid container className={classes.root} spacing={2}>
        <Grid item container md={4} direction="column">
          <Grid item className={classes.textField}>
            <TextField
              id="title-input"
              label="Title"
              type="text"
              name="title"
              value={chart.title}
              margin="normal"
              variant="outlined"
              fullWidth
              onChange={e => {
                onChange({ title: e.target.value, published: false });
              }}
            />
          </Grid>
          <Grid item className={classes.textField}>
            <TextField
              id="country-input"
              label="country"
              select
              value={chart.country}
              type="text"
              name="country"
              margin="normal"
              variant="outlined"
              fullWidth
              onChange={e => {
                onChange({ country: e.target.value, published: false });
              }}
            >
              {config.countries.map(country => (
                <MenuItem key={country.slug} value={country.slug}>
                  {' '}
                  {country.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item className={classes.uploadDiv}>
            <div {...getRootProps()} className={classes.dropContainer}>
              <input {...getInputProps()} />
              {!isDragActive && acceptedFiles.length === 0 && (
                <Typography>
                  {chart.name ? chart.name : 'Drag a file or click to upload!'}
                </Typography>
              )}
              {isDragActive && !isDragReject && (
                <>
                  <FileUploadIcon />
                  <Typography> Drop file to upload!</Typography>
                </>
              )}
              {isDragReject && (
                <Typography className={classes.rejectedFile}>
                  File type not accepted, sorry!
                </Typography>
              )}
              {acceptedFiles.length > 0 && (
                <Typography className={classes.successFile}>
                  {acceptedFiles[0].name}
                </Typography>
              )}
            </div>
          </Grid>
          <Grid
            container
            item
            spacing={4}
            alignItems="flex-end"
            justify="flex-end"
            className={classes.buttonGrid}
          >
            <Grid item>
              <Button
                item
                disabled={chart.published === '1' || chart.published === true}
                className={classNames(classes.button, {
                  [classes.disabledButton]:
                    chart.published === '1' || chart.published === true
                })}
                onClick={() => {
                  onChange({ published: true });
                  setReloadIframe(reloadIframe + 1);
                }}
              >
                {' '}
                Publish
              </Button>
            </Grid>
            <Grid item>
              <Button
                item
                className={classes.button}
                onClick={() => onDelete()}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={8}>
          {chart.media_id && (
            <Chart
              chartId={chart.id}
              title={chart.title}
              iframeKey={reloadIframe}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

FlourishChart.propTypes = {
  onChange: propTypes.func.isRequired,
  onDelete: propTypes.func.isRequired,
  chart: propTypes.shape({
    id: propTypes.string,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    country: propTypes.string,
    name: propTypes.string,
    media_id: propTypes.oneOfType([propTypes.string, propTypes.number])
  }).isRequired
};

export default FlourishChart;
