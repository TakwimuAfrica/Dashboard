import { useQuery } from '@apollo/react-hooks';
import { useMemo } from 'react';
import { GET_GEOGRAPHIES } from '../data/queries';

export default () => {
  const { data: options } = useQuery(GET_GEOGRAPHIES);
  return useMemo(
    () => ({
      options:
        options && options.geos
          ? options.geos.nodes.map(geo => ({
              label: geo.name,
              value: `${geo.geoLevel}-${geo.geoCode}`
            }))
          : [],
      geos: options && options.geos ? options.geos.nodes : []
    }),
    [options]
  );
};
