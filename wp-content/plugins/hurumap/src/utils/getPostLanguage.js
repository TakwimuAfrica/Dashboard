import { getPath } from '@wordpress/url';

export default select => {
  const { getPermalinkParts, getCurrentPostType } = select('core/editor');
  const { prefix } = getPermalinkParts();
  const currentPostType = getCurrentPostType();

  let language = 'en';
  const path = getPath(prefix);

  if (path) {
    const pathPart = path.split('/')[0];
    if (pathPart !== currentPostType) {
      language = pathPart;
    }
  }
  return language;
};
