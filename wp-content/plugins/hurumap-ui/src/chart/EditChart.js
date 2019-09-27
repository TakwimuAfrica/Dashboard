import { __ } from "@wordpress/i18n";
import { Component, Fragment } from "@wordpress/element";
import { PanelBody, Placeholder, SelectControl } from "@wordpress/components";
import { InspectorControls } from "@wordpress/editor";

import { MuiThemeProvider, CssBaseline } from "@material-ui/core";

import { ChartContainer, BarChart } from "@codeforafrica/hurumap-ui";

import Theme from "../Theme";

export default class EditChart extends Component {
  constructor(props) {
    super(props);
    this.data = Array(3)
      .fill(null)
      .map((_, index) => {
        const y = Number((Math.random() * 100).toFixed(1));
        return {
          tooltip: `${index}-${index} Employment Status`,
          x: `${index}-${index} Employment Status`,
          y
        };
      });
  }
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

        <MuiThemeProvider theme={Theme}>
          <CssBaseline />
          <ChartContainer title="Title" subtitle="Subtitle">
            <BarChart
              data={this.data}
              alignment="middle"
              domainPadding={{ x: 20 }}
              parts={{
                axis: {
                  independent: {
                    style: {
                      axis: {
                        display: "block"
                      },
                      grid: {
                        display: "block"
                      },
                      ticks: {
                        display: "block"
                      },
                      tickLabels: {
                        display: "block"
                      }
                    }
                  },
                  dependent: {
                    tickValues: [10, 50, 90],
                    tickFormat: ["10%", "50%", "90%"],
                    style: {
                      axis: {
                        display: "block"
                      },
                      grid: {
                        display: "block"
                      },
                      ticks: {
                        display: "block"
                      },
                      tickLabels: {
                        display: "block"
                      }
                    }
                  }
                }
              }}
            />
          </ChartContainer>
        </MuiThemeProvider>
      </Fragment>
    );
  }
}
