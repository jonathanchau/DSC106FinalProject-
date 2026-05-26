const scenarios = [
  { label: "0.5 meter sea-level rise", key: "half" },
  { label: "1.0 meter sea-level rise", key: "one" },
  { label: "2.0 meter sea-level rise", key: "two" }
];

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
    emissionsScore: 1,
    exposure: { half: 48, one: 72, two: 89 },
    exposedPopulation: { half: 180000, one: 310000, two: 430000 },
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
    emissionsScore: 1,
    exposure: { half: 42, one: 66, two: 83 },
    exposedPopulation: { half: 3500, one: 6500, two: 9000 },
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
    emissionsScore: 1,
    exposure: { half: 35, one: 58, two: 78 },
    exposedPopulation: { half: 27000, one: 61000, two: 91000 },
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
    emissionsScore: 1,
    exposure: { half: 38, one: 61, two: 80 },
    exposedPopulation: { half: 12000, one: 24000, two: 33000 },
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
    emissionsScore: 2,
    exposure: { half: 18, one: 31, two: 49 },
    exposedPopulation: { half: 42000, one: 85000, two: 150000 },
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
    emissionsScore: 2,
    exposure: { half: 12, one: 24, two: 41 },
    exposedPopulation: { half: 25000, one: 62000, two: 118000 },
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
    emissionsScore: 2,
    exposure: { half: 9, one: 17, two: 30 },
    exposedPopulation: { half: 9800000, one: 22600000, two: 40500000 },
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
    emissionsScore: 4,
    exposure: { half: 7, one: 13, two: 22 },
    exposedPopulation: { half: 4200000, one: 9100000, two: 17100000 },
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
    emissionsScore: 2,
    exposure: { half: 10, one: 19, two: 34 },
    exposedPopulation: { half: 43000, one: 101000, two: 210000 },
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
    emissionsScore: 2,
    exposure: { half: 22, one: 39, two: 57 },
    exposedPopulation: { half: 15000, one: 31000, two: 52000 },
    summary: "An island country where coastal development and limited land make sea-level exposure especially visible."
  }
];

let scenarioIndex = 1;
let activeRegion = "All";
let selectedCountry = countries[0];
let worldFeatures = [];
let landFeature = null;
let bordersFeature = null;
let rotation = [-20, -12, 0];
let dragStart = null;
let renderRequest = null;

const mapSvg = d3.select("#world-svg");
const compareSvg = d3.select("#compare-svg");
const tooltip = d3.select("#tooltip");
const riseSlider = d3.select("#rise-slider");

function formatPopulation(value) {
  if (value >= 1000000) {
    return `${d3.format(".1f")(value / 1000000)}M`;
  }
  return `${d3.format(",")(Math.round(value / 1000))}K`;
}

function visibleCountries() {
  return countries.filter(d => activeRegion === "All" || d.region === activeRegion);
}

function buildCountryFeatureLookup(world) {
  worldFeatures = topojson.feature(world, world.objects.countries).features;
  landFeature = topojson.merge(world, world.objects.countries.geometries);
  bordersFeature = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);
  const featureById = new Map(worldFeatures.map(feature => [String(feature.id).padStart(3, "0"), feature]));

  worldFeatures.forEach(feature => {
    feature.properties.id = String(feature.id).padStart(3, "0");
  });

  countries.forEach(country => {
    const feature = featureById.get(country.id);
    if (feature) {
      country.feature = feature;
      country.centroid = d3.geoCentroid(feature);
    } else {
      country.centroid = [country.lon, country.lat];
    }
  });
}

function scheduleRenderMap() {
  if (renderRequest) {
    return;
  }
  renderRequest = requestAnimationFrame(() => {
    renderRequest = null;
    renderMap();
  });
}

function isPointVisible(point) {
  const center = [-rotation[0], -rotation[1]];
  return d3.geoDistance(point, center) < Math.PI / 2;
}

