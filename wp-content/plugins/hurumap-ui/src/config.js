const config = {
  url:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://takwimu.africa",
  country: {},
  countries: [
    {
      iso_code: "BF",
      name: "Burkina Faso",
      iso_name: "Burkina Faso",
      short_name: "Burkina Faso",
      slug: "burkina-faso",
      published: true
    },
    {
      iso_code: "CD",
      name: "Democratic Republic of Congo",
      iso_name: "Congo, the Democratic Republic of the",
      short_name: "DR Congo",
      slug: "democratic-republic-of-congo",
      published: true
    },
    {
      iso_code: "ET",
      name: "Ethiopia",
      iso_name: "Ethiopia",
      short_name: "Ethiopia",
      slug: "ethiopia",
      published: true
    },
    {
      iso_code: "KE",
      name: "Kenya",
      iso_name: "Kenya",
      short_name: "Kenya",
      slug: "kenya",
      published: true
    },
    {
      iso_code: "NG",
      name: "Nigeria",
      iso_name: "Nigeria",
      short_name: "Nigeria",
      slug: "nigeria",
      published: true
    },
    {
      iso_code: "SN",
      name: "Senegal",
      iso_name: "Senegal",
      short_name: "Senegal",
      slug: "senegal",
      published: true
    },
    {
      iso_code: "ZA",
      name: "South Africa",
      iso_name: "South Africa",
      short_name: "South Africa",
      slug: "south-africa",
      published: true
    },
    {
      iso_code: "TZ",
      name: "Tanzania",
      iso_name: "Tanzania, United Republic of",
      short_name: "Tanzania",
      slug: "tanzania",
      published: true
    },
    {
      iso_code: "UG",
      name: "Uganda",
      iso_name: "Uganda",
      short_name: "Uganda",
      slug: "uganda",
      published: true
    },
    {
      iso_code: "ZM",
      name: "Zambia",
      iso_name: "Zambia",
      short_name: "Zambia",
      slug: "zambia",
      published: true
    }
  ],
  settings: {
    navigation: {
      country_analysis:
        '<div class="rich-text"><p>Actionable analysis by geo-political and socioeconomic experts across 10 African countries.</p></div>',
      data_by_topic:
        '<div class="rich-text"><p>Key Human Development metrics curated and visualised across 10 African countries.</p></div>'
    },
    support: {
      hello: "hello@takwimu.africa",
      support: "support@takwimu.africa"
    },
    socialMedia: {
      facebook: "https://facebook.com/TakwimuAfrica",
      twitter: "https://twitter.com/TakwimuAfrica",
      medium: "https://medium.com/@takwimu_africa",
      linkedin: "https://www.linkedin.com/company/takwimu-africa/"
    }
  },
  page: {
    name: "base",
    first_published_at: "10th April 2019",
    last_published_at: "24th July 2019"
  }
};

// Same-Origin Policy
// document.domain = new URL(config.url).hostname;

export default config;
