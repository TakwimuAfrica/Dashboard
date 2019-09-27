import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { withSelect, useSelect, select } from "@wordpress/data";
import { isUndefined, pickBy } from "lodash";
import EditChart from "./EditChart";

registerBlockType("hurumap-ui/chart", {
  title: __("Chart", "hurumap-ui"),
  icon: "smiley",
  category: "common",
  supports: {
    align: ["wide", "full", "left", "right", "center"],
    html: false
  },
  attributes: {
    geoId: {
      type: "string"
    },
    chartId: {
      type: "string"
    },
    chartWidth: {
      type: "string",
      default: "100%"
    }
  },
  edit: EditChart,
  save({ attributes }) {
    return (
      <div
        style={{ width: attributes.chartWidth }}
        data-chart-id={attributes.chartId}
        data-geo-type={attributes.geoId}
        data-width={attributes.chartWidth}
      />
    );
  }
});
