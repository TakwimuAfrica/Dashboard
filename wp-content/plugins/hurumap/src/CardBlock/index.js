import React from 'react';
import { registerBlockType } from '@wordpress/blocks';
import { TYPES, deprecatedProps } from '@hurumap-ui/content';
import Edit from './Edit';
import Save from './Save';

const attributes = {
  id: {
    type: 'string'
  },
  postType: {
    type: 'string'
  },
  postId: {
    type: 'string'
  },
  cardWidth: {
    type: 'string'
  }
};

registerBlockType('hurumap/card-block', {
  title: 'HURUmap Card',
  icon: 'index-card', // https://developer.wordpress.org/resource/dashicons
  category: 'widgets',
  supports: {
    align: ['wide', 'full', 'left', 'right', 'center'],
    html: false
  },
  attributes,
  edit: Edit,
  save: Save,
  deprecated: [
    {
      attributes,
      // eslint-disable-next-line react/prop-types
      save: ({ attributes: attribs }) => {
        return <div {...deprecatedProps(TYPES.HURUMAP_CARD, attribs)} />;
      }
    }
  ]
});
