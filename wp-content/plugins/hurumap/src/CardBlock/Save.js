import React from 'react';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <iframe
      title={attributes.postId}
      frameBorder={0}
      width={attributes.cardWidth}
      src={`http://localhost:8080/card/${attributes.postType}/${attributes.postId}?width=${attributes.cardWidth}`}
    />
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    postId: propTypes.string,
    postType: propTypes.string,
    cardWidth: propTypes.string
  }).isRequired
};

export default Save;
