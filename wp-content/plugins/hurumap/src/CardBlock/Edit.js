import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

import Card from '@codeforafrica/hurumap-ui/core/Card';

import { select } from '@wordpress/data';
import withRoot from '../withRoot';
import propTypes from '../propTypes';

function Edit({
  attributes: {
    postId: propPostId,
    postType: propPostType,
    cardWidth: propCardWidth,
    link: propLink
  },
  setAttributes
}) {
  const [post, setPost] = useState();
  const [posts, setPosts] = useState([]);
  const [postType, setPostType] = useState('snippet');
  useEffect(() => {
    (async () => {
      const { getEntityRecords } = select('core');

      let results;
      function getRecords() {
        setTimeout(() => {
          results = getEntityRecords('postType', postType);
          if (!results) {
            getRecords();
          } else {
            setPosts(results);
          }
        }, 1000);
      }

      getRecords();
    })();
  }, [postType]);

  useEffect(() => {
    (async () => {
      const { getEntityRecord } = select('core');

      let result;
      function getRecord() {
        setTimeout(() => {
          result = getEntityRecord('postType', propPostType, propPostId);
          if (!result) {
            getRecord();
          } else {
            setPost(result);
          }
        }, 1000);
      }

      getRecord();
    })();
  }, [propPostId, propPostType]);

  const handleSelectPost = postId => {
    setAttributes({ postType, postId });
  };

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__('Hurumap Card', 'hurumap')} />
        <SelectControl
          label={__('Post Type', 'hurumap')}
          options={['snippet', 'post'].map(pt => ({
            value: pt,
            label: pt
          }))}
          value={postType}
          onChange={setPostType}
        />
        <SelectControl
          label={__('Post', 'hurumap')}
          options={[
            {
              label: 'Select post'
            },
            ...posts.map(p => ({
              value: p.id,
              label: p.title.rendered
            }))
          ]}
          value={propPostId}
          onChange={handleSelectPost}
        />
        <TextControl
          label={__('Width', 'hurumap')}
          value={propCardWidth}
          onChange={width => {
            setAttributes({ cardWidth: width });
          }}
        />
      </InspectorControls>

      <Card
        link={propLink}
        post={
          post && {
            title: post.title.rendered,
            content: post.content.rendered
          }
        }
        width={propCardWidth}
      />
    </Fragment>
  );
}

Edit.propTypes = {
  attributes: propTypes.shape({
    postId: propTypes.string,
    postType: propTypes.string,
    cardWidth: propTypes.string,
    link: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(Edit);
