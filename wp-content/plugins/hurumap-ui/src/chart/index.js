import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import EditChart from './EditChart';
import SaveChart from './SaveChart';

registerBlockType('hurumap-ui/chart', {
  title: __('Hurumap Chart', 'hurumap-ui'),
  icon: 'chart-pie', // https://developer.wordpress.org/resource/dashicons/#chart-pie
  category: 'widgets',
  supports: {
    align: ['wide', 'full', 'left', 'right', 'center'],
    html: false
  },
  attributes: {
    geoId: {
      type: 'string'
    },
    chartId: {
      type: 'string'
    },
    chartWidth: {
      type: 'string',
      default: '100%'
    }
  },
  edit: EditChart,
  save: SaveChart
});
