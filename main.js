const countries = [
  {
    name: "Maldives",
    id: "462",
    region: "Indian Ocean",
    lat: 3.2,
    lon: 73.2,
    population: 521000,
    area: 300,
    emissions: "Very low",
    exposureCurve: [
      [0, 0],
      [0.5, 48],
      [1, 72],
      [2, 89]
    ],
    summary: "A low-lying island nation where even moderate sea-level rise could expose a large share of land and population."
  },
  {
    name: "Tuvalu",
    id: "798",
    region: "Pacific",
    lat: -7.1,
    lon: 177.6,
    population: 11000,
    area: 26,
    emissions: "Very low",
    exposureCurve: [
      [0, 0],
      [0.5, 42],
      [1, 66],
      [2, 83]
    ],
    summary: "A small Pacific island country with very limited land area and little room to retreat inland."
  },
  {
    name: "Kiribati",
    id: "296",
    region: "Pacific",
    lat: 1.8,
    lon: -157.4,
    population: 131000,
    area: 811,
    emissions: "Very low",
    exposureCurve: [
      [0, 0],
      [0.5, 35],
      [1, 58],
      [2, 78]
    ],
    summary: "A nation of atolls spread across the Pacific, where elevation and distance make adaptation especially difficult."
  },
  {
    name: "Marshall Islands",
    id: "584",
    region: "Pacific",
    lat: 7.1,
    lon: 171.2,
    population: 42000,
    area: 181,
    emissions: "Very low",
    exposureCurve: [
      [0, 0],
      [0.5, 38],
      [1, 61],
      [2, 80]
    ],
    summary: "A low-lying island nation where land, infrastructure, and freshwater supplies are tightly connected to sea level."
  },
  {
    name: "Bahamas",
    id: "044",
    region: "Caribbean",
    lat: 25.0,
    lon: -77.4,
    population: 402000,
    area: 10010,
    emissions: "Low",
    exposureCurve: [
      [0, 0],
      [0.5, 18],
      [1, 31],
      [2, 49]
    ],
    summary: "A Caribbean archipelago where tourism, housing, and transport infrastructure are concentrated near the coast."
  },
  {
    name: "Belize",
    id: "084",
    region: "Caribbean",
    lat: 17.2,
    lon: -88.5,
    population: 405000,
    area: 22810,
    emissions: "Low",
    exposureCurve: [
      [0, 0],
      [0.5, 12],
      [1, 24],
      [2, 41]
    ],
    summary: "A coastal nation where sea-level rise threatens communities, wetlands, and reef-connected economies."
  },
  {
    name: "Bangladesh",
    id: "050",
    region: "Coastal Asia",
    lat: 23.7,
    lon: 90.4,
    population: 171000000,
    area: 130170,
    emissions: "Low per person",
    exposureCurve: [
      [0, 0],
      [0.5, 9],
      [1, 17],
      [2, 30]
    ],
    summary: "A densely populated delta country where a smaller exposed land share can still mean millions of people at risk."
  },
  {
    name: "Vietnam",
    id: "704",
    region: "Coastal Asia",
    lat: 14.1,
    lon: 108.3,
    population: 98100000,
    area: 313430,
    emissions: "Medium",
    exposureCurve: [
      [0, 0],
      [0.5, 7],
      [1, 13],
      [2, 22]
    ],
    summary: "A coastal and delta-rich country where sea-level rise could affect major agricultural and urban regions."
  },
  {
    name: "Fiji",
    id: "242",
    region: "Pacific",
    lat: -17.7,
    lon: 178.1,
    population: 925000,
    area: 18270,
    emissions: "Low",
    exposureCurve: [
      [0, 0],
      [0.5, 10],
      [1, 19],
      [2, 34]
    ],
    summary: "A Pacific island nation where exposure varies by island, settlement pattern, and available inland land."
  },
  {
    name: "Seychelles",
    id: "690",
    region: "Indian Ocean",
    lat: -4.7,
    lon: 55.5,
    population: 107000,
    area: 460,
    emissions: "Low",
    exposureCurve: [
      [0, 0],
      [0.5, 22],
      [1, 39],
      [2, 57]
    ],
    summary: "An island country where coastal development and limited land make sea-level exposure especially visible."
  }
];

let seaRise = 1;
let activeRegion = "All";
let selectedCountry = countries[0];
let previewCountry = null;
let worldFeatures = [];
let landFeature = null;
let bordersFeature = null;

