import React from 'react';

import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { InnerBlocks } from '@wordpress/editor';

import { useState } from '@wordpress/element';

const TEMPLATE_OPTIONS = [
  {
    title: 'All Flourish Chart',
    icon: 'pie',
    template: [
      [
        'core/columns',
        {},
        [
          ['core/column', {}, [['hurumap-data/flourish-block', {}]]],
          ['core/column', {}, [['hurumap-data/flourish-block', {}]]]
        ]
      ]
    ]
  },
  {
    title: 'All HURUmap Chart',
    icon: 'pie',
    template: [
      [
        'core/columns',
        {},
        [
          ['core/column', {}, [['hurumap-data/hurumap-block', {}]]],
          ['core/column', {}, [['hurumap-data/hurumap-block', {}]]]
        ]
      ]
    ]
  },
  {
    title: 'Mixed Chart',
    icon: 'pie',
    template: [
      [
        'core/columns',
        {},
        [
          ['core/column', {}, [['hurumap-data/hurumap-block', {}]]],
          ['core/column', {}, [['hurumap-data/flourish-block', {}]]]
        ]
      ]
    ]
  }
];

registerBlockType('hurumap-data/featured-data', {
  title: __('Featured Chart', 'hurumap-data'),
  icon: 'chart-pie', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  edit: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [template, setTemplate] = useState(null);
    return (
      <InnerBlocks
        template={template}
        __experimentalTemplateOptions={TEMPLATE_OPTIONS}
        __experimentalOnSelectTemplateOption={setTemplate}
      />
    );
  },
  save: () => {
    return (
      <div>
        <InnerBlocks.Content />
      </div>
    );
  }
});
