import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChartDefinition from './ChartDefinition';

import Theme from '../Theme';

const client = new ApolloClient({
  uri: 'https://graphql.takwimu.africa/graphql'
});

window.onload = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={Theme}>
        <CssBaseline />
        <ChartDefinition />
      </MuiThemeProvider>
    </ApolloProvider>,
    document.getElementById('post-body-content')
  );
};
