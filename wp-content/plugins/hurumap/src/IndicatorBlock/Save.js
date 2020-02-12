import React from 'react';
import { InnerBlocks } from '@wordpress/block-editor';

import propTypes from '../propTypes';

function Save({ attributes, innerBlocks }) {
  let indicatorSrc = '';
  if (attributes.layout === 'image') {
    indicatorSrc =
      innerBlocks && innerBlocks.length ? innerBlocks[0].attributes.url : '';
  } else if (attributes.layout === 'file') {
    indicatorSrc =
      innerBlocks && innerBlocks.length ? innerBlocks[0].attributes.href : '';
  } else if (attributes.layout === 'html') {
    indicatorSrc =
      innerBlocks && innerBlocks.length
        ? innerBlocks[0].attributes.content
        : '';
  }

  return (
    <div
      id="indicator-block"
      data-title={attributes.title}
      data-description={attributes.description}
      data-source-title={attributes.sourceTitle}
      data-source-link={attributes.sourceLink}
      data-src={indicatorSrc}
      data-layout={attributes.layout}
      className="indicator-widget"
    >
      <InnerBlocks.Content />
    </div>
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    description: propTypes.string,
    sourceTitle: propTypes.string,
    sourceLink: propTypes.string,
    layout: propTypes.string
  }).isRequired,
  innerBlocks: propTypes.arrayOf(
    propTypes.shape({
      attributes: propTypes.shape({
        href: propTypes.string,
        content: propTypes.string,
        url: propTypes.string
      })
    })
  ).isRequired
};

export default Save;
