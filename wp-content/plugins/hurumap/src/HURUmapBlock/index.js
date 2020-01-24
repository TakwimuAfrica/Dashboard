import React from 'react';
import { registerBlockType } from '@wordpress/blocks';
import { deprecatedProps, TYPES } from '@codeforafrica/hurumap-ui/cms';
import EditChart from './EditChart';
import SaveChart from './SaveChart';

const attributes = {
  geoId: {
    type: 'string'
  },
  chartId: {
    type: 'string'
  },
  chartWidth: {
    type: 'string',
    default: '100%'
  },
  showInsight: {
    type: 'boolean',
    default: false
  },
  showStatVisual: {
    type: 'boolean',
    default: false
  },
  insightTitle: {
    type: 'string',
    default: 'Summary'
  },
  insightSummary: {
    type: 'string'
  },
  analysisLinkTitle: {
    type: 'string',
    default: 'Read the country analysis'
  },
  dataLinkTitle: {
    type: 'string',
    default: 'View more data by topic'
  },
  analysisCountry: {
    type: 'string'
  },
  dataGeoId: {
    type: 'string'
  }
};

registerBlockType('hurumap-data/hurumap-block', {
  title: 'HURUmap Chart',
  icon: 'chart-pie', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  supports: {
    align: ['wide', 'full', 'left', 'right', 'center'],
    html: false
  },
  attributes,
  edit: EditChart,
  save: SaveChart,
  deprecated: [
    {
      attributes,
      // eslint-disable-next-line react/prop-types
      save: ({ attributes: attribs }) => {
        return <div {...deprecatedProps(TYPES.HURUMAP_CHART, attribs)} />;
      }
    }
  ]
});
