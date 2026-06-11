const countries = [
  { name: "Maldives", id: "462", region: "Indian Ocean", lat: 3.2, lon: 73.2, population: 521000, area: 300, emissions: "Very low", exposureCurve: [[0, 0], [0.5, 48], [1, 72], [2, 89]], summary: "A low-lying island nation where even moderate sea-level rise could expose a large share of land and population.", funFact: "The Maldives is one of the world's lowest-lying countries, so even small changes in sea level can affect daily life across many islands." },
  { name: "Tuvalu", id: "798", region: "Pacific", lat: -7.1, lon: 177.6, population: 11000, area: 26, emissions: "Very low", exposureCurve: [[0, 0], [0.5, 42], [1, 66], [2, 83]], summary: "A small Pacific island country with very limited land area and little room to retreat inland.", funFact: "Tuvalu's land is made up of tiny reef islands and atolls, which makes shoreline protection and freshwater storage especially important." },
  { name: "Kiribati", id: "296", region: "Pacific", lat: 1.8, lon: -157.4, population: 131000, area: 811, emissions: "Very low", exposureCurve: [[0, 0], [0.5, 35], [1, 58], [2, 78]], summary: "A nation of atolls spread across the Pacific, where elevation and distance make adaptation especially difficult.", funFact: "Kiribati is spread over a huge area of ocean, so climate adaptation has to work across many far-apart atolls rather than one compact coastline." },
  { name: "Marshall Islands", id: "584", region: "Pacific", lat: 7.1, lon: 171.2, population: 42000, area: 181, emissions: "Very low", exposureCurve: [[0, 0], [0.5, 38], [1, 61], [2, 80]], summary: "A low-lying island nation where land, infrastructure, and freshwater supplies are tightly connected to sea level.", funFact: "Many Marshallese communities depend on thin freshwater lenses under coral atolls, which can be stressed by saltwater pushed inland during storms." },
  { name: "Bahamas", id: "044", region: "Caribbean", lat: 25.0, lon: -77.4, population: 402000, area: 10010, emissions: "Low", exposureCurve: [[0, 0], [0.5, 18], [1, 31], [2, 49]], summary: "A Caribbean archipelago where tourism, housing, and transport infrastructure are concentrated near the coast.", funFact: "The Bahamas has hundreds of islands and cays, so sea-level rise is not one shoreline problem but a repeated challenge across the archipelago." },
  { name: "Belize", id: "084", region: "Caribbean", lat: 17.2, lon: -88.5, population: 405000, area: 22810, emissions: "Low", exposureCurve: [[0, 0], [0.5, 12], [1, 24], [2, 41]], summary: "A coastal nation where sea-level rise threatens communities, wetlands, and reef-connected economies.", funFact: "Belize's famous barrier reef helps buffer waves, making reef health part of the country's natural coastal defense system." },
  { name: "Bangladesh", id: "050", region: "Coastal Asia", lat: 23.7, lon: 90.4, population: 171000000, area: 130170, emissions: "Low per person", exposureCurve: [[0, 0], [0.5, 9], [1, 17], [2, 30]], summary: "A densely populated delta country where a smaller exposed land share can still mean millions of people at risk.", funFact: "Bangladesh sits on one of the world's largest river deltas, where river flooding, cyclones, and sea-level rise can stack on top of each other." },
  { name: "Vietnam", id: "704", region: "Coastal Asia", lat: 14.1, lon: 108.3, population: 98100000, area: 313430, emissions: "Medium", exposureCurve: [[0, 0], [0.5, 7], [1, 13], [2, 22]], summary: "A coastal and delta-rich country where sea-level rise could affect major agricultural and urban regions.", funFact: "Vietnam's Mekong Delta is often called a rice bowl, so rising seas can connect coastal risk directly to food production." },
  { name: "Fiji", id: "242", region: "Pacific", lat: -17.7, lon: 178.1, population: 925000, area: 18270, emissions: "Low", exposureCurve: [[0, 0], [0.5, 10], [1, 19], [2, 34]], summary: "A Pacific island nation where exposure varies by island, settlement pattern, and available inland land.", funFact: "Fiji has already moved some vulnerable coastal villages inland, turning climate adaptation into a lived community planning challenge." },
  { name: "Seychelles", id: "690", region: "Indian Ocean", lat: -4.7, lon: 55.5, population: 107000, area: 460, emissions: "Low", exposureCurve: [[0, 0], [0.5, 22], [1, 39], [2, 57]], summary: "An island country where coastal development and limited land make sea-level exposure especially visible.", funFact: "Seychelles has many small granitic and coral islands, so protecting beaches also helps protect homes, roads, tourism, and nesting habitat." },
  { name: "China", id: "156", region: "East Asia", lat: 35.9, lon: 104.2, population: 1412000000, area: 9388211, emissions: "Very high", exposureCurve: [[0, 0], [0.5, 1.2], [1, 2.4], [2, 4.8]], summary: "The world's largest annual CO2 emitter, with major coastal cities and river deltas exposed to rising seas.", funFact: "China's coast includes the Yangtze and Pearl River deltas, two dense economic regions where sea-level rise can intersect with industry, ports, and housing." },
  { name: "United States", id: "840", region: "North America", lat: 37.1, lon: -95.7, population: 335000000, area: 9147420, emissions: "Very high", exposureCurve: [[0, 0], [0.5, 0.7], [1, 1.5], [2, 3.2]], summary: "A high-emitting country with coastal exposure spread across the Atlantic, Gulf, Pacific, Alaska, and island territories.", funFact: "The United States has more than one vulnerable coastline: sea-level rise affects places as different as Louisiana, Florida, New York, California, Alaska, and Hawaii." },
  { name: "India", id: "356", region: "South Asia", lat: 20.6, lon: 78.9, population: 1428000000, area: 2973190, emissions: "Very high", exposureCurve: [[0, 0], [0.5, 1.5], [1, 3.2], [2, 6.1]], summary: "A major CO2 emitter where even modest coastal exposure can affect many people because of its large population.", funFact: "India's long coastline includes megacities and low-lying delta regions, so small exposed percentages can still represent very large numbers of people." },
  { name: "Russia", id: "643", region: "Eurasia", lat: 61.5, lon: 105.3, population: 144000000, area: 16376870, emissions: "High", exposureCurve: [[0, 0], [0.5, 0.2], [1, 0.5], [2, 1]], summary: "A major fossil-fuel producer and CO2 emitter with lower modeled sea-level exposure than the island and delta countries.", funFact: "Russia has the world's largest land area, so its exposed land percentage can look small even though Arctic and coastal changes still matter." },
  { name: "Japan", id: "392", region: "East Asia", lat: 36.2, lon: 138.3, population: 125000000, area: 364555, emissions: "High", exposureCurve: [[0, 0], [0.5, 3], [1, 6], [2, 11]], summary: "A major industrial economy where dense coastal cities and ports make sea-level exposure economically important.", funFact: "Japan's population and infrastructure are concentrated around coastal plains, including Tokyo Bay, which makes shoreline risk especially consequential." }
];

