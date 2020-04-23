import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';
import Edit from './Edit';

import propTypes from '../propTypes';

function Save() {
  return <InnerBlocks.Content />;
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    row: propTypes.string
  }).isRequired
};

registerBlockType('hurumap/section-block', {
  title: __('Section', 'hurumap'),
  icon: 'admin-links', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  attributes: {
    title: {
      type: 'string'
    },
    row: {
      type: 'string',
      default: '0'
    },
    rowsLayout: {
      type: 'array',
      default: []
    }
  },
  edit: Edit,
  save: Save
});
