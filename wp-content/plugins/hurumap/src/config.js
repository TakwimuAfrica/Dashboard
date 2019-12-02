const config = {
  countries: [
    {
      iso_code: 'BF',
      name: 'Burkina Faso',
      iso_name: 'Burkina Faso',
      short_name: 'Burkina Faso',
      slug: 'burkina-faso',
      published: true
    },
    {
      iso_code: 'CD',
      name: 'Democratic Republic of Congo',
      iso_name: 'Congo, the Democratic Republic of the',
      short_name: 'DR Congo',
      slug: 'democratic-republic-of-congo',
      published: true
    },
    {
      iso_code: 'ET',
      name: 'Ethiopia',
      iso_name: 'Ethiopia',
      short_name: 'Ethiopia',
      slug: 'ethiopia',
      published: true
    },
    {
      iso_code: 'KE',
      name: 'Kenya',
      iso_name: 'Kenya',
      short_name: 'Kenya',
      slug: 'kenya',
      published: true
    },
    {
      iso_code: 'NG',
      name: 'Nigeria',
      iso_name: 'Nigeria',
      short_name: 'Nigeria',
      slug: 'nigeria',
      published: true
    },
    {
      iso_code: 'SN',
      name: 'Senegal',
      iso_name: 'Senegal',
      short_name: 'Senegal',
      slug: 'senegal',
      published: true
    },
    {
      iso_code: 'ZA',
      name: 'South Africa',
      iso_name: 'South Africa',
      short_name: 'South Africa',
      slug: 'south-africa',
      published: true
    },
    {
      iso_code: 'TZ',
      name: 'Tanzania',
      iso_name: 'Tanzania, United Republic of',
      short_name: 'Tanzania',
      slug: 'tanzania',
      published: true
    },
    {
      iso_code: 'UG',
      name: 'Uganda',
      iso_name: 'Uganda',
      short_name: 'Uganda',
      slug: 'uganda',
      published: true
    },
    {
      iso_code: 'ZM',
      name: 'Zambia',
      iso_name: 'Zambia',
      short_name: 'Zambia',
      slug: 'zambia',
      published: true
    }
  ],
  WP_BACKEND_URL:
    // eslint-disable-next-line no-nested-ternary
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8080'
      : process.env.NODE_ENV === 'staging'
      ? 'https://takwimutech.wpengine.com'
      : 'https://dashboard.takwimu.africa'
};

export default config;
