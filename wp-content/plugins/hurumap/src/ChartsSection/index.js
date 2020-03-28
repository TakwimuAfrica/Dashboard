import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { MuiThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import ChartsSectionForm from './ChartsSectionForm';

import Theme from '../Theme';
import config from '../config';

const client = new ApolloClient({
  uri: config.GRAPHQL_URL
});

window.onload = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={Theme}>
        <CssBaseline />
        <ChartsSectionForm />
      </MuiThemeProvider>
    </ApolloProvider>,
    document.getElementById('post-body-content')
  );
};