const mapSvg = d3.select("#world-svg");
const tooltip = d3.select("#tooltip");
const riseSlider = d3.select("#rise-slider");

function formatPopulation(value) {
  if (value >= 1000000) {
    return `${d3.format(".1f")(value / 1000000)}M`;
  }
  return `${d3.format(",")(Math.round(value / 1000))}K`;
}

function exposureAt(country, rise) {
  const points = country.exposureCurve;
  if (rise <= points[0][0]) {
    return points[0][1];
  }

  for (let i = 1; i < points.length; i += 1) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    if (rise <= x2) {
      const t = (rise - x1) / (x2 - x1);
      return y1 + (y2 - y1) * t;
    }
  }

  return points[points.length - 1][1];
}

function impactFor(country) {
  const exposure = exposureAt(country, seaRise);
  return {
    exposure,
    area: country.area * exposure / 100,
    population: country.population * exposure / 100
  };
}

function visibleCountries() {
  return countries.filter(d => activeRegion === "All" || d.region === activeRegion);
}

function activeCountry() {
  return previewCountry || selectedCountry;
}

function previewSelection(country) {
  previewCountry = country;
  renderDetails(country);
  renderMap();
}

function clearPreview() {
  if (!previewCountry) {
    return;
  }
  previewCountry = null;
  tooltip.classed("visible", false);
  renderDetails(selectedCountry);
  renderMap();
}

function commitSelection(country) {
  selectedCountry = country;
  previewCountry = null;
  renderDetails(country);
  renderMap();
}

function buildCountryFeatureLookup(world) {
  worldFeatures = topojson.feature(world, world.objects.countries).features;
  landFeature = topojson.merge(world, world.objects.countries.geometries);
  bordersFeature = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);
  const featureById = new Map(worldFeatures.map(feature => [String(feature.id).padStart(3, "0"), feature]));

  countries.forEach(country => {
    const feature = featureById.get(country.id);
    country.feature = feature;
    country.centroid = feature ? d3.geoCentroid(feature) : [country.lon, country.lat];
  });
}

function renderMap() {
  const data = visibleCountries();
  const current = activeCountry();
  const width = 1100;
  const height = 620;
  const projection = d3.geoNaturalEarth1()
    .fitExtent([[20, 20], [width - 20, height - 20]], { type: "Sphere" });
  const path = d3.geoPath(projection);
  const exposureColor = d3.scaleLinear()
    .domain([0, 35, 90])
    .range(["#8fc6bd", "#f0b35a", "#b84655"]);
  const radius = d3.scaleSqrt()
    .domain([0, d3.max(countries, d => impactFor(d).population)])
    .range([4, 34]);

  mapSvg.attr("viewBox", `0 0 ${width} ${height}`);
  mapSvg.selectAll("*").remove();

  if (!worldFeatures.length) {
    mapSvg.append("text")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "#526471")
      .attr("font-size", 18)
      .attr("font-weight", 800)
      .text("Loading country map...");
    return;
  }

  mapSvg.append("path")
    .datum({ type: "Sphere" })
    .attr("d", path)
    .attr("fill", "#d7eef0");

  mapSvg.append("path")
    .datum(d3.geoGraticule10())
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.8)
    .attr("opacity", 0.65);

  mapSvg.append("path")
    .datum(landFeature)
    .attr("d", path)
    .attr("fill", "#e8dfc9")
    .attr("stroke", "#c8bfae")
    .attr("stroke-width", 0.7);

  mapSvg.append("path")
    .datum(bordersFeature)
    .attr("d", path)
    .attr("fill", "none")
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 0.45)
    .attr("opacity", 0.75);

  mapSvg.append("g")
    .selectAll("path")
    .data(data.filter(d => d.feature), d => d.name)
    .join("path")
    .attr("d", d => path(d.feature))
    .attr("fill", "none")
    .attr("stroke", d => d.name === current.name ? "#17212b" : "#ffffff")
    .attr("stroke-width", d => d.name === current.name ? 2.8 : 1)
    .style("cursor", "pointer")
    .on("mouseenter focus", (event, country) => {
      previewSelection(country);
      showTooltip(event, country);
    })
    .on("click", (event, country) => {
      commitSelection(country);
      showTooltip(event, country);
    })
    .on("mousemove", (event, country) => showTooltip(event, country))
    .on("mouseleave", clearPreview);

  const markers = mapSvg.append("g")
    .selectAll("circle")
    .data(data, d => d.name)
    .join("circle")
    .attr("cx", d => projection(d.centroid || [d.lon, d.lat])[0])
    .attr("cy", d => projection(d.centroid || [d.lon, d.lat])[1])
    .attr("r", d => radius(impactFor(d).population))
    .attr("fill", d => exposureColor(impactFor(d).exposure))
    .attr("fill-opacity", 0.74)
    .attr("stroke", d => d.name === current.name ? "#17212b" : "#ffffff")
    .attr("stroke-width", d => d.name === current.name ? 3.8 : 2)
    .style("cursor", "pointer")
    .on("mouseenter focus", (event, d) => {
      previewSelection(d);
      showTooltip(event, d);
    })
    .on("click", (event, d) => {
      commitSelection(d);
      showTooltip(event, d);
    })
    .on("mousemove", (event, d) => showTooltip(event, d))
    .on("mouseleave", clearPreview);

  const highest = d3.greatest(data, d => impactFor(d).exposure);
  d3.select("#scenario-title").text(`${seaRise.toFixed(1)} meter`);
  d3.select("#rise-value").text(`${seaRise.toFixed(1)} m`);
  d3.select("#highest-risk").text(highest ? highest.name : "None");
  d3.select("#visible-count").text(data.length);
}

