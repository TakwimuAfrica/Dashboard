import React from 'react';
import ReactDOM from 'react-dom';

import { Router } from '@reach/router';

import shortid from 'shortid';

import { MuiThemeProvider } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core/styles';

import { Card, HURUmap, Flourish } from './components';

import Theme from '../Theme';
import config from '../config';

window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const parentEl = document.getElementById('root');

  if (typeof document !== 'undefined') {
    // Same-Origin Policy
    document.domain = new URL(config.WP_BACKEND_URL).hostname;
  }

  ReactDOM.render(
    <StylesProvider
      generateClassName={(rule, sheet) =>
        `hurumapUIBlockJSS-${
          process.env.NODE_ENV === 'development'
            ? `${sheet.options.meta}-${rule.key}-${shortid.generate()}`
            : shortid.generate()
        }`
      }
    >
      <MuiThemeProvider theme={window.Theme || Theme}>
        <Router>
          <Card
            path="embed/card/:postType/:postId"
            parentEl={parentEl}
            postId={params.get('post-id')}
            postType={params.get('post-type')}
          />
          <Flourish
            path="embed/flourish/:chartId"
            parentEl={parentEl}
            chartId={params.get('chart-id')}
            title={params.get('chart-title')}
            description={params.get('chart-description')}
            showInsight={params.get('show-insight') === 'true'}
            insightTitle={params.get('insight-title')}
            insightSummary={params.get('insight-summary')}
            dataLintTitle={params.get('data-link-title')}
            analysisCountry={params.get('analysis-country')}
            analysisLinkTitle={params.get('analysis-link-title')}
            dataGeoId={params.get('data-geoid')}
          />
          <HURUmap
            path="embed/hurumap/:geoId/:chartId"
            parentEl={parentEl}
            chartId={params.get('chart-id')}
            geoId={params.get('geoid')}
            showInsight={params.get('show-insight') === 'true'}
            showStatVisual={params.get('show-statvisual') === 'true'}
            insightTitle={params.get('insight-title')}
            insightSummary={params.get('insight-summary')}
            dataLinkTitle={params.get('data-link-title')}
            analysisCountry={params.get('analysis-country')}
            analysisLinkTitle={params.get('analysis-link-title')}
            dataGeoId={params.get('data-geoid')}
            chartWidth={params.get('width')}
          />
        </Router>
      </MuiThemeProvider>
    </StylesProvider>,
    document.getElementById('root')
  );
};
