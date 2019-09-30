import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import App from './App';

import Theme from './Theme';

const client = new ApolloClient({
  uri: 'https://graphql.takwimu.africa/graphql'
});

window.onload = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={Theme}>
        <CssBaseline />
        <App />
      </MuiThemeProvider>
    </ApolloProvider>,
    document.getElementById('wp-hurumap-data')
  );
};
