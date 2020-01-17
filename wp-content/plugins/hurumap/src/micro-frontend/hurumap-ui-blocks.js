import React from 'react';
import ReactDOM from 'react-dom';

import shortid from 'shortid';

import { MuiThemeProvider } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core/styles';

import { Card, HURUmap, Flourish } from './components';

import Theme from '../Theme';

window.renderBlocks = () => {
  const root =
    document.getElementById('hurumap-ui-micro-frontend') ||
    document.createElement('div');
  if (root.getAttribute('id') !== 'hurumap-ui-micro-frontend') {
    root.setAttribute('id', 'hurumap-ui-micro-frontend');
    document.body.appendChild(root);
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
        <>
          {Array.from(
            document.querySelectorAll('div[id^=hurumap-card]')
          ).map(el =>
            ReactDOM.createPortal(
              <Card
                parentEl={el}
                postId={el.getAttribute('data-post-id')}
                postType={el.getAttribute('data-post-type')}
              />,
              el
            )
          )}
          {Array.from(
            document.querySelectorAll('div[id^=indicator-flourish]')
          ).map(el =>
            ReactDOM.createPortal(
              <Flourish
                parentEl={el}
                chartId={el.getAttribute('data-chart-id')}
                title={el.getAttribute('data-chart-title')}
                description={el.getAttribute('data-chart-description')}
                showInsight={el.getAttribute('data-show-insight') === 'true'}
                insightTitle={el.getAttribute('data-insight-title')}
                insightSummary={el.getAttribute('data-insight-summary')}
                dataLintTitle={el.getAttribute('data-data-link-title')}
                analysisCountry={el.getAttribute('data-analysis-country')}
                analysisLinkTitle={el.getAttribute('data-analysis-link-title')}
                dataGeoId={
                  // data-data-geo-id to support old posts
                  el.getAttribute('data-data-geo-id') ||
                  el.getAttribute('data-data-geoid')
                }
              />,
              el
            )
          )}
          {Array.from(
            document.querySelectorAll('div[id^=indicator-hurumap]')
          ).map(el =>
            ReactDOM.createPortal(
              <HURUmap
                parentEl={el}
                chartId={el.getAttribute('data-chart-id')}
                geoId={
                  // data-geo-type to support old posts
                  el.getAttribute('data-geo-type') ||
                  el.getAttribute('data-geoid')
                }
                showInsight={el.getAttribute('data-show-insight') === 'true'}
                showStatVisual={
                  el.getAttribute('data-show-statvisual') === 'true'
                }
                insightTitle={el.getAttribute('data-insight-title')}
                insightSummary={el.getAttribute('data-insight-summary')}
                dataLinkTitle={el.getAttribute('data-data-link-title')}
                analysisCountry={el.getAttribute('data-analysis-country')}
                analysisLinkTitle={el.getAttribute('data-analysis-link-title')}
                dataGeoId={el.getAttribute('data-data-geoid')}
                chartWidth={el.getAttribute('data-width')}
              />,
              el
            )
          )}
        </>
      </MuiThemeProvider>
    </StylesProvider>,
    root
  );

  return null;
};

window.onload = window.renderBlocks;