const largestEmitterNames = new Set(["China", "United States", "India", "Russia", "Japan"]);
const co2ShareByCountry = new Map([
  ["Tuvalu", 0.0001],
  ["Kiribati", 0.0002],
  ["Marshall Islands", 0.0002],
  ["Seychelles", 0.002],
  ["Maldives", 0.003],
  ["Belize", 0.01],
  ["Fiji", 0.01],
  ["Bahamas", 0.03],
  ["Bangladesh", 0.4],
  ["Vietnam", 0.9],
  ["Japan", 2.6],
  ["Russia", 5],
  ["India", 8],
  ["United States", 13],
  ["China", 31]
]);
const maxCo2Share = 31;

let seaRise = 1.0;
let activeFilter = { type: "all", value: "All" };
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

// Interaction state for smoother hover-driven globe movement.
let hoverIntentTimer = null;

// --- UTILS ---
function formatPopulation(value) {
  if (value >= 1000000000) return `${d3.format(".1f")(value / 1000000000)}B`;
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

function isMajorEmitter(country) {
  return largestEmitterNames.has(country.name);
}

function emitterGroupFor(country) {
  return isMajorEmitter(country) ? "largest" : "smallest";
}

function co2ShareFor(country) {
  return co2ShareByCountry.get(country.name) ?? 0;
}

function formatCo2Share(country) {
  const share = co2ShareFor(country);
  if (share > 0 && share < 0.01) return "<0.01%";
  if (share < 1) return `${d3.format(".2~f")(share)}%`;
  return `${d3.format(".1~f")(share)}%`;
}

function injusticeScoreFor(country) {
  const exposure = exposureAt(country, seaRise);
  const responsibility = Math.sqrt(co2ShareFor(country) / maxCo2Share);
  return exposure * (1 - Math.min(1, responsibility));
}

function mapMarkerStroke(country, current) {
  if (country.name === current.name) return "#ffffff";
  return isMajorEmitter(country) ? "#d99b45" : "rgba(255,255,255,0.3)";
}

function scatterMarkerStroke(country, current) {
  if (country.name === current.name) return "#17212b";
  return isMajorEmitter(country) ? "#d99b45" : "#ffffff";
}

function markerStrokeWidth(country, current) {
  if (country.name === current.name) return 3;
  return isMajorEmitter(country) ? 2.5 : 1;
}

function markerDash(country, current) {
  return isMajorEmitter(country) && country.name !== current.name ? "5 3" : null;
}

function visibleCountries() {
  if (activeFilter.type === "region") {
    return countries.filter(d => d.region === activeFilter.value);
  }

  if (activeFilter.type === "emitter") {
    return countries.filter(d => emitterGroupFor(d) === activeFilter.value);
  }

  return countries;
}
function activeCountry() { return previewCountry || selectedCountry; }

function clampSeaRise(value) {
  return Math.max(0.5, Math.min(2, value));
}

function formatSeaRise(value) {
  return d3.format(".2~f")(value);
}

// --- THE SPIN ENGINE ---
// --- THE OPTIMIZED SPIN ENGINE ---
// function spinGlobeTo(country) {
//   if (!country || !country.centroid) return;
//   const targetLon = -country.centroid[0];
//   const targetLat = -country.centroid[1];

//   // 800ms is faster and feels snappier than 1200ms
//   d3.transition().duration(800).ease(d3.easeQuadOut)
//     .tween("rotate", function() {
//       const r = d3.interpolate(projection.rotate(), [targetLon, targetLat, 0]);
//       return function(t) {
//         projection.rotate(r(t));
        
//         // OPTIMIZATION 1: Only redraw the land and graticule. Leave the ocean alone!
//         mapSvg.select(".land").attr("d", path);
//         mapSvg.select(".graticule").attr("d", path);
        
//         // OPTIMIZATION 2: Cache the current rotation center so we don't calculate it 50 times per frame
//         const currentRot = projection.rotate();
//         const center = [-currentRot[0], -currentRot[1]];

//         mapSvg.selectAll(".map-bubble")
//           .attr("cx", d => projection(d.centroid)[0])
//           .attr("cy", d => projection(d.centroid)[1])
//           // Use a raw math threshold (1.57 is ~90 degrees) instead of calling the heavy geoDistance function
//           .style("display", d => d3.geoDistance(d.centroid, center) > 1.57 ? "none" : "block"); 
//       };
//     });
// }

// --- FIXED SPIN ENGINE
function updateGlobeFrame() {
  mapSvg.select(".land").attr("d", path);
  mapSvg.select(".graticule").attr("d", path);

  const currentRot = projection.rotate();
  const center = [-currentRot[0], -currentRot[1]];

  mapSvg.selectAll(".map-bubble, .map-hitbox")
    .attr("cx", d => projection(d.centroid)[0])
    .attr("cy", d => projection(d.centroid)[1])
    .style("display", d => d3.geoDistance(d.centroid, center) > Math.PI / 2 ? "none" : "block");
}

// Pick the closest equivalent longitude so the globe does not spin the long way.
function shortestLongitudeTarget(from, to) {
  const diff = ((to - from + 540) % 360) - 180;
  return from + diff;
}

// --- UPDATED spinGlobeTo() ---
function spinGlobeTo(country, duration = null) {
  if (!country || !country.centroid) return;

  const start = projection.rotate();

  const rawTarget = [
    -country.centroid[0],
    -country.centroid[1],
    0
  ];

  // Use the closest longitude version of the target
  // to prevents huge unnecessary spins between nearby countries.
  const target = [
    shortestLongitudeTarget(start[0], rawTarget[0]),
    rawTarget[1],
    0
  ];

  const lonDistance = Math.abs(target[0] - start[0]);
  const latDistance = Math.abs(target[1] - start[1]);
  const totalDistance = Math.sqrt(lonDistance ** 2 + latDistance ** 2);

  const alreadyThere = totalDistance < 0.1;

  if (alreadyThere) {
    updateGlobeFrame();
    return;
  }

  const smartDuration = duration ?? Math.max(350, Math.min(900, totalDistance * 6));

  mapSvg.interrupt("spin");

  mapSvg.transition("spin")
    .duration(smartDuration)
    .ease(d3.easeCubicOut)
    .tween("rotate", () => {
      const rotate = d3.interpolate(start, target);

      return t => {
        projection.rotate(rotate(t));
        updateGlobeFrame();
      };
    });
}

// --- DRAG TO ROTATE GLOBE ---
let isDraggingGlobe = false;
let didDragGlobe = false;
let dragStartPoint = null;
let dragStartRotate = null;
let lastGlobeDragTime = 0;

function recentlyDraggedGlobe() {
  return Date.now() - lastGlobeDragTime < 250;
}

const globeDrag = d3.drag()
  .filter(event => {
    // Only allow normal left-click dragging.
    return !event.ctrlKey && !event.button;
  })
  .on("start", event => {
    isDraggingGlobe = true;
    didDragGlobe = false;

    dragStartPoint = [event.x, event.y];
    dragStartRotate = projection.rotate().slice();

    clearTimeout(hoverIntentTimer);
    mapSvg.interrupt("spin");

    mapSvg.style("cursor", "grabbing");
  })
  .on("drag", event => {
    const dx = event.x - dragStartPoint[0];
    const dy = event.y - dragStartPoint[1];

    if (Math.abs(dx) + Math.abs(dy) > 3) {
      didDragGlobe = true;
      clearPreview();
    }

    const sensitivity = 0.28;

    const newRotate = [
      dragStartRotate[0] + dx * sensitivity,
      dragStartRotate[1] - dy * sensitivity,
      dragStartRotate[2] || 0
    ];

    // Prevent vertical flipping.
    newRotate[1] = Math.max(-75, Math.min(75, newRotate[1]));

    projection.rotate(newRotate);
    updateGlobeFrame();
  })
  .on("end", () => {
    isDraggingGlobe = false;

    if (didDragGlobe) {
      lastGlobeDragTime = Date.now();
    }

    mapSvg.style("cursor", "grab");

    setTimeout(() => {
      didDragGlobe = false;
    }, 250);
  });

mapSvg
  .style("cursor", "grab")
  .style("touch-action", "none")
  .call(globeDrag);

// function spinGlobeTo(country, duration = 650) {
//   if (!country || !country.centroid) return;

//   const target = [-country.centroid[0], -country.centroid[1], 0];
//   const start = projection.rotate();

//   const alreadyThere =
//     Math.abs(start[0] - target[0]) < 0.1 &&
//     Math.abs(start[1] - target[1]) < 0.1;

//   if (alreadyThere) {
//     updateGlobeFrame();
//     return;
//   }

//   // Interrupt only the previous globe spin, not the bubble color/size transitions.
//   mapSvg.interrupt("spin");

//   mapSvg.transition("spin")
//     .duration(duration)
//     .ease(d3.easeCubicOut)
//     .tween("rotate", () => {
//       const rotate = d3.interpolate(start, target);

//       return t => {
//         projection.rotate(rotate(t));
//         updateGlobeFrame();
//       };
//     });
// }

function updateSelectionStyles() {
  const current = activeCountry();

  mapSvg.selectAll(".map-bubble")
    .interrupt("bubble-style")
    .transition("bubble-style")
    .duration(180)
    .attr("stroke", d => mapMarkerStroke(d, current))
    .attr("stroke-width", d => markerStrokeWidth(d, current))
    .attr("stroke-dasharray", d => markerDash(d, current));

  scatterSvg.select(".marks").selectAll("circle")
    .interrupt("scatter-style")
    .transition("scatter-style")
    .duration(180)
    .attr("stroke", d => scatterMarkerStroke(d, current))
    .attr("stroke-width", d => markerStrokeWidth(d, current))
    .attr("stroke-dasharray", d => markerDash(d, current));
}

// --- INTERACTIONS ---
// function previewSelection(country) {
//   previewCountry = country;
//   renderDetails(country);
//   spinGlobeTo(country);
//   renderMap();
//   renderScatter();
// }

// function clearPreview() {
//   if (!previewCountry) return;
//   previewCountry = null;
//   renderDetails(selectedCountry);
//   spinGlobeTo(selectedCountry);
//   renderMap();
//   renderScatter();
// }

// function commitSelection(country) {
//   selectedCountry = country;
//   previewCountry = null;
//   renderDetails(country);
//   spinGlobeTo(country);
//   renderMap();
//   renderScatter();
// }

// --- UPDATED INTERACTIONS ---
function previewSelection(country) {
  if (!country || (previewCountry && previewCountry.name === country.name)) return;

  previewCountry = country;
  // Hover only previews the country.
  // Do NOT rotate the globe here.
  renderDetails(country);
  updateSelectionStyles();
}

function queuePreviewSelection(country) {
  if (isDraggingGlobe) return;

  clearTimeout(hoverIntentTimer);
  hoverIntentTimer = setTimeout(() => previewSelection(country), 60);
}

function clearPreview() {
  clearTimeout(hoverIntentTimer);

  if (!previewCountry) return;

  previewCountry = null;
  // Go back to showing the selected country details.
  // Do NOT rotate the globe back here.
  renderDetails(selectedCountry);
  updateSelectionStyles();
}

function commitSelection(country) {
  clearTimeout(hoverIntentTimer);

  if (!country) return;

  selectedCountry = country;
  previewCountry = null;

  renderDetails(country);

  // Click selects the country and rotates the globe toward it.
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
  const bubbleGroup = mapSvg.select(".bubbles").empty()
    ? mapSvg.append("g").attr("class", "bubbles")
    : mapSvg.select(".bubbles");

  // Make small bubbles easier to hover/click
  // without changing the actual visual bubble size.
  const hitboxGroup = mapSvg.select(".bubble-hitboxes").empty()
    ? mapSvg.append("g").attr("class", "bubble-hitboxes")
    : mapSvg.select(".bubble-hitboxes");
  
  bubbleGroup.selectAll("circle").data(data, d => d.name)
    .join("circle")
    .attr("class", "map-bubble")
    .attr("cx", d => projection(d.centroid)[0])
    .attr("cy", d => projection(d.centroid)[1])
    .attr("fill-opacity", 0.8)
    .style("display", d => d3.geoDistance(d.centroid, [-projection.rotate()[0], -projection.rotate()[1]]) > Math.PI / 2 ? "none" : "block")
    .style("pointer-events", "none")
    // .style("cursor", "pointer")
    // .on("mouseenter focus", (e, d) => previewSelection(d))
    // .on("click", (e, d) => commitSelection(d))
    // .transition().duration(800).ease(d3.easeCubicOut) // LIQUID MAP TRANSITION
    .transition("bubble-style").duration(500).ease(d3.easeCubicOut)
    .attr("r", d => radius(impactFor(d).population))
    .attr("fill", d => exposureColor(impactFor(d).exposure))
    .attr("fill-opacity", d => isMajorEmitter(d) ? 0.62 : 0.82)
    .attr("stroke", d => mapMarkerStroke(d, current))
    .attr("stroke-width", d => markerStrokeWidth(d, current))
    .attr("stroke-dasharray", d => markerDash(d, current));

    // Separate invisible circles for better interaction without affecting visual style.
    hitboxGroup.selectAll("circle").data(data, d => d.name)
      .join("circle")
      .attr("class", "map-hitbox")
      .attr("cx", d => projection(d.centroid)[0])
      .attr("cy", d => projection(d.centroid)[1])
      .attr("r", d => Math.max(20, radius(impactFor(d).population) + 6))
      .attr("fill", "transparent")
      .style("display", d => d3.geoDistance(d.centroid, [-projection.rotate()[0], -projection.rotate()[1]]) > Math.PI / 2 ? "none" : "block")
      .style("cursor", "pointer")
      .on("mouseenter focus", (e, d) => queuePreviewSelection(d))
      .on("mouseleave blur", clearPreview)
      .on("click", (e, d) => {
        e.stopPropagation();

        if (recentlyDraggedGlobe()) return;

        commitSelection(d);
      });

  const highest = d3.greatest(data, d => impactFor(d).exposure);
  d3.select("#highest-risk").text(highest ? highest.name : "None");
  d3.select("#visible-count").text(data.length);
}

// --- SCATTERPLOT RENDERING ---
function renderScatter() {
  const data = visibleCountries();
  const current = activeCountry();
  const width = 600, height = 400;
  const margin = { top: 30, right: 34, bottom: 54, left: 50 };

  scatterSvg.attr("viewBox", `0 0 ${width} ${height}`);
  
  // Setup once
  if (scatterSvg.select(".axes").empty()) {
    scatterSvg.append("g").attr("class", "axes");
    scatterSvg.append("g").attr("class", "marks");
    scatterSvg.append("g").attr("class", "annotations");
  }

  const xScale = d3.scaleSqrt()
    .domain([0, 32])
    .range([margin.left, width - margin.right])
    .nice();

  const yScale = d3.scaleLinear().domain([0, 100]).range([height - margin.bottom, margin.top]);
  const rScale = d3.scaleSqrt().domain([0, d3.max(countries, d => impactFor(d).population)]).range([5, 30]);
  const exposureColor = d3.scaleLinear().domain([0, 35, 90]).range(["#8fc6bd", "#f0b35a", "#b84655"]);
  const scatterData = data.map(country => {
    const impact = impactFor(country);
    const radius = rScale(impact.population);
    return {
      ...country,
      exposure: impact.exposure,
      scatterRadius: radius,
      targetX: xScale(co2ShareFor(country)),
      targetY: yScale(impact.exposure)
    };
  });

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const simulation = d3.forceSimulation(scatterData)
    .force("x", d3.forceX(d => d.targetX).strength(0.55))
    .force("y", d3.forceY(d => d.targetY).strength(0.85))
    .force("collide", d3.forceCollide(d => d.scatterRadius + 3).iterations(4))
    .stop();

  for (let i = 0; i < 180; i += 1) {
    simulation.tick();
    scatterData.forEach(d => {
      d.x = clamp(d.x, margin.left + d.scatterRadius, width - margin.right - d.scatterRadius);
      d.y = clamp(d.y, margin.top + d.scatterRadius, height - margin.bottom - d.scatterRadius);
    });
  }

  // Update Axes
  const axes = scatterSvg.select(".axes");
  axes.selectAll("*").remove();
  axes.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickValues([0, 1, 5, 10, 20, 30]).tickFormat(d => `${d}%`));
  axes.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale).ticks(5).tickFormat(d => d + "%"));
  axes.append("text").attr("x", width/2).attr("y", height - 10).attr("text-anchor", "middle").style("fill", "var(--muted)").style("font-size", "12px").text("CO2 Emissions Share");
  axes.append("text").attr("transform", "rotate(-90)").attr("x", -height/2).attr("y", 15).attr("text-anchor", "middle").style("fill", "var(--muted)").style("font-size", "12px").text("Exposed Land (%)");

  // Editorial Annotations
  const anno = scatterSvg.select(".annotations");
  anno.selectAll("*").remove();
  anno.append("text").attr("x", margin.left + 20).attr("y", margin.top + 10).style("fill", "var(--coral)").style("font-weight", "bold").style("font-size", "12px").text("↑ High Danger, Low Blame");
  const labelData = scatterData
    .filter(d => d.name === current.name || d.name === selectedCountry.name)
    .filter((d, index, labels) => labels.findIndex(label => label.name === d.name) === index);

  const labelGroups = anno.selectAll(".scatter-label")
    .data(labelData, d => d.name)
    .join("g")
    .attr("class", "scatter-label")
    .style("pointer-events", "none")
    .attr("transform", d => {
      const labelX = clamp(d.x + d.scatterRadius + 8, margin.left + 44, width - margin.right - 54);
      const labelY = clamp(d.y - d.scatterRadius - 8, margin.top + 12, height - margin.bottom - 10);
      return `translate(${labelX},${labelY})`;
    });

  labelGroups.append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .style("paint-order", "stroke")
    .style("stroke", "#ffffff")
    .style("stroke-width", 4)
    .style("stroke-linejoin", "round")
    .style("fill", "#17212b")
    .style("font-size", "11px")
    .style("font-weight", 800)
    .text(d => d.name);
  
  // Update Bubbles (LIQUID TRANSITIONS)
  scatterSvg.select(".marks").selectAll("circle")
    .data(scatterData, d => d.name)
    .join(
      enter => enter.append("circle")
        .attr("cx", d => d.targetX)
        .attr("cy", yScale(0)) // Start from bottom for a cool entrance
        .attr("r", 0),
      update => update,
      exit => exit.transition().duration(400).attr("r", 0).remove()
    )
    .style("cursor", "pointer")
    // .on("mouseenter", (e, d) => previewSelection(d))
    // .on("click", (e, d) => commitSelection(d))
    // .on("mouseleave", clearPreview)
    // .transition().duration(800).ease(d3.easeElasticOut) // BOUNCE EFFECT
    .on("mouseenter", (e, d) => queuePreviewSelection(d))
    .on("click", (e, d) => {
      e.stopPropagation();
      if (recentlyDraggedGlobe()) return;
      commitSelection(d);
    })
    .on("mouseleave", clearPreview)
    .transition("scatter-style").duration(500).ease(d3.easeCubicOut)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", d => d.scatterRadius)
    .attr("fill", d => exposureColor(d.exposure))
    .attr("fill-opacity", d => isMajorEmitter(d) ? 0.58 : 0.85)
    .attr("stroke", d => scatterMarkerStroke(d, current))
    .attr("stroke-width", d => markerStrokeWidth(d, current))
    .attr("stroke-dasharray", d => markerDash(d, current));
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
  d3.select("#country-emissions").text(`${country.emissions} (${formatCo2Share(country)})`);
  d3.select("#country-injustice").text(injusticeScoreFor(country).toFixed(1));
  d3.select("#insight-text").text(country.funFact);
}

