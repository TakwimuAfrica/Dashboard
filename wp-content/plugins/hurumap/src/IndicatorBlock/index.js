// import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import Edit from './Edit';
import Save from './Save';

registerBlockType('hurumap/indicator-block', {
  title: __('HURUmap Indicator', 'hurumap'),
  icon: 'admin-page', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  attributes: {
    title: {
      type: 'string'
    },
    blockId: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    sourceTitle: {
      type: 'string'
    },
    sourceLink: {
      type: 'string'
    },
    src: {
      type: 'string'
    },
    htmlSrc: {
      type: 'html'
    },
    srcId: {
      type: 'number'
    },
    widget: {
      type: 'string'
    }
  },
  edit: Edit,
  save: Save
});
