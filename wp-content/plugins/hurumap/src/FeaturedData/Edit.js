import React from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { InspectorControls, InnerBlocks } from '@wordpress/editor';

import withRoot from '../withRoot';
import propTypes from '../propTypes';

const TEMPLATE_OPTIONS = {
  hurumap: [
    [
      'core/columns',
      {},
      [
        ['core/column', {}, [['hurumap-data/hurumap-block', {}]]],
        ['core/column', {}, [['hurumap-data/hurumap-block', {}]]]
      ]
    ]
  ],

  flourish: [
    [
      'core/columns',
      {},
      [
        ['core/column', {}, [['hurumap-data/flourish-block', {}]]],
        ['core/column', {}, [['hurumap-data/flourish-block', {}]]]
      ]
    ]
  ],

  mixed: [
    [
      'core/columns',
      {},
      [
        ['core/column', {}, [['hurumap-data/hurumap-block', {}]]],
        ['core/column', {}, [['hurumap-data/flourish-block', {}]]]
      ]
    ]
  ]
};

function Edit({ attributes: { template, title }, setAttributes }) {
  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Featured Data', 'hurumap-data')} />
      </InspectorControls>

      <TextControl
        label="Title"
        value={title}
        onChange={titleText => {
          setAttributes({ title: titleText });
        }}
      />

      <SelectControl
        label={__('Template', 'hurumap-data')}
        value={template}
        options={[
          { value: null, label: 'Select a template', disable: true },
          { value: 'hurumap', label: 'HURUmap Charts' },
          { value: 'mixed', label: 'Mixed Charts' },
          { value: 'flourish', label: 'Flourish Charts' }
        ]}
        onChange={selectedTemplate => {
          setAttributes({ template: selectedTemplate });
        }}
      />

      <InnerBlocks template={TEMPLATE_OPTIONS[template]} templateLock="all" />
    </Fragment>
  );
}

Edit.propTypes = {
  attributes: propTypes.shape({
    template: propTypes.string,
    title: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(Edit);
