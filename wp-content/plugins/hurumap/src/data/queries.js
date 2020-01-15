// A file that defines needed graphql queries
import gql from 'graphql-tag';

export const buildDataCountQuery = charts => gql`
  query dataCounts($geoCode: String!, $geoLevel: String!) {
    ${charts.map(
      ({ visual: { table } }) => `${table}(condition: {
      geoLevel: $geoLevel,
      geoCode: $geoCode
    }) {
      totalCount
    }`
    )}
  }
`;

export const buildDataCountQueryWithGeos = (geos, table) => gql`
  query dataCounts {
    ${geos.map(
      ({ geoCode, geoLevel }) => `${geoCode}: ${table}(condition: {
      geoLevel: "${geoLevel}",
      geoCode: "${geoCode}"
    }) {
      totalCount
    }`
    )}
  }
`;

export const GET_CHART_SOURCE = gql`
  query getChartSource(
    $geoLevel: String!
    $countryCode: String!
    $tableName: String!
  ) {
    src: allSources(
      condition: {
        geoLevel: $geoLevel
        countryCode: $countryCode
        tableName: $tableName
      }
    ) {
      nodes {
        title: sourceTitle
        href: sourceLink
      }
    }
  }
`;

export const GET_GEOGRAPHIES = gql`
  query geographies {
    geos: allWazimapGeographies(orderBy: NAME_ASC) {
      nodes {
        geoLevel
        geoCode
        squareKms
        parentLevel
        parentCode
        longName
        name
      }
    }
  }
`;
