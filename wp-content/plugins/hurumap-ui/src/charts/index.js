import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { withSelect, useSelect, select } from "@wordpress/data";
import { isUndefined, pickBy } from "lodash";
import EditChart from "./EditChart";

registerBlockType("hurumap-ui/charts", {
  title: __("Charts", "hurumap-ui"),
  icon: "smiley",
  category: "common",
  supports: {
    align: ["wide", "full", "left", "right", "center"],
    html: false
  },
  attributes: {
    postId: {
      type: "number"
    },
    postType: {
      type: "string",
      default: "post"
    }
  },
  edit: withSelect((select, props) => {
    const { attributes } = props;
    const { postType: postTypeName } = attributes;
    const { getEntityRecords, getPostType, getPostTypes } = select("core");
    const postTypes = getPostTypes({ per_page: -1 }) || [];
    const selectedPostType = getPostType(postTypeName) || {};

    const PostsQuery = pickBy(
      {
        per_page: -1,
        advanced_posts_blocks: true
      },
      value => !isUndefined(value)
    );

    return {
      posts:
        getEntityRecords("postType", selectedPostType.slug, PostsQuery) || [],
      selectedPostType,
      postTypes: postTypes
        .filter(postType => postType.viewable)
        .filter(postType => postType.rest_base !== "media")
    };
  })(EditChart),
  save({ attributes }) {
    return (
      <div
        data-post-id={attributes.postId}
        data-post-type={attributes.postType}
      />
    );
  }
});
