import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';

import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import ChartDefinition from '../src/ChartDefinition/ChartDefinition';
import config from '../src/config';
import { ThemeProvider } from '@material-ui/core';
import Theme from '../src/Theme';

storiesOf('ChartDefinition', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const uri = text('graphql', config.GRAPHQL_URL);
    const postID = text('postID', '');
    return (
      <ApolloProvider
        client={
          new ApolloClient({
            uri
          })
        }
      >
        <ThemeProvider theme={Theme}>
          <input id="post_ID" value={postID} />
          <ChartDefinition />
        </ThemeProvider>
      </ApolloProvider>
    );
  });
