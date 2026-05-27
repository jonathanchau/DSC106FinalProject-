const countries = [
  { name: "Maldives", id: "462", region: "Indian Ocean", lat: 3.2, lon: 73.2, population: 521000, area: 300, emissions: "Very low", exposureCurve: [[0, 0], [0.5, 48], [1, 72], [2, 89]], summary: "A low-lying island nation where even moderate sea-level rise could expose a large share of land and population." },
  { name: "Tuvalu", id: "798", region: "Pacific", lat: -7.1, lon: 177.6, population: 11000, area: 26, emissions: "Very low", exposureCurve: [[0, 0], [0.5, 42], [1, 66], [2, 83]], summary: "A small Pacific island country with very limited land area and little room to retreat inland." },
  { name: "Kiribati", id: "296", region: "Pacific", lat: 1.8, lon: -157.4, population: 131000, area: 811, emissions: "Very low", exposureCurve: [[0, 0], [0.5, 35], [1, 58], [2, 78]], summary: "A nation of atolls spread across the Pacific, where elevation and distance make adaptation especially difficult." },
  { name: "Marshall Islands", id: "584", region: "Pacific", lat: 7.1, lon: 171.2, population: 42000, area: 181, emissions: "Very low", exposureCurve: [[0, 0], [0.5, 38], [1, 61], [2, 80]], summary: "A low-lying island nation where land, infrastructure, and freshwater supplies are tightly connected to sea level." },
  { name: "Bahamas", id: "044", region: "Caribbean", lat: 25.0, lon: -77.4, population: 402000, area: 10010, emissions: "Low", exposureCurve: [[0, 0], [0.5, 18], [1, 31], [2, 49]], summary: "A Caribbean archipelago where tourism, housing, and transport infrastructure are concentrated near the coast." },
  { name: "Belize", id: "084", region: "Caribbean", lat: 17.2, lon: -88.5, population: 405000, area: 22810, emissions: "Low", exposureCurve: [[0, 0], [0.5, 12], [1, 24], [2, 41]], summary: "A coastal nation where sea-level rise threatens communities, wetlands, and reef-connected economies." },
  { name: "Bangladesh", id: "050", region: "Coastal Asia", lat: 23.7, lon: 90.4, population: 171000000, area: 130170, emissions: "Low per person", exposureCurve: [[0, 0], [0.5, 9], [1, 17], [2, 30]], summary: "A densely populated delta country where a smaller exposed land share can still mean millions of people at risk." },
  { name: "Vietnam", id: "704", region: "Coastal Asia", lat: 14.1, lon: 108.3, population: 98100000, area: 313430, emissions: "Medium", exposureCurve: [[0, 0], [0.5, 7], [1, 13], [2, 22]], summary: "A coastal and delta-rich country where sea-level rise could affect major agricultural and urban regions." },
  { name: "Fiji", id: "242", region: "Pacific", lat: -17.7, lon: 178.1, population: 925000, area: 18270, emissions: "Low", exposureCurve: [[0, 0], [0.5, 10], [1, 19], [2, 34]], summary: "A Pacific island nation where exposure varies by island, settlement pattern, and available inland land." },
  { name: "Seychelles", id: "690", region: "Indian Ocean", lat: -4.7, lon: 55.5, population: 107000, area: 460, emissions: "Low", exposureCurve: [[0, 0], [0.5, 22], [1, 39], [2, 57]], summary: "An island country where coastal development and limited land make sea-level exposure especially visible." }
];

let seaRise = 1.0;
let activeRegion = "All";
let selectedCountry = countries[0];
let previewCountry = null;
let worldFeatures = [];
let landFeature = null;
let bordersFeature = null;

const mapSvg = d3.select("#world-svg");
const scatterSvg = d3.select("#scatter-svg");
const tooltip = d3.select("#tooltip");

// 3D GLOBE PROJECTION SETUP
const mapWidth = 1100, mapHeight = 620;
const projection = d3.geoOrthographic()
  .scale(280)
  .translate([mapWidth / 2, mapHeight / 2])
  .clipAngle(90);
const path = d3.geoPath(projection);

// --- UTILS ---
function formatPopulation(value) {
  if (value >= 1000000) return `${d3.format(".1f")(value / 1000000)}M`;
  return `${d3.format(",")(Math.round(value / 1000))}K`;
}

function exposureAt(country, rise) {
  const points = country.exposureCurve;
  if (rise <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i += 1) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    if (rise <= x2) return y1 + (y2 - y1) * ((rise - x1) / (x2 - x1));
  }
  return points[points.length - 1][1];
}

function impactFor(country) {
  const exposure = exposureAt(country, seaRise);
  return { exposure, area: country.area * exposure / 100, population: country.population * exposure / 100 };
}

function visibleCountries() {
  return countries.filter(d => activeRegion === "All" || d.region === activeRegion);
}
function activeCountry() { return previewCountry || selectedCountry; }

