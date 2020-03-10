import React from 'react';
import { registerBlockType } from '@wordpress/blocks';
import { deprecatedProps, TYPES } from '@hurumap-ui/content';
import Edit from './Edit';
import Save from './Save';

const attributes = {
  country: {
    type: 'string'
  },
  chartId: {
    type: 'string'
  },
  title: {
    type: 'string'
  },
  description: {
    type: 'string'
  },
  showInsight: {
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

registerBlockType('hurumap-data/flourish-block', {
  title: 'Flourish Chart',
  icon: 'chart-bar', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  supports: {
    align: ['wide', 'full', 'left', 'right', 'center'],
    html: false
  },
  attributes,
  edit: Edit,
  save: Save,
  deprecated: [
    {
      attributes,
      // eslint-disable-next-line react/prop-types
      save: ({ attributes: attribs }) => {
        return <div {...deprecatedProps(TYPES.FLOURISH_CHART, attribs)} />;
      }
    }
  ]
});
