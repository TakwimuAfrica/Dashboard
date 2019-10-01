import { createTheme } from '@codeforafrica/hurumap-ui';

export default createTheme({
  overrides: {
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
