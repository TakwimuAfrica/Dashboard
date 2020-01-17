import React, { useEffect, useState, useMemo } from 'react';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

import HurumapCard from '@codeforafrica/hurumap-ui/core/Card';
import FlourishChart from '../FlourishBlock/Chart';
import HURUmapChart from '../HURUmapBlock/Chart';

import { shareIndicator } from './utils';

import config from '../config';

import propTypes from '../propTypes';

export function Card({ parentEl, postType, postId }) {
  const [post, setPost] = useState();
  useEffect(() => {
    fetch(`${config.WP_BACKEND_URL}/wp-json/wp/v2/${postType}/${postId}`)
      .then(res => res.json())
      .then(setPost);
  }, [postType, postId]);

  return (
    <HurumapCard
      fullWidth
      onExpand={expanded => {
        // eslint-disable-next-line no-param-reassign
        parentEl.style.width = !expanded
          ? parentEl.getAttribute('data-width')
          : '100%';

        parentEl.firstChild.scrollIntoView();
      }}
      embed={{
        title: `Embed ${post.title && post.title.rendered}`,
        subtitle: 'Copy the code below, then paste into your own CMS or HTML.',
        code: `
        <iframe title="${post.title && post.title.rendered}" 
          src="${config.WP_BACKEND_URL}/embed/card/${postType}/${postId}" />
        `
      }}
      post={
        post && {
          title: post.title && post.title.rendered,
          content: post.content && post.content.rendered
        }
      }
    />
  );
}

Card.propTypes = {
  postId: propTypes.string.isRequired,
  postType: propTypes.string.isRequired,
  parentEl: propTypes.shape({
    style: propTypes.shape({
      width: propTypes.string
    }),
    getAttribute: propTypes.func,
    firstChild: propTypes.shape({
      scrollIntoView: propTypes.func
    })
  }).isRequired
};

export function Flourish({
  title,
  description,
  chartId,
  showInsight,
  insightSummary,
  insightTitle,
  dataLinkTitle,
  analysisCountry,
  dataGeoId,
  analysisLinkTitle
}) {
  const [chartDefinition, setChartDefinition] = useState({});
  useEffect(() => {
    fetch(`${config.WP_BACKEND_URL}/wp-json/hurumap-data/charts/${chartId}`)
      .then(res => res.json())
      .then(setChartDefinition);
  }, [chartId]);
  return (
    <FlourishChart
      title={title || chartDefinition.title}
      chartId={chartId}
      dataGeoId={dataGeoId}
      description={description || chartDefinition.description}
      showInsight={showInsight}
      insightSummary={insightSummary}
      insightTitle={insightTitle}
      dataLinkTitle={dataLinkTitle}
      analysisCountry={analysisCountry}
      analysisLinkTitle={analysisLinkTitle}
      // eslint-disable-next-line react/jsx-no-bind
      handleShare={shareIndicator.bind(null, chartId)}
      embedCode={`
      <iframe title="${title || chartDefinition.title}" 
        src="${config.WP_BACKEND_URL}/embed/flourish/${chartId}" />
      `}
    />
  );
}

Flourish.propTypes = {
  parentEl: propTypes.shape({
    style: propTypes.shape({
      width: propTypes.string
    }),
    getAttribute: propTypes.func,
    firstChild: propTypes.shape({
      scrollIntoView: propTypes.func
    })
  }).isRequired,
  chartId: propTypes.string.isRequired,
  title: propTypes.string.isRequired,
  description: propTypes.string.isRequired,
  showInsight: propTypes.bool.isRequired,
  insightSummary: propTypes.string.isRequired,
  insightTitle: propTypes.string.isRequired,
  analysisCountry: propTypes.string.isRequired,
  analysisLinkTitle: propTypes.string.isRequired,
  dataLinkTitle: propTypes.string.isRequired,
  dataGeoId: propTypes.string.isRequired
};

export function HURUmap({
  chartWidth,
  chartId,
  geoId,
  showInsight,
  showStatVisual,
  insightSummary,
  insightTitle,
  analysisCountry,
  analysisLinkTitle,
  dataLinkTitle,
  dataGeoId
}) {
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: 'https://graphql.takwimu.africa/graphql'
      }),
    []
  );
  const [chartDefinition, setChartDefinition] = useState({});
  useEffect(() => {
    fetch(`${config.WP_BACKEND_URL}/wp-json/hurumap-data/charts/${chartId}`)
      .then(res => res.json())
      .then(setChartDefinition);
  }, [chartId]);
  return (
    <ApolloProvider client={client}>
      <HURUmapChart
        geoId={geoId}
        chartId={chartId}
        chartWidth={chartWidth}
        dataGeoId={dataGeoId}
        showInsight={showInsight}
        insightSummary={insightSummary}
        insightTitle={insightTitle}
        showStatVisual={showStatVisual}
        dataLinkTitle={dataLinkTitle}
        analysisCountry={analysisCountry}
        analysisLinkTitle={analysisLinkTitle}
        // eslint-disable-next-line react/jsx-no-bind
        handleShare={shareIndicator.bind(null, chartId)}
        chart={
          chartDefinition && {
            ...chartDefinition,
            visual: {
              ...chartDefinition.visual,
              queryAlias: 'viz'
            },
            stat: {
              ...chartDefinition.stat,
              queryAlias: 'viz'
            }
          }
        }
        embedCode={`
        <iframe title="${chartDefinition.title}" 
          src="${config.WP_BACKEND_URL}/embed/hurumap/${geoId}/${chartId}" />
        `}
      />
    </ApolloProvider>
  );
}

HURUmap.propTypes = {
  parentEl: propTypes.shape({
    style: propTypes.shape({
      width: propTypes.string
    }),
    getAttribute: propTypes.func,
    firstChild: propTypes.shape({
      scrollIntoView: propTypes.func
    })
  }).isRequired,
  chartWidth: propTypes.string.isRequired,
  chartId: propTypes.string.isRequired,
  geoId: propTypes.string.isRequired,
  showInsight: propTypes.bool.isRequired,
  showStatVisual: propTypes.bool.isRequired,
  insightSummary: propTypes.string.isRequired,
  insightTitle: propTypes.string.isRequired,
  analysisCountry: propTypes.string.isRequired,
  analysisLinkTitle: propTypes.string.isRequired,
  dataLinkTitle: propTypes.string.isRequired,
  dataGeoId: propTypes.string.isRequired
};