function renderMap() {
  const scenario = scenarios[scenarioIndex];
  const data = visibleCountries();
  const width = 980;
  const height = 560;
  const projection = d3.geoOrthographic()
    .translate([width / 2, height / 2])
    .scale(Math.min(width, height) * 0.43)
    .rotate(rotation)
    .clipAngle(90);
  const path = d3.geoPath(projection);
  const exposureColor = d3.scaleLinear()
    .domain([5, 35, 90])
    .range(["#8fc6bd", "#f0b35a", "#b84655"]);
  const radius = d3.scaleSqrt()
    .domain([0, d3.max(countries, d => d.exposedPopulation[scenario.key])])
    .range([5, 32]);

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
      .text("Loading actual country shapes...");
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

  const visibleNames = new Set(data.map(d => d.name));
  const markerPosition = d => projection(d.centroid || [d.lon, d.lat]);

  mapSvg.append("g")
    .append("path")
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
    .attr("fill", d => exposureColor(d.exposure[scenario.key]))
    .attr("stroke", d => d.name === selectedCountry.name ? "#17212b" : "#ffffff")
    .attr("stroke-width", d => d.name === selectedCountry.name ? 1.9 : 0.9)
    .attr("opacity", d => isPointVisible(d.centroid || [d.lon, d.lat]) ? 1 : 0)
    .attr("pointer-events", d => isPointVisible(d.centroid || [d.lon, d.lat]) ? "auto" : "none")
    .style("cursor", "pointer")
    .on("mouseenter focus click", (event, country) => {
      selectedCountry = country;
      renderDetails();
      renderMap();
      showTooltip(event, country);
    })
    .on("mousemove", (event, country) => showTooltip(event, country))
    .on("mouseleave", () => tooltip.classed("visible", false));

  const markers = mapSvg.append("g")
    .selectAll("circle")
    .data(data, d => d.name)
    .join("circle")
    .attr("cx", d => markerPosition(d)[0])
    .attr("cy", d => markerPosition(d)[1])
    .attr("r", d => radius(d.exposedPopulation[scenario.key]))
    .attr("fill", "none")
    .attr("stroke", d => d.name === selectedCountry.name ? "#17212b" : "#ffffff")
    .attr("stroke-width", d => d.name === selectedCountry.name ? 3.6 : 2)
    .attr("opacity", d => isPointVisible(d.centroid || [d.lon, d.lat]) ? 0.92 : 0)
    .attr("pointer-events", d => isPointVisible(d.centroid || [d.lon, d.lat]) ? "auto" : "none")
    .style("cursor", "pointer")
    .on("mouseenter focus click", (event, d) => {
      selectedCountry = d;
      renderDetails();
      renderMap();
      showTooltip(event, d);
    })
    .on("mousemove", (event, d) => showTooltip(event, d))
    .on("mouseleave", () => tooltip.classed("visible", false));

  markers.append("title").text(d => `${d.name}: ${d.exposure[scenario.key]}% exposed land`);

  mapSvg.call(d3.drag()
    .on("start", event => {
      dragStart = { rotation: [...rotation], x: event.x, y: event.y };
    })
    .on("drag", event => {
      if (!dragStart) {
        return;
      }
      const sensitivity = 0.55;
      rotation = [
        dragStart.rotation[0] + (event.x - dragStart.x) * sensitivity,
        Math.max(-70, Math.min(70, dragStart.rotation[1] - (event.y - dragStart.y) * sensitivity)),
        dragStart.rotation[2]
      ];
      scheduleRenderMap();
    })
    .on("end", () => {
      dragStart = null;
    }));

  mapSvg.append("text")
    .attr("x", 24)
    .attr("y", height - 24)
    .attr("fill", "#526471")
    .attr("font-size", 13)
    .attr("font-weight", 700)
    .text("Prototype map with sample country markers; final version will use cleaned real data.");

  const highest = d3.greatest(data, d => d.exposure[scenario.key]);
  d3.select("#scenario-title").text(scenario.label);
  d3.select("#highest-risk").text(highest ? highest.name : "None");
  d3.select("#visible-count").text(data.length);
}

function showTooltip(event, country) {
  const scenario = scenarios[scenarioIndex];
  tooltip
    .classed("visible", true)
    .style("left", `${event.offsetX + 16}px`)
    .style("top", `${event.offsetY + 16}px`)
    .html(`
      <strong>${country.name}</strong>
      <span>${country.region}</span>
      <span>${country.exposure[scenario.key]}% exposed land</span>
      <span>${formatPopulation(country.exposedPopulation[scenario.key])} people exposed</span>
    `);
}

function renderDetails() {
  const scenario = scenarios[scenarioIndex];
  d3.select("#country-title").text(selectedCountry.name);
  d3.select("#country-summary").text(selectedCountry.summary);
  d3.select("#country-region").text(selectedCountry.region);
  d3.select("#country-population").text(formatPopulation(selectedCountry.population));
  d3.select("#country-area").text(`${d3.format(",")(selectedCountry.area)} sq km`);
  d3.select("#country-exposure").text(`${selectedCountry.exposure[scenario.key]}%`);
  d3.select("#country-emissions").text(selectedCountry.emissions);
  d3.select("#insight-text").text(countryInsight(selectedCountry, scenario));
  renderComparison();
}

