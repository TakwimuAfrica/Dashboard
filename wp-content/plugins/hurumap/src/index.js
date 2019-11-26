import React from 'react';
import ReactDOM from 'react-dom';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';

import Theme from './Theme';

const client = new ApolloClient({
  uri: 'https://graphql.takwimu.africa/graphql'
});

window.onload = () => {
  document.domain = window.initial.domain;
  const wpContent = document.getElementById('wpbody-content');
  const div = document.createElement('div');
  div.id = 'wp-hurumap-data-app-bar';
  div.style.height = '48px';
  wpContent.insertBefore(div, wpContent.childNodes[0]);
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
