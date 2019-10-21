import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, TextField, Typography } from '@material-ui/core';
import FileUploadIcon from '@material-ui/icons/CloudUpload';

import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: 'none'
  },
  textField: {},
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

function FlourishChart() {
  const classes = useStyles();

  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
  }, []);

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
    <Grid container className={classes.root}>
      <Grid item md={6}>
        <TextField
          id="title-input"
          label="Title"
          className={classes.textField}
          type="text"
          name="title"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          id="subtitle-input"
          label="Subtitle"
          className={classes.textField}
          type="text"
          name="subtitle"
          margin="normal"
          variant="outlined"
          fullWidth
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
                <Typography>Drop file to upload!</Typography>
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
          fullWidth
        />
        <TextField
          id="source-title-input"
          label="Source Title"
          className={classes.textField}
          type="text"
          name="source-title"
          margin="normal"
          variant="outlined"
          fullWidth
        />
        <TextField
          id="source-link-input"
          label="Source Link"
          className={classes.textField}
          type="text"
          name="source-link"
          margin="normal"
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid item md={6} />
    </Grid>
  );
}

export default FlourishChart;
