import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import Theme from './Theme';
import config from './config';

const client = new ApolloClient({
  uri: config.GRAPHQL_URL
});

export default Component => props => (
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={Theme}>
      <CssBaseline />
      <Component {...props} />
    </MuiThemeProvider>
  </ApolloProvider>
);
