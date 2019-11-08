import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import CssBaseline from '@material-ui/core/CssBaseline';

import Card from '@codeforafrica/hurumap-ui/core/Card';

import { Router } from '@reach/router';

import Theme from '../Theme';

import propTypes from '../propTypes';
import IframeContent from './IFrameContent';

function CardRoot({ postType, postId }) {
  const queryParams = new URLSearchParams(window.location.search);
  const [post, setPost] = useState();

  useEffect(() => {
    fetch(`http://localhost:8080/wp-json/wp/v2/${postType}/${postId}`)
      .then(res => res.json())
      .then(setPost);
  }, [postType, postId]);

  return (
    <IframeContent>
      <Card
        fullWidth
        onExpand={expanded => {
          if (expanded && window.frameElement) {
            window.frameElement.style.width = '100%';
          } else if (window.frameElement) {
            window.frameElement.style.width = queryParams.get('width');
          } else {
            window.parent.postMessage(
              {
                id: `hurumap-card-${queryParams.get('id')}`,
                width: expanded ? '100%' : queryParams.get('width')
              },
              '*'
            );
          }
        }}
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
