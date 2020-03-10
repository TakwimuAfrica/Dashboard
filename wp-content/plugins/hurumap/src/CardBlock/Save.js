import React from 'react';
import { dataProps, TYPES } from '@hurumap-ui/content';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return <div {...dataProps(TYPES.HURUMAP_CARD, attributes)} />;
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
