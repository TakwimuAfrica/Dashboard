import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';

const sectionLayout = [
  [
    'hurumap/section-block',
    {
      row: '2',
      rowsLayout: ['33.33-66.67', '66.67-33.33'],
      title: 'Featured Data'
    }
  ]
];

function Save() {
  return <InnerBlocks.Content />;
}

function Edit() {
  return <InnerBlocks template={sectionLayout} />;
}

registerBlockType('hurumap-data/featured-data', {
  title: __('Featured Data', 'hurumap-data'),
  icon: 'admin-links', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  attributes: {},
  edit: Edit,
  save: Save
});
