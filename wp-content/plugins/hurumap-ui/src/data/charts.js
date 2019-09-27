module.exports = [
  {
    sectionTitle: "Demographics",
    sectionIcon: "users",
    sectionDescription: "",
    charts: [
      {
        title: "Population by Sex",
        visual: {
          type: "pie",
          table: "allPopulationSex2006S",
          x: "populationSex2006",
          y: "total",
          id: "visual-XJxJbHj7"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-9zCsLYIX"
        },
        id: "chart-OXOrBg8t"
      },
      {
        title: "Population by Sex",
        visual: {
          type: "pie",
          table: "allPopulationSex2007S",
          x: "populationSex2007",
          y: "total",
          id: "visual-RbgZ1DUJ"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-2QJnW-Wm"
        },
        id: "chart-jCpNkVRH"
      },
      {
        title: "Population by Sex",
        visual: {
          type: "pie",
          table: "allPopulationSex2009S",
          x: "populationSex2009",
          y: "total",
          id: "visual-5GuZSLc7"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-VmubCwpV"
        },
        id: "chart-JnFGC4vp"
      },
      {
        title: "Population by Sex",
        visual: {
          type: "pie",
          table: "allPopulationSex2011S",
          x: "populationSex2011",
          y: "total",
          id: "visual-jmRK7piY"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-0wFXYq7W"
        },
        id: "chart-puRwDdfW"
      },
      {
        title: "Population by Sex",
        visual: {
          type: "pie",
          table: "allPopulationSex2012S",
          x: "populationSex2012",
          y: "total",
          id: "visual-DQz2J4n7"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-_zs8KAwm"
        },
        id: "chart-PftEYOw8"
      },
      {
        title: "Population by Sex",
        visual: {
          type: "pie",
          table: "allPopulationSex2013S",
          x: "populationSex2013",
          y: "total",
          id: "visual-6IelI_47_"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-I1O_3lGm7"
        },
        id: "chart-aL6bwKusJ"
      },
      {
        title: "Population by Sex per year",
        visual: {
          type: "grouped_column",
          table: "allPopulationSexYears",
          x: "populationSex",
          groupBy: "populationYear",
          y: "total",
          aggregate: "sum",
          id: "visual-de5U0FSxq"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "last",
            unique: true
          },
          id: "stat-7Qx7ETH0f"
        },
        id: "chart-B_2N04vyq"
      },
      {
        title: "Population by Residence",
        visual: {
          type: "column",
          table: "allPopulationResidence2009S",
          x: "populationResidence2009",
          y: "total",
          id: "visual-yK5rShqQU"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum",
            unique: true
          },
          id: "stat-l_DkKYdu7"
        },
        id: "chart-nChGuiAIB"
      },
      {
        title: "Population by Residence",
        visual: {
          type: "column",
          table: "allPopulationResidence2012S",
          x: "populationResidence2012",
          y: "total",
          id: "visual-8nxH1Wzjm"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum"
          },
          id: "stat-yujN_xpRb"
        },
        id: "chart-kVVZoPIYV"
      },
      {
        title: "Population by Residence",
        visual: {
          type: "column",
          table: "allPopulationResidence2013S",
          x: "populationResidence2013",
          y: "total",
          id: "visual-Q81z9TyyJ"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-m2e1kZ4U3"
        },
        id: "chart-kyvGaTSjz"
      },
      {
        title: "Youth Unemployment Sex per year",
        visual: {
          type: "grouped_column",
          table: "allYouthUnemployments",
          groupBy: "youthUnemploymentYear",
          x: "sex",
          y: "total",
          aggregate: "sum",
          id: "visual-AfNlXt4Sr"
        },
        stat: {
          type: "number",
          subtitle: "Unemployment",
          description: "% of labour force ages 15-24",
          statistic: {
            unique: true,
            aggregate: "last"
          },
          id: "stat-PgESSkqNi"
        },
        id: "chart-w3Zkjt5YS"
      },
      {
        title: "Youth Unemployment",
        visual: {
          type: "column",
          table: "allYouthUnemploymentGenerals",
          x: "youthUnemploymentPeriod",
          y: "total",
          id: "visual-7ePmadnw4"
        },
        stat: {
          type: "number",
          subtitle: "Population",
          description: "People",
          statistic: {
            unique: true,
            aggregate: "last"
          },
          id: "stat-D3Pg_7_SC"
        },
        id: "chart-0ObxlR5E4"
      },
      {
        title: "Employment to population ratio, 15+ (%) (modeled ILO estimate)",
        visual: {
          type: "grouped_column",
          table: "allEmploymentToPopulationRatios",
          groupBy: "employmentToPopulationRatioYear",
          x: "sex",
          y: "total",
          aggregate: "sum",
          id: "visual-r2i5qbnrj"
        },
        stat: {
          type: "number",
          subtitle: "Employment",
          description: "Employment Ratio",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-jUkONCR_-"
        },
        id: "chart-Cp-GP6L4-"
      },
      {
        title: "Percentage of population in poverty",
        visual: {
          type: "grouped_column",
          table: "allResidencePovertyTypes",
          x: "residence",
          groupBy: "povertyType",
          y: "total",
          aggregate: "sum",
          id: "visual-33dwKjP6_"
        },
        stat: {
          type: "number",
          subtitle: "Percentage of Population",
          description: "",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-1zlssCY7y"
        },
        id: "chart-VQl3Q8Zkj"
      },
      {
        title:
          "Percentage of population living in poverty by age and residence",
        visual: {
          type: "grouped_column",
          table: "allPovertyAgeResidences",
          x: "residence",
          groupBy: "age",
          y: "total",
          aggregate: "sum",
          id: "visual-0bfC0wSuc"
        },
        stat: {
          type: "number",
          subtitle: "Percentage Population",
          description: "",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-r24l90dDf"
        },
        id: "chart-ZKG0OTCj_"
      },
      {
        title: "Human Development Indices",
        visual: {
          type: "column",
          table: "allHumanDevIndices",
          x: "humanDevIndices",
          y: "total",
          id: "visual-2xd-3z9Dd"
        },
        stat: {
          type: "number",
          subtitle: "HDI",
          description: "",
          statistic: {
            aggregate: "sum"
          },
          id: "stat-sgMgytSz2"
        },
        id: "chart-0lqx-TKlt"
      }
    ],
    id: "section-v5bGz4M"
  },
  {
    sectionTitle: "Elections",
    charts: [
      {
        title: "Valid vs invalid votes",
        visual: {
          type: "pie",
          table: "allValidInvalidVotes",
          x: "votes",
          y: "total",
          id: "visual-TPgvcLQoq"
        },
        stat: {
          type: "number",
          subtitle: "Elections",
          description: "Votes",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-6wIFHaap1"
        },
        id: "chart-XVRVUJ0fo"
      },
      {
        title: "Registered voters vs total votes cast",
        visual: {
          type: "pie",
          table: "allRegisteredAccreditedVoters",
          x: "voters",
          y: "total",
          id: "visual-75aCzBSRH"
        },
        stat: {
          type: "number",
          subtitle: "Elections",
          description: "Registered Voters",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-nlWEkm8pf"
        },
        id: "chart-7hXyn0JH9"
      },
      {
        title: "Votes per Candidate",
        visual: {
          type: "column",
          table: "allVotesPerCandidates",
          x: "candidate",
          y: "total",
          id: "visual-zVOtvzDJ7"
        },
        stat: {
          type: "number",
          subtitle: "Elections",
          description: "Cast Votes",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-JcwFlxUUD"
        },
        id: "chart-FtbmOujP4"
      },
      {
        title: "Proportion of seats held by women in national parliaments (%)",
        visual: {
          type: "column",
          table: "allWomenInParliaments",
          x: "womenParliamentYear",
          y: "total",
          id: "visual-neMow1qA4"
        },
        stat: {
          type: "number",
          subtitle: "Women In Parliament",
          description: "Seat Proportion",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-RUpViJ4Om"
        },
        id: "chart-c4YvJDlg7"
      },
      {
        title: "Position held by women in government",
        visual: {
          type: "column",
          table: "allWomenInGovernments",
          x: "position",
          y: "total",
          id: "visual-zTWMlaDmR"
        },
        stat: {
          type: "number",
          subtitle: "Women in Government",
          description: "Total Count",
          statistic: {
            aggregate: "sum"
          },
          id: "stat-FNIwu3e6n"
        },
        id: "chart-BVy7XqW1-"
      }
    ],
    id: "section-D7gJ8-P2Q"
  },
  {
    sectionTitle: "Health",
    charts: [
      {
        title:
          "People using at least basic drinking water services (% of population)",
        visual: {
          type: "column",
          table: "allAccessToBasicServices",
          x: "accessToBasicServicesYear",
          y: "total",
          id: "visual-rKreT767z"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Basic Dring Water Services",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-JxmJCZ7FF"
        },
        id: "chart-83mjLT06a"
      },
      {
        title:
          "Percent of households with access to water and electricity services",
        visual: {
          type: "column",
          table: "allAccessToElecWaterServices",
          x: "accessToElecWaterServices",
          y: "total",
          id: "visual-mP4mHhc3a"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-Ve430zAo5"
        },
        id: "chart-9KqhjUKgr"
      },
      {
        title: "Prevalence of undernourishment (% of population)",
        visual: {
          type: "column",
          table: "allPrevalenceOfUndernourishments",
          x: "prevalenceOfUndernourishmentYear",
          y: "total",
          id: "visual-deQuTcynB"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "undernourishment",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-lD3GchgUL"
        },
        id: "chart-3y7HI6SgN"
      },
      {
        title: "Life expectancy at birth (years)",
        visual: {
          type: "grouped_column",
          table: "allLifeExpectancyAtBirths",
          x: "sex",
          groupBy: "lifeExpectancyAtBirthYear",
          y: "total",
          aggregate: "sum",
          id: "visual-Rf-OW6kSH"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Life Expectancy",
          statistic: {
            unique: true
          },
          id: "stat-YrkRFlSkd"
        },
        id: "chart-YjeXUwUUl"
      },
      {
        title: "Prevalence of FGM among women aged 15 - 49 years",
        visual: {
          type: "column",
          table: "allPrevalenceFgms",
          x: "prevalenceFgm",
          y: "total",
          id: "visual-T_MLaY2MB"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "FGM Prevelance",
          statistic: {
            unique: true
          },
          id: "stat-maMVRIDe5"
        },
        id: "chart-2gFX61spg"
      },
      {
        title:
          "Maternal mortality ratio (modeled estimate, per 100,000 live births)",
        visual: {
          type: "column",
          table: "allMaternalMortalities",
          x: "maternalMortalityYear",
          y: "total",
          id: "visual-eMEgPOmp4"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Maternal Mortality Ratio",
          statistic: {
            unique: true
          },
          id: "stat-T3pav-8Ea"
        },
        id: "chart-yN51SNEqY"
      },
      {
        title: "Prevalence of HIV, (% ages 15-24)",
        visual: {
          type: "grouped_column",
          table: "allHivPrevalences",
          x: "sex",
          groupBy: "hivPrevalenceYear",
          y: "total",
          aggregate: "sum",
          id: "visual-HWvN9eMVo"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "HIV Prevalence -Youth",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-50LHnVx1_"
        },
        id: "chart-bmYXD8HlG"
      },
      {
        title: "Distribution of HIV Patients by Year and Sex 2015-2016",
        visual: {
          type: "grouped_column",
          table: "allHivPatientsDistributions",
          x: "sex",
          groupBy: "hivPatientsDistributionYear",
          y: "total",
          aggregate: "sum",
          id: "visual-re6Nks1BU"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "HIV Patients Distribution",
          statistic: {
            unique: true
          },
          id: "stat-lM8uHqxmi"
        },
        id: "chart-pH8Nuvx5G"
      },
      {
        title: "Prevalence of Malaria in Children - Number of children",
        visual: {
          type: "column",
          table: "allMalariaPrevalences",
          x: "malariaPrevalenceTest",
          y: "total",
          id: "visual-krL3lFllf"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Malaria in Children",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-hOopkb9uv"
        },
        id: "chart-rjYO5G1Af"
      },
      {
        title: "Births attended by skilled health staff (% of total)",
        visual: {
          type: "column",
          table: "allBirthsAttendedBySkilledHealthStaffs",
          x: "birthsAttendedBySkilledHealthStaffYear",
          y: "total",
          id: "visual--K-mlL1Cx"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Birth by skilled health staff",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-Eqns7M4tp"
        },
        id: "chart-fMOptjSbu"
      },
      {
        title: "Female Genital Mutilation Prevelence (%)",
        visual: {
          type: "column",
          table: "allFgmPrevalences",
          x: "fgmPrevalenceYear",
          y: "total",
          id: "visual-SVhCQFKpS"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "FGM Prevalence",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-UQMmHf9Rn"
        },
        id: "chart-EHr0m_PMg"
      },
      {
        title: "Nurses and midwives (per 1,000 people)",
        visual: {
          type: "column",
          table: "allNursesAndMidwives",
          x: "nursesAndMidwivesYear",
          y: "total",
          id: "visual-0HC4mvk3f"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Ratio of nurses and midwives per 1000 people",
          statistic: {
            unique: true
          },
          id: "stat-bsGzv4Dnk"
        },
        id: "chart-Psz0uktCv"
      },
      {
        title: "Incidence of malaria per 1000 population at risk",
        visual: {
          type: "column",
          table: "allIncidenceOfMalariaPer1000PopAtRisks",
          x: "incidenceOfMalariaPer1000PopAtRiskYear",
          y: "total",
          id: "visual-CTWii_doU"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Malaria Incidence",
          statistic: {
            unique: true
          },
          id: "stat-Pat8HjxXm"
        },
        id: "chart-S-D0awlXB"
      },
      {
        title: "Infant and Under 5 Mortality rate (per 1000 live births)",
        visual: {
          type: "grouped_column",
          table: "allInfantUnder5Mortalities",
          x: "infantUnder5",
          groupBy: "mortalityYear",
          y: "total",
          aggregate: "sum",
          id: "visual-yolAxJLNk"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Mortality Rate",
          statistic: {},
          id: "stat-UzaVlmvXN"
        },
        id: "chart-Ff-BMUdaD"
      },
      {
        title: "Health worker density and distribution",
        visual: {
          type: "grouped_column",
          table: "allHealthWorkersDistributions",
          x: "year",
          groupBy: "workers",
          y: "total",
          aggregate: "sum",
          id: "visual--_m4Avnlk"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Health Worker Density",
          statistic: {
            unique: true
          },
          id: "stat-rlUHL6eL8"
        },
        id: "chart-Wbwjw9JSD"
      },
      {
        title: "Number of Doctors by Year and Sex (2015-2017)",
        visual: {
          type: "grouped_column",
          table: "allNumberOfDoctorsYearSexes",
          x: "numberOfDoctorsSex",
          groupBy: "numberOfDoctorsYear",
          y: "total",
          aggregate: "sum",
          id: "visual-mUyX2XmRj"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Total Number of Doctors",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-GA9f2Rph3"
        },
        id: "chart-8txgWYxcZ"
      },
      {
        title: "Number of Dentists by Year and Sex (2015-2017)",
        visual: {
          type: "grouped_column",
          table: "allNumberOfDentistYearSexes",
          x: "numberOfDentistSex",
          groupBy: "numberOfDentistYear",
          y: "total",
          aggregate: "sum",
          id: "visual-CRy_jwUnc"
        },
        stat: {
          type: "number",
          subtitle: "Health",
          description: "Total Number of dentist",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-7Gq2u1we1"
        },
        id: "chart-y3SmRGPYc"
      }
    ],
    id: "section-6ZdGce1FU"
  },
  {
    sectionTitle: "Agriculture",
    charts: [
      {
        title: "Crop production in tonnes",
        visual: {
          type: "column",
          table: "allFoodProductions",
          x: "crops",
          y: "total",
          id: "visual-AY5UAjWcL"
        },
        stat: {
          type: "number",
          subtitle: "Agriculture",
          description: "Crop Production",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-xPTLmcL4x"
        },
        id: "chart-FXfaxKGm5"
      },
      {
        title: "Cereal yield in kg per hectare (Thousands)",
        visual: {
          type: "column",
          table: "allCerealYieldKgPerHectares",
          x: "cerealYieldKgPerHectareYear",
          y: "total",
          id: "visual-Qf1Ym5cKB"
        },
        stat: {
          type: "number",
          subtitle: "Agriculture",
          description: "Cereal Yield (1997-2016)",
          statistic: {
            aggregate: "sum",
            unique: false
          },
          id: "stat-unjSs8hAP"
        },
        id: "chart-ZjYHHIhLi"
      },
      {
        title: "Agricultural land (% of land area)",
        visual: {
          type: "column",
          table: "allAgriculturalLands",
          x: "agriculturalLandYear",
          y: "total",
          id: "visual-fm897wsXV"
        },
        stat: {
          type: "number",
          subtitle: "Agriculture",
          description: "Land",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-83KKJIHOx"
        },
        id: "chart-g10fwaaCN"
      },
      {
        title: "Employment in agriculture (% of male vs female employment)",
        visual: {
          type: "grouped_column",
          table: "allEmploymentInAgricultures",
          x: "sex",
          groupBy: "employmentInAgricultureYear",
          y: "total",
          aggregate: "sum",
          id: "visual-vgDM08G5C"
        },
        stat: {
          type: "number",
          subtitle: "Agriculture",
          description: "Employment",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-X25JYxSD9"
        },
        id: "chart-AiWHkhTjM"
      }
    ],
    id: "section-M7GQCg6VF"
  },
  {
    sectionTitle: "Education",
    sectionDescription: "",
    charts: [
      {
        title: "Primary School enrollment, Female and Male (% gross)",
        visual: {
          type: "grouped_column",
          table: "allPrimarySchoolEnrollments",
          x: "sex",
          groupBy: "primarySchoolEnrollmentYear",
          y: "total",
          aggregate: "sum",
          id: "visual-C2LVyvrXJ"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "People",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-SKrplhnhq"
        },
        id: "chart-aTGOJd56v"
      },
      {
        title: "Literacy rate, adult (% of population ages 15 and above)",
        visual: {
          type: "grouped_column",
          table: "allAdultLiteracyRates",
          x: "sex",
          groupBy: "adultLiteracyRateYear",
          y: "total",
          aggregate: "sum",
          id: "visual-yXUiLmKVw"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "Adult Literacy Rate",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-Rx65Mt-md"
        },
        id: "chart-XxfE08Xx2"
      },
      {
        title:
          "Percentage of Women and Men age 15-24 years who are literate by Sex, 2016/17",
        visual: {
          type: "column",
          table: "allLiteracySexes",
          x: "sex",
          y: "total",
          id: "visual-XOQWElkQ8"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "Literate",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-AGV0LBBA4"
        },
        id: "chart-ZXg3tihfU"
      },
      {
        title: "Primary completion rate,(% of relevant age group)",
        visual: {
          type: "column",
          table: "allPrimaryEducationCompletionRates",
          x: "primaryEducationCompletionRateYear",
          y: "total",
          id: "visual-GQItDi5Mu"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "Primary Education completion Rate",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-Nc_6kBn9v"
        },
        id: "chart-KoLwjKP7k"
      },
      {
        title:
          "Percentage Distribution of Enrolment in Primary Schools by Year and Sex, 2015 -2016",
        visual: {
          type: "grouped_column",
          table: "allPrimarySchoolEnrollmentDistributions",
          x: "sex",
          groupBy: "primarySchoolEnrollmentYear",
          aggregate: "sum",
          y: "total",
          id: "visual--8yMvvZVJ"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "Primary School Enrolment",
          statistic: {
            aggregate: "sum",
            unique: true,
            unit: "%"
          },
          id: "stat-zX-bx8bOv"
        },
        id: "chart-CjGs2smTy"
      },
      {
        title:
          "Distribution of Enrolment in Junior Secondary School by Year and sex, 2015 -2016",
        visual: {
          type: "grouped_column",
          table: "allJuniorSecondarySchoolEnrollments",
          x: "sex",
          groupBy: "juniorSecondarySchoolEnrollmentYear",
          aggregate: "sum",
          y: "total",
          id: "visual-GexJ0Z1Xc"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "Junior Secondary Enrolment",
          statistic: {
            aggregate: "sum",
            unique: true,
            unit: "%"
          },
          id: "stat-pTCiIoo0X"
        },
        id: "chart-0o-ck-Y8Y"
      },
      {
        title:
          "Distribution of Enrolment in Senior Secondary School by State, Year and Sex, 2015 -2016",
        visual: {
          type: "grouped_column",
          table: "allSeniorSecondarySchoolEnrollments",
          x: "sex",
          groupBy: "seniorSecondarySchoolEnrollmentYear",
          aggregate: "sum",
          y: "total",
          id: "visual-pk3mL-Icy"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "Senior Secondary Enrolment",
          statistic: {
            aggregate: "sum",
            unique: true,
            unit: "%"
          },
          id: "stat-cOiepWkCc"
        },
        id: "chart-yvXIpD18F"
      },
      {
        title: "School enrollment, secondary (% gross)",
        visual: {
          type: "grouped_column",
          table: "allSecondarySchoolEnrollments",
          x: "sex",
          groupBy: "secondarySchoolEnrollmentYear",
          y: "total",
          aggregate: "sum",
          id: "visual-g-HjbDKTT"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "Secondary Enrolment",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-_hz3jcZ28"
        },
        id: "chart-df4LROXqA"
      },
      {
        title: "Primary Completion rate (%)",
        visual: {
          type: "column",
          table: "allPrimaryEducationCompletionSexes",
          x: "primaryEducationCompletionSex",
          y: "total",
          id: "visual-uA1B2kEln"
        },
        stat: {
          type: "number",
          subtitle: "Education",
          description: "Percent Completion Rate",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-iA6dY3_78"
        },
        id: "chart-Me2AMe6YE"
      }
    ],
    id: "section-WuD7UVUtt"
  },
  {
    sectionTitle: "Financial Inclusion",
    sectionDescription: "",
    charts: [
      {
        title:
          "Account ownership at a financial institution or with a mobile-money-service provider, (% of population ages 15+)",
        visual: {
          type: "grouped_column",
          table: "allAccountOwnerships",
          x: "sex",
          groupBy: "accountOwnershipYear",
          y: "total",
          aggregate: "sum",
          id: "visual-QMnnL9H88"
        },
        stat: {
          type: "number",
          subtitle: "Financial Inclusion",
          description: "Account Ownership",
          statistic: {
            aggregate: "sum",
            unique: true,
            unit: "%"
          },
          id: "stat-Tr50yoJ5F"
        },
        id: "chart-2i66RH9nd"
      },
      {
        title:
          "Percentage of households where at least one member owns or has a Bank Account",
        visual: {
          type: "column",
          table: "allAccountOwnershipIndicators",
          x: "accountOwnershipYear",
          y: "total",
          id: "visual-vZA-Xx0Rx"
        },
        stat: {
          type: "number",
          subtitle: "Financial Inclusion",
          description: "Percent Completion Rate",
          statistic: {
            unique: true
          },
          id: "stat-Zzs9o7GbI"
        },
        id: "chart-84EKplBU2"
      },
      {
        title: "Mobile phone subscriptions (per 100 people)",
        visual: {
          type: "column",
          table: "allMobilePhoneSubscriptions",
          x: "mobilePhoneSubscriptionsYear",
          y: "total",
          id: "visual-xBZLAGfu6"
        },
        stat: {
          type: "number",
          subtitle: "Financial Inclusion",
          description: "Mobile Phone subscriptions",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-_wwYZdyPN"
        },
        id: "chart-JRuWq_pyp"
      }
    ],
    id: "section-Atgc7ZfPP"
  },
  {
    sectionTitle: "Budget",
    sectionDescription: "",
    charts: [
      {
        title: "Government spending",
        visual: {
          type: "grouped_column",
          table: "allGovernmentFundings",
          x: "sector",
          groupBy: "year",
          y: "total",
          aggregate: "sum",
          id: "visual-bZ9J1Koqj"
        },
        stat: {
          type: "number",
          subtitle: "Budget",
          description: "Government spending",
          statistic: {
            aggregate: "sum",
            unique: true,
            unit: "%"
          },
          id: "stat-ZHRHpRME-"
        },
        id: "chart-5ndLPl_g0"
      }
    ],
    id: "section-nV9D-mx1D"
  },
  {
    sectionTitle: "Public Finances",
    sectionDescription: "",
    charts: [
      {
        title: "GINI Index",
        visual: {
          type: "column",
          table: "allGiniIndices",
          x: "giniIndexYear",
          y: "total",
          id: "visual-SggYnLbcW"
        },
        stat: {
          type: "number",
          subtitle: "Public Finances",
          description: "Gini Index",
          statistic: {
            unique: true
          },
          id: "stat-uRytKMGdE"
        },
        id: "chart-ykz9ztbIF"
      },
      {
        title: "GDP per capita (current US$)",
        visual: {
          type: "column",
          table: "allGdpPerCapitas",
          x: "gdpPerCapitaYear",
          y: "total",
          id: "visual-p8dERxcAL"
        },
        stat: {
          type: "number",
          subtitle: "Public Finances",
          description: "GDP per capita",
          statistic: {
            unique: true
          },
          id: "stat-uHKWMqlJk"
        },
        id: "chart-mEMVS_bKc"
      },
      {
        title: "GDP per capita growth (annual %)",
        visual: {
          type: "column",
          table: "allGdpPerCapitaGrowths",
          x: "gdpPerCapitaGrowthYear",
          y: "total",
          id: "visual-e_hgydv78"
        },
        stat: {
          type: "number",
          subtitle: "Public Finances",
          description: "GDP per capita Growth",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-U6nFwAcP6"
        },
        id: "chart-FiED1wEBG"
      },
      {
        title: "Tax as percentage of GDP",
        visual: {
          type: "column",
          table: "allTaxAsPercentageOfGdps",
          x: "taxAsPercentageOfGdpYear",
          y: "total",
          id: "visual-OtyQpAdzX"
        },
        stat: {
          type: "number",
          subtitle: "Public Finances",
          description: "Tax (% GDP)",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-O3yMLyi7W"
        },
        id: "chart-tcme7PdDY"
      },
      {
        title: "Tax revenue (current LCU)",
        visual: {
          type: "column",
          table: "allTaxRevenues",
          x: "taxRevenueYear",
          y: "total",
          id: "visual-GV9l-rXRi"
        },
        stat: {
          type: "number",
          subtitle: "Public Finances",
          description: "Tax Revenue",
          statistic: {
            unique: true,
            unit: "US$"
          },
          id: "stat-yvV-LPxAr"
        },
        id: "chart-D2VkbJWYe"
      },
      {
        title: "GDP",
        visual: {
          type: "column",
          table: "allGdps",
          x: "gdpYear",
          y: "total",
          id: "visual-XH9LgCyGG"
        },
        stat: {
          type: "number",
          subtitle: "Public Finances",
          description: "GDP",
          statistic: {
            unique: true,
            unit: "US$"
          },
          id: "stat-5RJuRlx2Y"
        },
        id: "chart-Nxbu2Tps5"
      },
      {
        title: "GDP Growth",
        visual: {
          type: "column",
          table: "allGdpGrowths",
          x: "gdpGrowthYear",
          y: "total",
          id: "visual-ZvWdH9yYz"
        },
        stat: {
          type: "number",
          subtitle: "Public Finances",
          description: "GDP Growth",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat--2kYGzV-9"
        },
        id: "chart-r4l5ucyg6"
      }
    ],
    id: "section-Pc-bWeAI4"
  },
  {
    sectionTitle: "ODA",
    sectionDescription: "",
    charts: [
      {
        title: "Foreign direct investment, net inflows (% of GDP)",
        visual: {
          type: "column",
          table: "allForeignDirectInvestmentNetInflows",
          x: "foreignDirectInvestmentNetInflowsYear",
          y: "total",
          id: "visual-2iczA3njO"
        },
        stat: {
          type: "number",
          subtitle: "Development Assistance",
          description: "Net inflows",
          statistic: {
            unique: true,
            unit: "%"
          },
          id: "stat-JN0jhq1tl"
        },
        id: "chart-sz7KNbrrb"
      },
      {
        title: "Contribution by principal donor",
        visual: {
          type: "column",
          table: "allDonors",
          x: "donor",
          y: "total",
          id: "visual-hU1E8FVOd"
        },
        stat: {
          type: "number",
          subtitle: "Development Assistance",
          description: "Donor Contribution",
          statistic: {
            unique: false,
            aggregate: "sum"
          },
          id: "stat-ETYLsmiO9"
        },
        id: "chart-7XkfrkuzC"
      },
      {
        title: "Contribution by Worldbank & DFID per programme",
        visual: {
          type: "grouped_column",
          table: "allDonorFundedProgrammes",
          x: "programme",
          groupBy: "donor",
          y: "total",
          aggregate: "sum",
          id: "visual-L50E9twtI"
        },
        stat: {
          type: "number",
          subtitle: "Development Assistance",
          description: "Donor Contribution",
          statistic: {
            unique: true
          },
          id: "stat-ew3afyfkK"
        },
        id: "chart-tWCCdz8RV"
      }
    ],
    id: "section-Nf4PbTAv_"
  }
];