// --- THE SPIN ENGINE ---
// --- THE OPTIMIZED SPIN ENGINE ---
function spinGlobeTo(country) {
  if (!country || !country.centroid) return;
  const targetLon = -country.centroid[0];
  const targetLat = -country.centroid[1];

  // 800ms is faster and feels snappier than 1200ms
  d3.transition().duration(800).ease(d3.easeQuadOut)
    .tween("rotate", function() {
      const r = d3.interpolate(projection.rotate(), [targetLon, targetLat, 0]);
      return function(t) {
        projection.rotate(r(t));
        
        // OPTIMIZATION 1: Only redraw the land and graticule. Leave the ocean alone!
        mapSvg.select(".land").attr("d", path);
        mapSvg.select(".graticule").attr("d", path);
        
        // OPTIMIZATION 2: Cache the current rotation center so we don't calculate it 50 times per frame
        const currentRot = projection.rotate();
        const center = [-currentRot[0], -currentRot[1]];

        mapSvg.selectAll(".map-bubble")
          .attr("cx", d => projection(d.centroid)[0])
          .attr("cy", d => projection(d.centroid)[1])
          // Use a raw math threshold (1.57 is ~90 degrees) instead of calling the heavy geoDistance function
          .style("display", d => d3.geoDistance(d.centroid, center) > 1.57 ? "none" : "block"); 
      };
    });
}

// --- INTERACTIONS ---
function previewSelection(country) {
  previewCountry = country;
  renderDetails(country);
  spinGlobeTo(country);
  renderMap();
  renderScatter();
}

function clearPreview() {
  if (!previewCountry) return;
  previewCountry = null;
  renderDetails(selectedCountry);
  spinGlobeTo(selectedCountry);
  renderMap();
  renderScatter();
}

function commitSelection(country) {
  selectedCountry = country;
  previewCountry = null;
  renderDetails(country);
  spinGlobeTo(country);
  renderMap();
  renderScatter();
}

// --- GLOBE RENDERING ---
function buildCountryFeatureLookup(world) {
  worldFeatures = topojson.feature(world, world.objects.countries).features;
  landFeature = topojson.merge(world, world.objects.countries.geometries);
  bordersFeature = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);
  const featureById = new Map(worldFeatures.map(f => [String(f.id).padStart(3, "0"), f]));

  countries.forEach(country => {
    country.feature = featureById.get(country.id);
    country.centroid = country.feature ? d3.geoCentroid(country.feature) : [country.lon, country.lat];
  });
}

function renderMap() {
  const data = visibleCountries();
  const current = activeCountry();
  
  const exposureColor = d3.scaleLinear().domain([0, 35, 90]).range(["#8fc6bd", "#f0b35a", "#b84655"]);
  const radius = d3.scaleSqrt().domain([0, d3.max(countries, d => impactFor(d).population)]).range([5, 38]);

  mapSvg.attr("viewBox", `0 0 ${mapWidth} ${mapHeight}`);
  
  // Base Layers (Only draw once)
  if (mapSvg.select(".base").empty() && worldFeatures.length > 0) {
    const baseGroup = mapSvg.append("g").attr("class", "base");
    baseGroup.append("path").datum({ type: "Sphere" }).attr("class", "feature sphere").attr("d", path).attr("fill", "#1a2a3a");
    baseGroup.append("path").datum(d3.geoGraticule10()).attr("class", "feature graticule").attr("d", path).attr("fill", "none").attr("stroke", "rgba(255,255,255,0.1)");
    baseGroup.append("path").datum(landFeature).attr("class", "feature land").attr("d", path).attr("fill", "#2c3e50").attr("stroke", "#1f2d3d");
  }

  // Update Bubbles
  const bubbleGroup = mapSvg.select(".bubbles").empty() ? mapSvg.append("g").attr("class", "bubbles") : mapSvg.select(".bubbles");
  
  bubbleGroup.selectAll("circle").data(data, d => d.name)
    .join("circle")
    .attr("class", "map-bubble")
    .attr("cx", d => projection(d.centroid)[0])
    .attr("cy", d => projection(d.centroid)[1])
    .attr("fill-opacity", 0.8)
    .style("display", d => d3.geoDistance(d.centroid, [-projection.rotate()[0], -projection.rotate()[1]]) > Math.PI / 2 ? "none" : "block")
    .style("cursor", "pointer")
    .on("mouseenter focus", (e, d) => previewSelection(d))
    .on("click", (e, d) => commitSelection(d))
    .on("mouseleave", clearPreview)
    .transition().duration(800).ease(d3.easeCubicOut) // LIQUID MAP TRANSITION
    .attr("r", d => radius(impactFor(d).population))
    .attr("fill", d => exposureColor(impactFor(d).exposure))
    .attr("stroke", d => d.name === current.name ? "#ffffff" : "rgba(255,255,255,0.3)")
    .attr("stroke-width", d => d.name === current.name ? 3 : 1);

  const highest = d3.greatest(data, d => impactFor(d).exposure);
  d3.select("#highest-risk").text(highest ? highest.name : "None");
  d3.select("#visible-count").text(data.length);
}

