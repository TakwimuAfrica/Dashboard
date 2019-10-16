import { createTheme } from '@codeforafrica/hurumap-ui/core';

export default createTheme({
  props: {
    MuiTextField: {
      disableUnderline: true
    }
  },
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
