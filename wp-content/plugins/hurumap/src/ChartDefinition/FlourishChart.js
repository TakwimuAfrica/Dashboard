import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import Select from 'react-select';
import FileUploadIcon from '@material-ui/icons/CloudUpload';
import { useDropzone } from 'react-dropzone';
import { saveFlourishChartInMedia } from '../api';

import propTypes from '../propTypes';
import Chart from '../FlourishBlock/Chart';
import config from '../config';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    padding: '20px'
  },
  deleteButton: {
    color: 'white',
    backgroundColor: 'rgb(191, 42, 60)'
  },
  uploadDiv: {
    display: 'flex',
    backgroundColor: 'transparent',
    border: '4px dashed grey',
    padding: '6px 16px',
    height: '80px',
    minWidth: '60px',
    borderRadius: '4px'
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
  iframe: {
    width: '100%'
  }
});

function FlourishChart({ chart, sectionOptions, onChange }) {
  const classes = useStyles();
  const [reloadIframe, setReloadIframe] = useState(0);

  const onDrop = useCallback(
    async acceptedFiles => {
      if (acceptedFiles.length > 0) {
        const data = new FormData();
        data.append('file', acceptedFiles[0], acceptedFiles[0].name);
        const result = await saveFlourishChartInMedia(data);
        const { id: fileId, name } = await result.json();
        onChange({
          name,
          fileId
        });
        setReloadIframe(reloadIframe + 1);
      }
    },
    [onChange, reloadIframe]
  );

  const {
    isDragActive,
    getRootProps,
    getInputProps,
    isDragReject,
    acceptedFiles
  } = useDropzone({
    onDrop,
    accept: "application/zip, application/x-7z-compressed",
    minSize: 0,
    multiple: false
  });

  return (
    <Paper style={{ padding: 10 }}>
      <Grid container className={classes.root} spacing={2}>
        <Grid item md={4}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextField
                fullWidth
                label="Title"
                type="text"
                name="post_title"
                value={chart.title}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => onChange({ title: e.target.value })}
              />
            </Grid>
            <Grid item>
              <InputLabel shrink>Country</InputLabel>
              <Select
                placeholder="Country"
                value={
                  chart.country && {
                    value: chart.country,
                    label: config.countries.find(
                      ({ slug }) => slug === chart.country
                    ).name
                  }
                }
                options={config.countries.map(country => ({
                  label: country.name,
                  value: country.slug
                }))}
                onChange={({ value: country }) => {
                  onChange({ country });
                }}
              />
            </Grid>
            <Grid item>
              <InputLabel shrink>Section</InputLabel>
              <Select
                placeholder="Select section"
                // eslint-disable-next-line eqeqeq
                value={sectionOptions.find(o => o.value == chart.section)}
                options={sectionOptions}
                onChange={({ value: section }) => {
                  onChange({ section });
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                fullWidth
                label="Description"
                type="text"
                multiline
                rows="3"
                value={chart.description}
                InputLabelProps={{
                  shrink: true
                }}
                onChange={e => onChange({ description: e.target.value })}
              />
            </Grid>
            <Grid item>
              <div className={classes.uploadDiv}>
                <div {...getRootProps()} className={classes.dropContainer}>
                  <input {...getInputProps()} />
                  {!isDragActive && acceptedFiles.length === 0 && (
                    <Typography>
                      {chart.name
                        ? chart.name
                        : 'Drag a file or click to upload!'}
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
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={8}>
          {chart.fileId && chart.fileId !== 0 && (
            <Chart
              chartId={chart.fileId}
              title={chart.title}
              iframeKey={reloadIframe}
              description={chart.description}
              classes={{ iframe: classes.iframe }}
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
    section: propTypes.string,
    title: propTypes.string,
    country: propTypes.string,
    name: propTypes.string,
    description: propTypes.string,
    fileId: propTypes.oneOfType([propTypes.string, propTypes.number])
  }).isRequired,
  sectionOptions: propTypes.arrayOf(propTypes.shape({})).isRequired
};

export default FlourishChart;
