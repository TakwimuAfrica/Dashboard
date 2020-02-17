import React from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';

import {
  PanelBody,
  SandBox,
  SelectControl,
  TextControl,
  TextareaControl
} from '@wordpress/components';

import { InspectorControls, MediaPlaceholder } from '@wordpress/block-editor';
import PDFDataContainer from './PDFDataContainer';
import propTypes from '../propTypes';

function Edit({
  attributes: { description, sourceTitle, sourceLink, title, layout, src },
  setAttributes
}) {
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
          <SelectControl
            label="Layout"
            value={layout}
            options={[
              { label: 'Select Layout', value: undefined },
              { label: 'Document', value: 'document' },
              { label: 'Image', value: 'image' },
              { label: 'HTML', value: 'html' }
            ]}
            onChange={val => {
              setAttributes({ layout: val });
            }}
          />
          {layout && (
            <Fragment>
              {layout === 'html' ? (
                <TextareaControl
                  label="Add html"
                  value={src}
                  onChange={val => {
                    setAttributes({ src: val });
                  }}
                  placeholder={__('Paste HTML')}
                  aria-label={__('HTML')}
                />
              ) : (
                <MediaPlaceholder
                  onSelect={el => {
                    setAttributes({ src: el.url });
                  }}
                  accepts={layout === 'image' ? 'image/*' : '.pdf'}
                  labels={
                    layout === 'image'
                      ? {
                          title: __('Image'),
                          instructions: __(
                            'Upload media or pick one from library'
                          )
                        }
                      : {
                          title: __('Document'),
                          instructions: __(
                            'Upload file or pick one from library'
                          )
                        }
                  }
                />
              )}
            </Fragment>
          )}
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
          <TextareaControl
            label="Description"
            value={description}
            onChange={val => {
              setAttributes({ description: val });
            }}
          />
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
        <>
          {layout && layout === 'html' && src && <SandBox html={src} />}
          {layout && layout === 'image' && src && (
            <img src={src} alt="indicator" />
          )}
          {layout && layout === 'document' && src && (
            <PDFDataContainer title={title} source={src} />
          )}
        </>
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
