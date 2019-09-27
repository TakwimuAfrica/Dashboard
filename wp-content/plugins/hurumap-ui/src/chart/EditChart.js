import { useEffect, useState, useMemo } from "react";
import { __ } from "@wordpress/i18n";
import { Component, Fragment } from "@wordpress/element";
import {
  PanelBody,
  Placeholder,
  SelectControl,
  TextControl
} from "@wordpress/components";
import { InspectorControls } from "@wordpress/editor";

import { InsightChartContainer } from "@codeforafrica/hurumap-ui";
import Chart from "../Chart";

import sections from "../data/charts";
import config from "../config";

import withRoot from "../withRoot";
import { useQuery, useApolloClient } from "@apollo/react-hooks";
import { GET_GEOGRAPHIES, buildDataCountQuery } from "../data/queries";

import { Grid } from "@material-ui/core";

function EditChart({
  clientId,
  className,
  attributes: { chartId: selectedChart, geoId: selectedGeo, chartWidth },
  setAttributes,
  posts,
  selectedPostType,
  postTypes,
  ...props
}) {
  const client = useApolloClient();
  const data = useState(
    Array(3)
      .fill(null)
      .map((_, index) => {
        const y = Number((Math.random() * 100).toFixed(1));
        return {
          tooltip: `${index}-${index} Employment Status`,
          x: `${index}-${index} Employment Status`,
          y
        };
      })
  );

  const [availableCharts, setAvailableCharts] = useState([]);

  useEffect(() => {
    (async () => {
      const charts = sections.reduce((a, b) => a.concat(b.charts), []);
      const { data } = await client.query({
        query: buildDataCountQuery(charts),
        variables: {
          geoCode: selectedGeo.split("-")[1],
          geoLevel: selectedGeo.split("-")[0]
        }
      });

      setAvailableCharts(
        charts
          .filter(({ visual: { table } }) => data[table].totalCount !== 0)
          .map(chart => ({
            label: chart.title,
            value: chart.id
          }))
      );
    })();
  }, [selectedGeo]);

  const { loading, error, data: options } = useQuery(GET_GEOGRAPHIES);

  const blockDiv = document.querySelector(`div[data-block="${clientId}"]`);
  if (blockDiv) {
    blockDiv.style.width = chartWidth;
  }

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody title={__("Chart Selection", "hurumap-ui")}></PanelBody>
      </InspectorControls>

      <Grid container direction="row" wrap="nowrap" spacing={1}>
        <Grid item>
          <SelectControl
            label={__("Geography", "hurumap-ui")}
            value={selectedGeo}
            options={
              options
                ? options.geos.nodes.map(geo => ({
                    label: geo.name,
                    value: `${geo.geoLevel}-${geo.geoCode}`
                  }))
                : []
            }
            onChange={geoId => {
              setAttributes({ geoId });
            }}
          />
        </Grid>
        <Grid item>
          <SelectControl
            label={__("Chart", "hurumap-ui")}
            value={selectedChart}
            options={availableCharts}
            onChange={chartId => {
              setAttributes({ chartId });
            }}
          />
        </Grid>
        <Grid item>
          <TextControl
            label={__("Width", "hurumap-ui")}
            value={chartWidth}
            onChange={width => {
              setAttributes({ chartWidth: width });
            }}
          />
        </Grid>
      </Grid>

      <Chart geoId={selectedGeo} chartId={selectedChart} />
    </Fragment>
  );
}

export default withRoot(EditChart);
