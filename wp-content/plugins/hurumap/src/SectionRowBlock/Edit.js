import React from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, PanelRow, SelectControl } from '@wordpress/components';
import { InspectorControls, InnerBlocks } from '@wordpress/editor';

import withRoot from '../withRoot';
import propTypes from '../propTypes';

const TEMPLATE_OPTIONS = {
  '33.33-33.33-33.33': [
    [
      'core/columns',
      {},
      [
        ['core/column', { width: 33.33 }, [['hurumap/section-chart']]],
        ['core/column', { width: 33.33 }, [['hurumap/section-chart']]],
        ['core/column', { width: 33.33 }, [['hurumap/section-chart']]]
      ]
    ]
  ],
  '66.67-33.33': [
    [
      'core/columns',
      {},
      [
        ['core/column', { width: 66.66 }, [['hurumap/section-chart']]],
        ['core/column', { width: 33.33 }, [['hurumap/section-chart']]]
      ]
    ]
  ],
  '33.33-66.67': [
    [
      'core/columns',
      {},
      [
        ['core/column', { width: 33.33 }, [['hurumap/section-chart']]],
        ['core/column', { width: 66.66 }, [['hurumap/section-chart']]]
      ]
    ]
  ],
  '50-50': [
    [
      'core/columns',
      {},
      [
        ['core/column', { width: 50 }, [['hurumap/section-chart']]],
        ['core/column', { width: 50 }, [['hurumap/section-chart']]]
      ]
    ]
  ],
  '100': [
    [
      'core/columns',
      {},
      [['core/columns', { width: 100 }, [['hurumap/section-chart']]]]
    ]
  ]
};

function Edit({ attributes: { layout }, setAttributes }) {
  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Charts Row', 'hurumap')}>
          <PanelRow>
            <SelectControl
              label={__('Row layout', 'hurumap')}
              value={layout}
              options={[
                { value: null, label: 'Select Layout', disable: true },
                { value: '33.33-33.33-33.33', label: 'Three Thirds' },
                { value: '33.33-66.67', label: 'A third, Two thirds' },
                { value: '66.67-33.33', label: 'Two thirds, A thirds' },
                { value: '50-50', label: 'Two halves' },
                { value: '100', label: 'A whole' }
              ]}
              onChange={selectedLayout => {
                setAttributes({ layout: selectedLayout });
              }}
            />
          </PanelRow>
        </PanelBody>
      </InspectorControls>
      <div style={{ backgroundColor: '#f1f1ed' }}>
        <InnerBlocks template={TEMPLATE_OPTIONS[layout]} />
      </div>
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
