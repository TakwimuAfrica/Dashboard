import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

import Card from '@codeforafrica/hurumap-ui/core/Card';

import { Router } from '@reach/router';

import Theme from '../Theme';

import propTypes from '../propTypes';
import IframeContent from './IFrameContent';
import config from '../config';

function CardRoot({ postType, postId }) {
  const [post, setPost] = useState();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`${config.WP_BACKEND_URL}/wp-json/wp/v2/${postType}/${postId}`)
      .then(res => res.json())
      .then(setPost);
  }, [postType, postId]);

  return (
    <IframeContent expanded={expanded}>
      <Card
        fullWidth
        onExpand={setExpanded}
        post={
          post && {
            title: post.title.rendered,
            content: post.content.rendered
          }
        }
      />
    </IframeContent>
  );
}

CardRoot.propTypes = {
  postType: propTypes.string.isRequired,
  postId: propTypes.string.isRequired
};

window.onload = () => {
  ReactDOM.render(
    <MuiThemeProvider theme={Theme}>
      <CssBaseline />
      <Router>
        <CardRoot path="/card/:postType/:postId" />
      </Router>
    </MuiThemeProvider>,
    document.getElementById('root')
  );
};
