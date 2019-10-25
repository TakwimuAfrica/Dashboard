import React, { useCallback, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  MenuItem
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
  textField: {},
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
  }
}));

function FlourishChart({ chart, onChange }) {
  const classes = useStyles();
  const [preview, setPreview] = useState(false);

  const onDrop = useCallback(
    async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const data = new FormData();
        data.append('file', acceptedFiles[0], acceptedFiles[0].name);
        const result = await saveFlourishChartInMedia(data);
        const { id: fileId } = await result.json();
        onChange({
          media: fileId
        });
      }
    },
    [onChange]
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
      <Grid container className={classes.root}>
        <Grid item md={5}>
          <TextField
            id="title-input"
            label="Title"
            className={classes.textField}
            type="text"
            name="title"
            value={chart.title}
            margin="normal"
            variant="outlined"
            fullWidth
            onChange={e => {
              onChange({ title: e.target.value });
            }}
          />
          <TextField
            id="country-input"
            label="country"
            select
            value={chart.country}
            className={classes.textField}
            type="text"
            name="country"
            margin="normal"
            variant="outlined"
            fullWidth
            onChange={e => {
              onChange({ country: e.target.value });
            }}
          >
            {config.countries.map(country => (
              <MenuItem key={country.slug} value={country.slug}>
                {' '}
                {country.name}
              </MenuItem>
            ))}
          </TextField>
          <div className={classes.uploadDiv}>
            <div {...getRootProps()} className={classes.dropContainer}>
              <input {...getInputProps()} />
              {!isDragActive && acceptedFiles.length === 0 && (
                <Typography>Drag a file or click to upload!</Typography>
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
          </div>
          <TextField
            id="description-input"
            label="Description"
            className={classes.textField}
            type="text"
            multiline
            rows="5"
            name="description"
            margin="normal"
            variant="outlined"
            value={chart.description}
            fullWidth
            onChange={e => {
              onChange({ description: e.target.value });
            }}
          />
          <Grid container item justify="space-between">
            <Button
              item
              disabled={chart.published === '1' || chart.published === true}
              className={classNames(classes.button, {
                [classes.disabledButton]:
                  chart.published === '1' || chart.published === true
              })}
              onClick={() => {
                onChange({ published: true });
              }}
            >
              {' '}
              Publish
            </Button>
            <Button
              item
              className={classes.button}
              onClick={() => setPreview(true)}
            >
              Preview
            </Button>
            <Button item className={classes.button}>
              Delete
            </Button>
          </Grid>
        </Grid>
        <Grid item md={7}>
          {preview && (chart.published === '1' || chart.published === true) && (
            <Chart attributes={{ chartId: chart.id, title: chart.title }} />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

FlourishChart.propTypes = {
  onChange: propTypes.func.isRequired,
  chart: propTypes.shape({
    id: propTypes.string,
    published: propTypes.oneOfType([propTypes.string, propTypes.bool]),
    title: propTypes.string,
    country: propTypes.string,
    description: propTypes.string,
    file: propTypes.number,
    source_link: propTypes.string,
    source_title: propTypes.string
  }).isRequired
};

export default FlourishChart;
