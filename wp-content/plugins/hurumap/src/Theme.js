import createTheme from '@codeforafrica/hurumap-ui/core/styles/createTheme';

const FONT_FAMILY_TEXT = '"Muli", sans-serif';
const COLOR_BREWER_DIVERGING = [
  '#8ed3a5',
  '#29a87c',
  '#223a07',
  '#7d8c6c',
  '#5bc17d'
];

export default createTheme({
  chart: {
    pie: {
      width: 350,
      height: 200,
      padding: 0,
      legendWidth: 100,
      origin: { x: 150, y: 125 },
      colorScale: COLOR_BREWER_DIVERGING
    },
    area: {
      colorScale: COLOR_BREWER_DIVERGING
    },
    group: {
      colorScale: COLOR_BREWER_DIVERGING
    },
    bar: {
      width: 350,
      height: 350,
      offset: 50,
      style: {
        data: {
          fill: COLOR_BREWER_DIVERGING[0]
        },
        labels: {
          fontFamily: FONT_FAMILY_TEXT,
          fill: 'rgb(0,0,0)'
        }
      }
    },
    axis: {
      labelWidth: 100,
      style: {
        tickLabels: {
          fontFamily: FONT_FAMILY_TEXT,
          fill: 'rgb(0,0,0)'
        },
        axisLabels: {
          fontFamily: FONT_FAMILY_TEXT,
          fill: 'rgb(0,0,0)'
        }
      }
    }
  },
  props: {
    MuiTextField: {
      disableUnderline: true
    }
  },
  palette: {
    data: {
      main: '#4a4a4a',
      light: '#F5F5F5' // #4a4a4a opacity 0.05
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '#wpcontent': {
          paddingLeft: 0
        },
        '.alignleft': {
          float: 'left',
          marginRight: 20
        },
        '.alignright': {
          float: 'right',
          marginLeft: 20
        }
      }
    },
    MuiTabs: {
      root: {
        backgroundColor: '#23282d'
      },
      indicator: {
        backgroundColor: '#fff'
      }
    },
    MuiAppBar: {
      positionFixed: {
        top: 'unset',
        left: 'unset',
        right: 'unset'
      }
    }
  }
});
