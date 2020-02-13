import React from 'react';
import { InnerBlocks } from '@wordpress/block-editor';

import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      id="indicator-block"
      data-title={attributes.title}
      data-description={attributes.description}
      data-source-title={attributes.sourceTitle}
      data-source-link={attributes.sourceLink}
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
  }).isRequired
};

export default Save;
