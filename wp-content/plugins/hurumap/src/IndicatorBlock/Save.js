import React from 'react';

import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      id={`indicator-block-${attributes.id}`}
      data-title={attributes.title}
      data-description={attributes.description}
      data-source-title={attributes.sourceTitle}
      data-source-link={attributes.sourceLink}
      data-widget={attributes.widget}
      data-src={attributes.src}
      className="indicator-widget"
    >
      <></>
    </div>
  );
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
