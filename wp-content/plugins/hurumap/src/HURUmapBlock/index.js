import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import EditChart from './EditChart';
import SaveChart from './SaveChart';

registerBlockType('hurumap-data/hurumap-block', {
  title: __('HURUmap Chart', 'hurumap-data'),
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
    },
    hideInsight: {
      type: 'boolean',
      default: true
    },
    hideStatVisual: {
      type: 'boolean',
      default: true
    },
    insightTitle: {
      type: 'string',
      default: 'Summary'
    },
    insightSummary: {
      type: 'string',
      source: 'html',
      multiline: 'p',
      selector: 'blockquote'
    }
  },
  edit: EditChart,
  save: SaveChart
});
