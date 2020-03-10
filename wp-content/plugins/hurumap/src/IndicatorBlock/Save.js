import React from 'react';
import { dataProps, TYPES } from '@hurumap-ui/content';
import { RawHTML } from '@wordpress/element';
import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div {...dataProps(TYPES.INDICATOR_WIDGET, attributes)}>
      {attributes.widget === 'html' && <RawHTML>{attributes.htmlSrc}</RawHTML>}
    </div>
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    blockId: propTypes.string,
    title: propTypes.string,
    description: propTypes.string,
    sourceTitle: propTypes.string,
    sourceLink: propTypes.string,
    widget: propTypes.string,
    src: propTypes.string,
    htmlSrc: propTypes.string
  }).isRequired
};

export default Save;
