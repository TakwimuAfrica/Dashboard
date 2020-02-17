import React from 'react';

import propTypes from '../propTypes';

function Save({ attributes }) {
  return (
    <div
      data-title={attributes.title}
      data-description={attributes.description}
      data-source-title={attributes.sourceTitle}
      data-source-link={attributes.sourceLink}
      data-widget={attributes.widget}
      data-src={attributes.src}
      className="indicator-widget"
    >
      <>
        {attributes.widget === 'image' && (
          <img src={attributes.src} alt="indicator" />
        )}
        {attributes.widget === 'document' && (
          <a href={attributes.src}>{attributes.title}</a>
        )}
        {attributes.widget === 'html' && (
          <div dangerouslySetInnerHTML={{ __html: attributes.src }} />
        )}
      </>
    </div>
  );
}

Save.propTypes = {
  attributes: propTypes.shape({
    title: propTypes.string,
    description: propTypes.string,
    sourceTitle: propTypes.string,
    sourceLink: propTypes.string,
    widget: propTypes.string,
    src: propTypes.string
  }).isRequired
};

export default Save;