// the globe moves circles under the cursor.
d3.select(".map-stage")
  .on("mouseleave", clearPreview);

// --- UI EVENT LISTENERS ---
function setSeaRise(value, syncInput = true) {
  if (value === "") return;

  const nextRise = clampSeaRise(Number(value));
  if (Number.isNaN(nextRise)) return;

  seaRise = nextRise;
  const formattedRise = formatSeaRise(seaRise);
  const unit = seaRise === 1 ? "meter" : "meters";

  d3.select("#sea-rise-slider").property("value", seaRise);
  if (syncInput) d3.select("#sea-rise-input").property("value", formattedRise);
  d3.select("#scenario-title").text(`${formattedRise} ${unit} sea-level rise`);
  d3.select("#scatter-title").text(`${formattedRise} ${unit} sea-level rise`);
  renderDetails();
  renderMap();
  renderScatter();
}

d3.select("#sea-rise-slider").on("input", event => setSeaRise(event.currentTarget.value));
d3.select("#sea-rise-input")
  .on("input", event => setSeaRise(event.currentTarget.value, false))
  .on("change", event => setSeaRise(event.currentTarget.value || seaRise));

d3.selectAll(".region").on("click", event => {
  activeFilter = {
    type: event.currentTarget.dataset.filterType,
    value: event.currentTarget.dataset.filterValue
  };
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
