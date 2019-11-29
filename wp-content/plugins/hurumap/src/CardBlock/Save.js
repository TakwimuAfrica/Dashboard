import React from 'react';
import propTypes from '../propTypes';
import config from '../config';

function Save({ attributes }) {
  return (
    <iframe
      frameBorder={0}
      width={attributes.cardWidth}
      id={`hurumap-card-${attributes.id}`}
      style={{ marginLeft: 10, marginBottom: 10 }}
      title={`${attributes.postType}-${attributes.postId}`}
      src={`${config.WP_BACKEND_URL}/card/${attributes.postType}/${attributes.postId}?width=${attributes.cardWidth}&id=${attributes.id}`}
    />
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    id: propTypes.string,
    postId: propTypes.string,
    postType: propTypes.string,
    cardWidth: propTypes.string
  }).isRequired
};

export default Save;
