import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import Edit from './Edit';
import Save from './Save';

registerBlockType('hurumap/card-block', {
  title: __('HURUmap Card', 'hurumap'),
  icon: 'index-card', // https://developer.wordpress.org/resource/dashicons
  category: 'widgets',
  supports: {
    align: ['wide', 'full', 'left', 'right', 'center'],
    html: false
  },
  attributes: {
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
  },
  edit: Edit,
  save: Save
});
