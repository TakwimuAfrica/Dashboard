import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';
import Edit from './Edit';

import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div id="featured-data" data-featured-data-title={attributes.title}>
      <InnerBlocks.Content />
    </div>
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string
  }).isRequired
};

registerBlockType('hurumap-data/featured-data', {
  title: __('Featured Data', 'hurumap-data'),
  icon: 'admin-links', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  attributes: {
    title: {
      type: 'string'
    }
  },
  edit: Edit,
  save: Save
});
