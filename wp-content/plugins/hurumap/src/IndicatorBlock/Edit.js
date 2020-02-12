import React from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import {
  PanelBody,
  SelectControl,
  TextControl,
  TextareaControl
} from '@wordpress/components';

import { InspectorControls, InnerBlocks } from '@wordpress/block-editor';
import propTypes from '../propTypes';

const TEMPLATE_OPTIONS = {
  image: [['core/image', {}]],
  html: [['core/html', {}]],
  document: [['core/file', {}]]
};

function Edit(props) {
  const {
    attributes: { title, description, sourceTitle, sourceLink, layout, src },
    setAttributes
  } = props;
  console.log(props);
  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Indicator Properties', 'hurumap')} initialOpen>
          <TextControl
            label="Title"
            value={title}
            onChange={val => {
              setAttributes({ title: val });
            }}
          />
          <TextareaControl
            label="Description"
            value={description}
            onChange={val => {
              setAttributes({ description: val });
            }}
          />
          <TextControl
            label="Source Title"
            value={sourceTitle}
            onChange={val => {
              setAttributes({ sourceTitle: val });
            }}
          />
          <TextControl
            label="Source Link"
            value={sourceLink}
            onChange={val => {
              setAttributes({ sourceLink: val });
            }}
          />
          <SelectControl
            label="Select Layout"
            value={layout}
            options={[
              { label: '', value: undefined },
              { label: 'Document', value: 'document' },
              { label: 'Image', value: 'image' },
              { label: 'HTML', value: 'html' }
            ]}
            onChange={val => {
              setAttributes({ layout: val });
            }}
          />
          {layout && layout === 'html' && (
            <TextareaControl
              label="Add html"
              value={src}
              onChange={val => {
                setAttributes({ src: val });
              }}
            />
          )}
        </PanelBody>
      </InspectorControls>

      <InsightContainer
        hideInsight
        title={title}
        description={description}
        variant="analysis"
        actions={{ handleDownload: null }}
        source={
          sourceLink || sourceTitle
            ? {
                title: sourceTitle,
                href: sourceLink
              }
            : undefined
        }
      >
        <div />
        <InnerBlocks template={TEMPLATE_OPTIONS[layout]} templateLock="all" />
      </InsightContainer>
    </Fragment>
  );
}

Edit.propTypes = {
  attributes: propTypes.shape({
    layout: propTypes.string,
    title: propTypes.string,
    description: propTypes.string,
    src: propTypes.string,
    sourceLink: propTypes.string,
    sourceTitle: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default Edit;
