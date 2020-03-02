import React from 'react';
import { dataProps, TYPES } from '@hurumap-ui/content';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return <div {...dataProps(TYPES.INDICATOR_WIDGET, attributes)} />;
}

Save.propTypes = {
  attributes: propTypes.shape({
    id: propTypes.string,
    title: propTypes.string,
    description: propTypes.string,
    sourceTitle: propTypes.string,
    sourceLink: propTypes.string,
    widget: propTypes.string,
    src: propTypes.string
  }).isRequired
};

export default Save;
