import { useState, useEffect } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { buildVisualsQuery, GET_PROFILE } from './queries';

import config from '../config';
import chartSources from './sources';

export default (geoId, visuals) => {
  const client = useApolloClient();
  const [chartData, setChartsData] = useState({
    isLoading: true
  });
  const [profiles, setProfiles] = useState({
    isLoading: true
  });

  useEffect(() => {
    if (geoId) {
      (async () => {
        setProfiles({
          isLoading: true
        });

        const {
          data: { geo: profile, ...populations }
        } = await client.query({
          query: GET_PROFILE,
          variables: {
            geoCode: geoId.split('-')[1],
            geoLevel: geoId.split('-')[0]
          }
        });

        const population = Object.values(populations).find(
          p => p.nodes.length > 0
        );
        profile.totalPopulation = population
          ? population.nodes.reduce((a, b) => a + b.total, 0)
          : 0;

        const {
          data: { geo: parent }
        } = await client.query({
          query: GET_PROFILE,
          variables: {
            geoCode: profile.parentCode,
            geoLevel: profile.parentLevel
          }
        });
        // set country name of profile
        let country;
        if (profile.geoLevel === 'country') {
          country = config.countries.find(c => c.iso_code === profile.geoCode);
        } else {
          // else we are on level1
          country = config.countries.find(c => c.iso_code === parent.geoCode);
        }

        setProfiles({
          isLoading: false,
          profile,
          parent,
          country
        });
      })();
    }
  }, [client, geoId]);

  useEffect(() => {
    if (!profiles.isLoading && visuals && visuals.length) {
      (async () => {
        setChartsData({
          isLoading: true
        });

        const parent = {
          geoLevel: profiles.parent.geoLevel,
          geoCode: profiles.parent.geoCode
        };
        const { data: profileVisualsData } = await client.query({
          query: buildVisualsQuery(visuals, parent),
          variables: {
            geoCode: profiles.profile.geoCode,
            geoLevel: profiles.profile.geoLevel
          }
        });

        const sources =
          chartSources[profiles.country.slug][profiles.profile.geoLevel];

        setChartsData({
          isLoading: false,
          profileVisualsData,
          sources
        });
      })();
    }
  }, [profiles, client, visuals]);

  return { profiles, chartData };
};
