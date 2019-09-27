import { __ } from "@wordpress/i18n";
import { Component, Fragment } from "@wordpress/element";
import {
  PanelBody,
  Placeholder,
  SelectControl
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/editor";

import { MuiThemeProvider, CssBaseline } from "@material-ui/core";

export default class EditChart extends Component {
  render() {
    const {
      className,
      attributes,
      setAttributes,
      posts,
      selectedPostType,
      postTypes
    } = this.props;
    const { postId } = attributes;

    const selectedPost = posts.find(post => post.id === postId);
    const renderChart = () => {
      return (
        <MuiThemeProvider>
          <CssBaseline />
          Charts
        </MuiThemeProvider>
      );
    };

    return (
      <Fragment>
        <InspectorControls>
          <PanelBody title={__("Query setting", "hurumap-ui")}>
            <SelectControl
              label={__("Post Type", "hurumap-ui")}
              value={selectedPostType.slug}
              options={postTypes.map(type => ({
                label: type.name,
                value: type.slug
              }))}
              onChange={postType => {
                setAttributes({ postId: undefined, postType });
              }}
            />
            <SelectControl
              label={__("Post")}
              value={postId}
              options={[
                {
                  value: "",
                  label: __("Select Post", "hurumap-ui")
                },
                ...posts.map(post => ({
                  label: post.title.rendered,
                  value: post.id
                }))
              ]}
              onChange={value => {
                setAttributes({ postId: value ? parseInt(value) : undefined });
              }}
            />
          </PanelBody>
        </InspectorControls>

        {postId && selectedPost && renderChart()}

        {!postId && (
          <Placeholder icon="admin-post" label={__("Card", "hurumap-ui")}>
            {__("Post Not Found.", "hurumap-ui")}
          </Placeholder>
        )}
      </Fragment>
    );
  }
}
