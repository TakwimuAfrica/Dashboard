import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';
import Edit from './Edit';

registerBlockType('hurumap-data/featured-data', {
  title: __('Featured Chart', 'hurumap-data'),
  icon: 'chart-pie', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  edit: Edit,
  save: () => {
    return (
      <div>
        <InnerBlocks.Content />
      </div>
    );
  }
});
