import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';
import Edit from './Edit';

import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div id="featured-data" data-layout={attributes.layout}>
      <InnerBlocks.Content />
    </div>
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    layout: propTypes.string
  }).isRequired
};

registerBlockType('hurumap/section-row-block', {
  title: __('Chart Row', 'hurumap'),
  icon: 'admin-links', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  attributes: {
    layout: {
      type: 'string'
    }
  },
  edit: Edit,
  save: Save
});
