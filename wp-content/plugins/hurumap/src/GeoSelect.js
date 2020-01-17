import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import Select from 'react-select';
import propTypes from './propTypes';

import { GET_GEOGRAPHIES, buildDataCountQueryWithGeos } from './data/queries';

function GeoSelect({ placeholder, table, onChange, handleChartGeos }) {
  const client = useApolloClient();
  const [geographies, setGeographies] = useState([]);
  const [selected, setSelected] = useState(null);

  const availableGeographies = useRef(onChange);
  useEffect(() => {
    availableGeographies.current = handleChartGeos;
  }, [handleChartGeos]);

  const { data: options } = useQuery(GET_GEOGRAPHIES);
  useEffect(() => {
    (async () => {
      if (table && options && options.geos && options.geos.nodes) {
        const { data } = await client.query({
          query: buildDataCountQueryWithGeos(options.geos.nodes, table)
        });

        // Store loaded geographies
        const geos = options.geos.nodes.filter(
          geo => data[geo.geoCode].totalCount !== 0
        );
        setGeographies(geos);
        availableGeographies.current({ inGeographies: geos });
        // Set initial geo
        setSelected(prevGeo =>
          prevGeo && geos.find(x => x.geoCode === prevGeo.geoCode)
            ? prevGeo
            : geos.length && {
                label: geos[0].name,
                value: `${geos[0].geoLevel}-${geos[0].geoCode}`
              }
        );
      }
    })();
  }, [table, client, options, availableGeographies]);

  useEffect(() => {
    if (onChange) {
      onChange(selected && selected.value);
    }
  }, [onChange, selected]);

  return (
    <Select
      isDisabled={geographies.length === 0}
      placeholder={placeholder}
      value={selected}
      options={
        geographies
          ? geographies.map(geo => ({
              label: geo.name,
              value: `${geo.geoLevel}-${geo.geoCode}`
            }))
          : []
      }
      onChange={setSelected}
    />
  );
}

GeoSelect.propTypes = {
  onChange: propTypes.func.isRequired,
  handleChartGeos: propTypes.func.isRequired,
  table: propTypes.string,
  placeholder: propTypes.string
};

GeoSelect.defaultProps = {
  table: '',
  placeholder: 'Select Geography'
};

export default GeoSelect;
