import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

import Card from '@hurumap-ui/core/Card';
import { InputLabel } from '@material-ui/core';

import { select } from '@wordpress/data';
import Select from 'react-select';
import withRoot from '../withRoot';
import propTypes from '../propTypes';

function Edit({
  attributes: {
    postId: propPostId,
    postType: propPostType,
    cardWidth: propCardWidth
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
          results = getEntityRecords('postType', postType, {
            per_page: -1,
            status: 'publish'
          });
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
        <InputLabel shrink>Post</InputLabel>
        <Select
          value={post && { value: post.id, label: post.title.rendered }}
          options={posts.map(p => ({
            value: p.id,
            label: p.title.rendered
          }))}
          onChange={({ value }) => handleSelectPost(`${value}`)}
        />
        <TextControl
          label={__('Width', 'hurumap')}
          value={propCardWidth}
          onChange={width => {
            setAttributes({ cardWidth: width });
          }}
        />
      </InspectorControls>

      <div style={{ marginLeft: 10, marginBottom: 10 }}>
        <Card
          type={propPostType}
          post={
            post && {
              title: post.title.rendered,
              content: post.content.rendered
            }
          }
          width={propCardWidth}
        />
      </div>
    </Fragment>
  );
}

Edit.propTypes = {
  attributes: propTypes.shape({
    postId: propTypes.string,
    postType: propTypes.string,
    cardWidth: propTypes.string
  }).isRequired,
  setAttributes: propTypes.func.isRequired
};

export default withRoot(Edit);
