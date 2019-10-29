import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import Edit from './Edit';
import Save from './Save';

registerBlockType('hurumap-data/flourish-block', {
  title: __('Flourish Chart', 'hurumap-data'),
  icon: 'chart-bar', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  supports: {
    align: ['wide', 'full', 'left', 'right', 'center'],
    html: false
  },
  attributes: {
    country: {
      type: 'string'
    },
    chartId: {
      type: 'string'
    },
    title: {
      type: 'string'
    }
  },
  edit: Edit,
  save: Save
});
