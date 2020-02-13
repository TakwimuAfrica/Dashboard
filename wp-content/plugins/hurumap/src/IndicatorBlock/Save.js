import React from 'react';

import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      id="indicator-block"
      data-title={attributes.title}
      data-description={attributes.description}
      data-source-title={attributes.sourceTitle}
      data-source-link={attributes.sourceLink}
      data-layout={attributes.layout}
      data-src={attributes.src}
      className="indicator-widget"
    >
      {attributes.layout === 'image' ? (
        <img src={attributes.src} alt="indicator" />
      ) : (
        <div dangerouslySetInnerHTML={{ __html: attributes.src }} />
      )}
    </div>
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    description: propTypes.string,
    sourceTitle: propTypes.string,
    sourceLink: propTypes.string,
    layout: propTypes.string,
    src: propTypes.string
  }).isRequired
};

export default Save;
