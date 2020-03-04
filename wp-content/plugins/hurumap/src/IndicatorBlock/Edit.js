import React, { useEffect } from 'react';
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
import shortid from 'shortid';
import PDFDataContainer from '@codeforafrica/hurumap-ui/core/PDFDataContainer';
import propTypes from '../propTypes';

function Edit({
  attributes: {
    blockId,
    description,
    sourceTitle,
    sourceLink,
    title,
    widget,
    src,
    htmlSrc
  },
  setAttributes
}) {
  useEffect(() => {
    if (!blockId && src) {
      setAttributes({ blockId: shortid.generate() });
    }
  }, [blockId, setAttributes, src]);

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
            label="Widget"
            value={widget}
            options={[
              { label: 'Select widget type', value: undefined },
              { label: 'Document', value: 'document' },
              { label: 'Image', value: 'image' },
              { label: 'HTML', value: 'html' }
            ]}
            onChange={val => {
              setAttributes({ widget: val });
            }}
          />
          {widget && (
            <Fragment>
              {widget === 'html' ? (
                <TextareaControl
                  label="Add html"
                  value={htmlSrc}
                  onChange={val => {
                    setAttributes({ htmlSrc: val });
                  }}
                  placeholder={__('Paste HTML')}
                  aria-label={__('HTML')}
                />
              ) : (
                <MediaPlaceholder
                  onSelect={el => {
                    setAttributes({ src: el.url });
                  }}
                  accepts={widget === 'image' ? 'image/*' : '.pdf'}
                  allowedTypes={
                    widget === 'image' ? ['image'] : ['application/pdf']
                  }
                  labels={
                    widget === 'image'
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
          {widget && widget === 'html' && htmlSrc && <SandBox html={htmlSrc} />}
          {widget && widget === 'image' && src && (
            <img src={src} alt="indicator" />
          )}
          {widget && widget === 'document' && src && (
            <PDFDataContainer title={title} source={src} />
          )}
        </>
      </InsightContainer>
    </Fragment>
  );
}

Edit.propTypes = {
  attributes: propTypes.shape({
    blockId: propTypes.string,
    widget: propTypes.string,
    title: propTypes.string,
    description: propTypes.string,
    src: propTypes.string,
    htmlSrc: propTypes.string,
    sourceLink: propTypes.string,
    sourceTitle: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default Edit;
