import React from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import InsightContainer from '@codeforafrica/hurumap-ui/core/InsightContainer';
import {
  PanelBody,
  SelectControl,
  TextControl,
  TextareaControl,
  DropZoneProvider,
  DropZone
} from '@wordpress/components';

import { InspectorControls } from '@wordpress/editor';

import withRoot from '../withRoot';
import propTypes from '../propTypes';

function Edit({
  attributes: { title, description, sourceTitle, sourceLink, layout, src },
  setAttributes
}) {
  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Indicator Properties', 'hurumap')}>
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
              { label: 'Document', value: 'document' },
              { label: 'Image', value: 'image' },
              { label: 'HTML', value: 'html' }
            ]}
            onChange={val => {
              setAttributes({ layout: val });
            }}
          />
          {layout === 'html' ? (
            <TextareaControl
              label="Add html"
              value={src}
              onChange={val => {
                setAttributes({ src: val });
              }}
            />
          ) : (
            <DropZoneProvider>
              <DropZone
                label={`Drop ${layout} file to upload`}
                onFilesDrop={() => {}}
                onHTMLDrop={() => {}}
              />
            </DropZoneProvider>
          )}
        </PanelBody>
      </InspectorControls>

      <InsightContainer
        hideInsight
        title={title}
        description={description}
        source={{
          title: sourceTitle,
          href: sourceLink
        }}
      >
        {layout === 'image' ? (
          <img alt="indicator" src={src} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: src }} />
        )}
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

export default withRoot(Edit);