function countryInsight(country, scenario) {
  const exposure = country.exposure[scenario.key];
  const exposedPeople = country.exposedPopulation[scenario.key];
  if (country.name === "Bangladesh") {
    return `Bangladesh shows why population matters: ${exposure}% exposed land can still mean ${formatPopulation(exposedPeople)} people in harm's way because the country is so densely populated.`;
  }
  if (exposure >= 60 && country.emissionsScore <= 2) {
    return `${country.name} has ${exposure}% exposed land in this scenario while its emissions contribution is ${country.emissions.toLowerCase()}. This directly supports the project argument that climate risk and climate responsibility are unevenly distributed.`;
  }
  if (country.area < 1000) {
    return `${country.name} has very limited land area, so adaptation is not only about building seawalls. There may be few safe places to move people, roads, and services inland.`;
  }
  return `${country.name} shows a different kind of vulnerability: exposure depends on where people, infrastructure, and economic activity are concentrated, not just on total country size.`;
}

function rotateGlobe(deltaLon, deltaLat) {
  rotation = [
    rotation[0] + deltaLon,
    Math.max(-70, Math.min(70, rotation[1] + deltaLat)),
    rotation[2]
  ];
  renderMap();
}

function centerOnCountry(country) {
  const point = country.centroid || [country.lon, country.lat];
  rotation = [-point[0], -point[1], 0];
  renderMap();
}

function renderComparison() {
  const scenario = scenarios[scenarioIndex];
  const width = 320;
  const height = 230;
  const margin = { top: 16, right: 16, bottom: 74, left: 44 };
  const ranked = [...countries]
    .sort((a, b) => d3.descending(a.exposure[scenario.key], b.exposure[scenario.key]))
    .slice(0, 6);

  const x = d3.scaleBand()
    .domain(ranked.map(d => d.name))
    .range([margin.left, width - margin.right])
    .padding(0.28);
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([height - margin.bottom, margin.top]);

  compareSvg.attr("viewBox", `0 0 ${width} ${height}`);
  compareSvg.selectAll("*").remove();

  compareSvg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .call(g => g.selectAll("text")
      .attr("transform", "rotate(-35)")
      .attr("text-anchor", "end")
      .attr("font-weight", 700)
      .attr("font-size", 10));

  compareSvg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(4).tickFormat(d => `${d}%`))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("text").attr("font-weight", 700));

  compareSvg.selectAll("rect")
    .data(ranked)
    .join("rect")
    .attr("x", d => x(d.name))
    .attr("y", d => y(d.exposure[scenario.key]))
    .attr("width", x.bandwidth())
    .attr("height", d => y(0) - y(d.exposure[scenario.key]))
    .attr("rx", 4)
    .attr("fill", d => d.name === selectedCountry.name ? "#b84655" : "#8fc6bd");

  compareSvg.append("text")
    .attr("x", margin.left)
    .attr("y", 12)
    .attr("fill", "#607080")
    .attr("font-size", 11)
    .attr("font-weight", 800)
    .text("highest exposed land share");
}

riseSlider.on("input", event => {
  scenarioIndex = Number(event.target.value);
  renderDetails();
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
  renderDetails();
  renderMap();
});

d3.selectAll("[data-rotate]").on("click", event => {
  const direction = event.currentTarget.dataset.rotate;
  const steps = {
    left: [24, 0],
    right: [-24, 0],
    up: [0, -18],
    down: [0, 18]
  };
  rotateGlobe(...steps[direction]);
});

d3.select("#reset-globe").on("click", () => {
  rotation = [-20, -12, 0];
  renderMap();
});

d3.select("#center-selected").on("click", () => {
  centerOnCountry(selectedCountry);
});

renderDetails();
renderMap();

d3.json("data/countries-10m.json").then(world => {
  buildCountryFeatureLookup(world);
  renderDetails();
  renderMap();
}).catch(() => {
  mapSvg.selectAll("*").remove();
  mapSvg.append("text")
    .attr("x", 490)
    .attr("y", 280)
    .attr("text-anchor", "middle")
    .attr("fill", "#526471")
    .attr("font-size", 18)
    .attr("font-weight", 800)
    .text("Could not load local country geometry.");
});
