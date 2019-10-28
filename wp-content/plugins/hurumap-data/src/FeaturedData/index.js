import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';

const TEMPLATE = [
  ['core/heading', { placeholder: 'Enter title...', level: 3 }],
  [
    'core/columns',
    {},
    [
      ['core/column', {}, [['hurumap-data/hurumap-block', {}]]],
      ['core/column', {}, [['hurumap-data/flourish-block', {}]]]
    ]
  ]
];

registerBlockType('hurumap-data/featured-data', {
  title: __('Featured Chart', 'hurumap-data'),
  icon: 'chart-pie', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  edit: () => {
    return <InnerBlocks template={TEMPLATE} templateLock="insert" />;
  },
  save: () => {
    return (
      <div>
        <InnerBlocks.Content />
      </div>
    );
  }
});