// --- SCATTERPLOT RENDERING ---
function renderScatter() {
  const data = visibleCountries();
  const current = activeCountry();
  const width = 600, height = 400;
  const margin = { top: 30, right: 30, bottom: 50, left: 50 };

  scatterSvg.attr("viewBox", `0 0 ${width} ${height}`);
  
  // Setup once
  if (scatterSvg.select(".axes").empty()) {
    scatterSvg.append("g").attr("class", "axes");
    scatterSvg.append("g").attr("class", "marks");
    scatterSvg.append("g").attr("class", "annotations");
  }

  const xScale = d3.scalePoint()
    .domain(["Very low", "Low per person", "Low", "Medium"])
    .range([margin.left, width - margin.right])
    .padding(0.5);

  const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);
  const rScale = d3.scaleSqrt().domain([0, d3.max(countries, d => impactFor(d).population)]).range([5, 30]);
  const exposureColor = d3.scaleLinear().domain([0, 35, 90]).range(["#8fc6bd", "#f0b35a", "#b84655"]);

  // Update Axes
  const axes = scatterSvg.select(".axes");
  axes.selectAll("*").remove();
  axes.append("g").attr("transform", `translate(0,${height - margin.bottom})`).call(d3.axisBottom(xScale));
  axes.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d + "%"));
  axes.append("text").attr("x", width/2).attr("y", height - 10).attr("text-anchor", "middle").style("fill", "var(--muted)").style("font-size", "12px").text("CO2 Emissions Share");
  axes.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", 15).attr("text-anchor", "middle").style("fill", "var(--muted)").style("font-size", "12px").text("Exposed Land (%)");

  // Editorial Annotations
  const anno = scatterSvg.select(".annotations");
  anno.selectAll("*").remove();
  anno.append("text").attr("x", margin.left + 20).attr("y", margin.top + 10).style("fill", "var(--coral)").style("font-weight", "bold").style("font-size", "12px").text("↑ High Danger, Low Blame");
  
  // Update Bubbles (LIQUID TRANSITIONS)
  scatterSvg.select(".marks").selectAll("circle")
    .data(data, d => d.name)
    .join(
      enter => enter.append("circle")
        .attr("cx", d => xScale(d.emissions))
        .attr("cy", yScale(0)) // Start from bottom for a cool entrance
        .attr("r", 0),
      update => update,
      exit => exit.transition().duration(400).attr("r", 0).remove()
    )
    .style("cursor", "pointer")
    .on("mouseenter", (e, d) => previewSelection(d))
    .on("click", (e, d) => commitSelection(d))
    .on("mouseleave", clearPreview)
    .transition().duration(800).ease(d3.easeElasticOut) // BOUNCE EFFECT
    .attr("cx", d => xScale(d.emissions))
    .attr("cy", d => yScale(impactFor(d).exposure))
    .attr("r", d => rScale(impactFor(d).population))
    .attr("fill", d => exposureColor(impactFor(d).exposure))
    .attr("fill-opacity", 0.85)
    .attr("stroke", d => d.name === current.name ? "#17212b" : "#ffffff")
    .attr("stroke-width", d => d.name === current.name ? 3 : 1);
}

// --- DETAILS UI ---
function renderDetails(country = activeCountry()) {
  const impact = impactFor(country);
  d3.select("#country-title").text(country.name);
  d3.select("#country-summary").text(country.summary);
  d3.select("#country-region").text(country.region);
  d3.select("#country-population").text(formatPopulation(country.population));
  d3.select("#country-area").text(`${d3.format(",")(country.area)} sq km`);
  d3.select("#country-exposure").text(`${d3.format(".1f")(impact.exposure)}%`);
  d3.select("#country-emissions").text(country.emissions);
  d3.select("#country-injustice").text(impact.exposure.toFixed(1));
}

// --- UI EVENT LISTENERS ---
d3.selectAll(".scenario-option").on("click", function(event) {
  d3.selectAll(".scenario-option").classed("active", false);
  d3.select(this).classed("active", true);
  const scenarios = [0.5, 1.0, 2.0];
  seaRise = scenarios[parseInt(event.currentTarget.dataset.scenario)];
  d3.select("#scenario-title").text(`${seaRise.toFixed(1)} meter sea-level rise`);
  d3.select("#scatter-title").text(`${seaRise.toFixed(1)} meter sea-level rise`);
  renderDetails(); renderMap(); renderScatter();
});

d3.selectAll(".region").on("click", event => {
  activeRegion = event.currentTarget.dataset.region;
  d3.selectAll(".region").classed("active", false);
  d3.select(event.currentTarget).classed("active", true);
  const data = visibleCountries();
  if (!data.some(d => d.name === selectedCountry.name)) selectedCountry = data[0] || countries[0];
  previewCountry = null;
  renderDetails(); spinGlobeTo(selectedCountry); renderMap(); renderScatter();
});

// --- INIT ---
d3.json("data/countries-110m.json").then(world => {
  buildCountryFeatureLookup(world);
  renderDetails();
  spinGlobeTo(selectedCountry);
  renderMap();
  renderScatter();
}).catch(() => {
  mapSvg.append("text").attr("x", mapWidth/2).attr("y", mapHeight/2).attr("text-anchor", "middle").style("fill", "white").text("Failed to load map data. Check local server.");
});