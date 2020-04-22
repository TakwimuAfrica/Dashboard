import React from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, SelectControl } from '@wordpress/components';
import { InspectorControls, InnerBlocks } from '@wordpress/editor';

import withRoot from '../withRoot';
import propTypes from '../propTypes';

const TEMPLATE_OPTIONS = {
  '1/3-1/3-1/3': [
    [
      'core/columns',
      {},
      [
        ['core/column', {}, []],
        ['core/column', {}, []],
        ['core/column', {}, []]
      ]
    ]
  ],
  '2/3-1/3': [
    [
      'core/columns',
      {},
      [
        ['core/column', {}, []],
        ['core/column', {}, []]
      ]
    ]
  ],
  '1/3-2/3': [
    [
      'core/columns',
      {},
      [
        ['core/column', {}, []],
        ['core/column', {}, []]
      ]
    ]
  ],
  '1/2-1/2': [
    [
      'core/columns',
      {},
      [
        ['core/column', {}, []],
        ['core/column', {}, []]
      ]
    ]
  ]
};
const ALLOWED_BLOCKS = [
  'hurumap-data/flourish-block',
  'hurumap-data/flourish-block'
];

function Edit({ attributes: { layout }, setAttributes }) {
  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Charts Row', 'hurumap')} />
      </InspectorControls>

      <SelectControl
        label={__('Row layout', 'hurumap')}
        value={layout}
        options={[
          { value: null, label: 'Select Layout', disable: true },
          { value: '1/3-1/3-1/3', label: 'Three Thirds' },
          { value: '1/3-2/3', label: 'A third, Two thirds' },
          { value: '1/3-2/3', label: 'Two thirds, A thirds' },
          { value: '1/2-1/2', label: 'Two halves' },
          { value: '1', label: 'A whole' }
        ]}
        onChange={selectedLayout => {
          setAttributes({ layout: selectedLayout });
        }}
      />

      <InnerBlocks
        template={TEMPLATE_OPTIONS[layout]}
        allowedBlocks={ALLOWED_BLOCKS}
      />
    </Fragment>
  );
}

Edit.propTypes = {
  attributes: propTypes.shape({
    layout: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(Edit);
