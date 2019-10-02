import React from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';

import Theme from './Theme';

const client = new ApolloClient({
  uri: 'https://graphql.takwimu.africa/graphql'
});

export default Component => props => (
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={Theme}>
      <CssBaseline />
      <Component {...props} />
    </MuiThemeProvider>
  </ApolloProvider>
);
