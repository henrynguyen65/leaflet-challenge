// Function to create a color based on earthquake depth
function getColor(depth) {
  if (depth > 90) return "#FF0000"; // Red
  if (depth > 70) return "#FF4500"; // OrangeRed
  if (depth > 50) return "#FF8C00"; // DarkOrange
  if (depth > 30) return "#FFD700"; // Gold
  if (depth > 10) return "#ADFF2F"; // GreenYellow
  return "#00FF00"; // LimeGreen
}

// Function to create a marker for each earthquake feature
function createEarthquakeMarker(feature, latlng) {
  const mag = feature.properties.mag;
  const depth = feature.geometry.coordinates[2];
  
  const markerOptions = {
    radius: mag * 3, // Adjust the multiplier to fit your needs
    fillColor: getColor(depth),
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  return L.circleMarker(latlng, markerOptions).bindPopup(
    `<b>Location:</b> ${feature.properties.place}<br>` +
    `<b>Magnitude:</b> ${mag}<br>` +
    `<b>Depth:</b> ${depth}`
  );
}

// Function to create legend
function createLegend() {
  const legend = L.control({ position: "bottomright" });
  
  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "info legend");
    const depthValues = [0, 10, 30, 50, 70, 90];
  
    div.innerHTML += "<b>Depth</b><br>";
  
    for (let i = 0; i < depthValues.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(depthValues[i] + 1) +
        '"></i> ' +
        depthValues[i] +
        (depthValues[i + 1] ? "&ndash;" + depthValues[i + 1] + "<br>" : "+");
    }
  
    return div;
  };

  return legend;
}

// Load earthquake data
fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")
  .then(response => response.json())
  .then(data => {
    // Create a Leaflet map centered on a default location
    const map = L.map("map").setView([0, 0], 2);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Add legend to the map
    createLegend().addTo(map);

    // Add earthquake markers to the map
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return createEarthquakeMarker(feature, latlng);
      }
    }).addTo(map);
  });
