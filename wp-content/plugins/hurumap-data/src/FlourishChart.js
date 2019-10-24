import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, TextField, Typography, Paper } from '@material-ui/core';
import FileUploadIcon from '@material-ui/icons/CloudUpload';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { saveFlourishChartInMedia } from './api';

import propTypes from './propTypes';

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

  const publish = () => {
    onChange({ published: 0 });
  };

  const onDrop = useCallback(
    acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const reader = new FileReader();
        reader.readAsDataURL(acceptedFiles[0]);

        reader.onload = async e => {
          const result = await saveFlourishChartInMedia({
            file: e.target.result.replace('data:application/zip;base64,', ''),
            name: acceptedFiles[0].name,
            type: acceptedFiles[0].type
          });

          const { id: fileId } = await result.json();
          onChange({
            media: fileId,
            file: e.target.result.replace('data:application/zip;base64,', '')
          });
        };
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
            id="subtitle-input"
            label="Subtitle"
            value={chart.subtitle}
            className={classes.textField}
            type="text"
            name="subtitle"
            margin="normal"
            variant="outlined"
            fullWidth
            onChange={e => {
              onChange({ subtitle: e.target.value });
            }}
          />
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
          <TextField
            id="source-title-input"
            label="Source Title"
            className={classes.textField}
            type="text"
            name="source-title"
            margin="normal"
            variant="outlined"
            value={chart.source_title}
            halfWidth
            onChange={e => {
              onChange({ source_title: e.target.value });
            }}
          />
          <TextField
            id="source-link-input"
            label="Source Link"
            className={classes.textField}
            type="text"
            name="source-link"
            margin="normal"
            variant="outlined"
            value={chart.source_link}
            halfWidth
            onChange={e => {
              onChange({ source_link: e.target.value });
            }}
          />
          <Grid>
            <Button
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
            <Button onClick={() => publish()}>Preview</Button>
          </Grid>
        </Grid>
        <Grid item md={7} />
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
    subtitle: propTypes.string,
    description: propTypes.string,
    file: propTypes.number,
    source_link: propTypes.string,
    source_title: propTypes.string
  }).isRequired
};

export default FlourishChart;
