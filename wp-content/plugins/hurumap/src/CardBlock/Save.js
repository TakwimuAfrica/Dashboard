import React from 'react';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      id={`hurumap-card-${attributes.id}`}
      style={{
        marginLeft: 10,
        marginBottom: 10,
        width: attributes.cardWidth
      }}
      data-postType={attributes.postType}
      data-postId={attributes.postId}
      data-width={attributes.cardWidth}
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