function showTooltip(event, country) {
  const impact = impactFor(country);
  tooltip
    .classed("visible", true)
    .style("left", `${event.offsetX + 16}px`)
    .style("top", `${event.offsetY + 16}px`)
    .html(`
      <strong>${country.name}</strong>
      <span>${country.region}</span>
      <span>${d3.format(".1f")(impact.exposure)}% exposed land</span>
      <span>${formatPopulation(impact.population)} people exposed</span>
    `);
}

function renderDetails(country = activeCountry()) {
  const impact = impactFor(country);
  d3.select("#country-title").text(country.name);
  d3.select("#country-summary").text(country.summary);
  d3.select("#country-region").text(country.region);
  d3.select("#country-population").text(formatPopulation(country.population));
  d3.select("#country-area").text(`${d3.format(",")(country.area)} sq km`);
  d3.select("#country-exposure").text(`${d3.format(".1f")(impact.exposure)}%`);
  d3.select("#country-impacted-area").text(`${d3.format(",.0f")(impact.area)} sq km`);
  d3.select("#country-exposed-population").text(formatPopulation(impact.population));
  d3.select("#insight-text").text(countryInsight(country, impact));
}

function countryInsight(country, impact) {
  if (seaRise === 0) {
    return `At 0 meters of additional sea-level rise, this prototype estimates no new exposed land for ${country.name}. Move the slider to see how risk grows.`;
  }
  if (country.name === "Bangladesh") {
    return `At ${seaRise.toFixed(1)} meters, ${country.name} may expose ${formatPopulation(impact.population)} people. This shows why population matters as much as land share.`;
  }
  if (impact.exposure >= 55) {
    return `At ${seaRise.toFixed(1)} meters, ${country.name} faces extreme exposure: about ${d3.format(".1f")(impact.exposure)}% of land in this prototype estimate.`;
  }
  if (country.area < 1000) {
    return `${country.name} has limited land area, so even moderate exposure can create difficult choices about housing, infrastructure, and retreat.`;
  }
  return `${country.name} shows how sea-level risk depends on geography, population, and where communities are concentrated along the coast.`;
}

riseSlider.on("input", event => {
  seaRise = Number(event.target.value);
  renderDetails(activeCountry());
  renderMap();
});

d3.selectAll(".region").on("click", event => {
  activeRegion = event.currentTarget.dataset.region;
  d3.selectAll(".region").classed("active", false);
  d3.select(event.currentTarget).classed("active", true);
  const data = visibleCountries();
  if (!data.some(d => d.name === selectedCountry.name)) {
    selectedCountry = data[0] || countries[0];
  }
  previewCountry = null;
  renderDetails(selectedCountry);
  renderMap();
});

renderDetails();
renderMap();

d3.json("data/countries-10m.json").then(world => {
  buildCountryFeatureLookup(world);
  renderDetails(selectedCountry);
  renderMap();
}).catch(() => {
  mapSvg.selectAll("*").remove();
  mapSvg.append("text")
    .attr("x", 550)
    .attr("y", 310)
    .attr("text-anchor", "middle")
    .attr("fill", "#526471")
    .attr("font-size", 18)
    .attr("font-weight", 800)
    .text("Could not load local country geometry.");
});
