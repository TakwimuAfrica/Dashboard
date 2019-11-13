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
    showInsight: {
      type: 'boolean',
      default: false
    },
    showStatVisual: {
      type: 'boolean',
      default: false
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
    },
    analysisLinkTitle: {
      type: 'string',
      default: 'Read the country analysis'
    },
    dataLinkTitle: {
      type: 'string',
      default: 'View more data by topic'
    },
    analysisCountry: {
      type: 'string'
    },
    dataGeoId: {
      type: 'string'
    }
  },
  edit: EditChart,
  save: SaveChart
});
