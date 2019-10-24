import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import Edit from './Edit';
import Chart from './Chart';

registerBlockType('hurumap-data/flourish-block', {
  title: __('Flourish Chart', 'hurumap-data'),
  icon: 'chart-pie', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  supports: {
    align: ['wide', 'full', 'left', 'right', 'center'],
    html: false
  },
  attributes: {
    title: {
      type: 'string'
    },
    chartId: {
      type: 'string'
    }
  },
  edit: Edit,
  save: Chart
});
