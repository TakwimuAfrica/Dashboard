import React from 'react';
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import Edit from './Edit';

import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      id="indicator-block"
      data-title={attributes.title}
      data-description={attributes.description}
      data-source-title={attributes.sourceTitle}
      data-source-link={attributes.sourceLink}
      data-src={attributes.src}
      data-layout={attributes.layout}
      className="indicator-widget"
    />
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    description: propTypes.string,
    sourceTitle: propTypes.string,
    sourceLink: propTypes.string,
    src: propTypes.string,
    layout: propTypes.string
  }).isRequired
};

registerBlockType('hurumap/indicator-block', {
  title: __('Indicator', 'hurumap'),
  icon: 'admin-links', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  attributes: {
    title: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    sourceTitle: {
      type: 'string'
    },
    sourceLink: {
      type: 'string'
    },
    src: {
      type: 'string'
    },
    layout: {
      type: 'string'
    }
  },
  edit: Edit,
  save: Save
});
