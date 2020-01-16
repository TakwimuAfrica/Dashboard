import { useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { buildDataCountQuery } from '../data/queries';

export default (geoId, charts) => {
  const client = useApolloClient();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (!geoId) {
      return;
    }

    (async () => {
      const { data } = await client.query({
        query: buildDataCountQuery(charts),
        variables: {
          geoCode: geoId.split('-')[1],
          geoLevel: geoId.split('-')[0]
        }
      });

      setFiltered(
        charts
          .filter(({ visual: { table } }) => data[table].totalCount !== 0)
          .map(chart => ({
            label: chart.title,
            value: chart.id
          }))
      );
    })();
  }, [client, charts, geoId]);

  return filtered;
};
