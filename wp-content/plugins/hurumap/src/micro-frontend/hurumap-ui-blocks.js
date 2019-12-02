import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import HurumapCard from '@codeforafrica/hurumap-ui/core/Card';
import {
  StylesProvider,
  createGenerateClassName
} from '@material-ui/core/styles';
import config from '../config';

import Theme from '../Theme';
import propTypes from '../propTypes';

function Card({ parentEl, postType, postId }) {
  const [post, setPost] = useState();
  useEffect(() => {
    fetch(`${config.WP_BACKEND_URL}/wp-json/wp/v2/${postType}/${postId}`)
      .then(res => res.json())
      .then(setPost);
  }, [postType, postId]);

  return (
    <HurumapCard
      fullWidth
      onExpand={expanded => {
        // eslint-disable-next-line no-param-reassign
        parentEl.style.width = !expanded
          ? parentEl.getAttribute('data-width')
          : '100%';

        parentEl.firstChild.scrollIntoView();
      }}
      post={
        post && {
          title: post.title.rendered,
          content: post.content.rendered
        }
      }
    />
  );
}

Card.propTypes = {
  postId: propTypes.string.isRequired,
  postType: propTypes.string.isRequired,
  parentEl: propTypes.element.isRequired
};

window.onload = () => {
  const generateClassName = createGenerateClassName({
    productionPrefix: 'hurumap-ui-block-jss'
  });
  const els = document.querySelectorAll('div[id^=hurumap-card]');
  els.forEach(el => {
    ReactDOM.render(
      <StylesProvider generateClassName={generateClassName} injectFirst>
        <MuiThemeProvider theme={window.Theme || Theme}>
          <Card
            parentEl={el}
            postId={el.getAttribute('data-post-id')}
            postType={el.getAttribute('data-post-type')}
          />
        </MuiThemeProvider>
      </StylesProvider>,
      el
    );
  });
};
