// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  id: 'mapbox/streets-v11',
  accessToken: 'pk.eyJ1IjoiamVuaXF1ZWYiLCJhIjoiY202eG4wamltMG44ODJscHMzaWR2d25idSJ9.-7FZQispTdo_JDvxGIEybw'
});

// Create the map object with center and zoom options.
let map = L.map("map", {
  center: [30, 30],
  zoom: 3,
  layers: [basemap]
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(map);


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.

  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#ea2c2c";
      case depth > 70:
        return "#ea822c";
      case depth > 50:
        return "#ee9c00";
      case depth > 30:
        return "#eecc00";
      case depth > 10:
        return "#d4ee00";
      default:
        return "#98ee00";
    }

  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 4;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, { 
    
    // Turn each feature into a circleMarker on the map.
  
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  
  }).addTo(map);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");
    const depth = [-10, 10, 30, 50, 70, 90];
    const colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];
  
    // Initialize depth intervals and colors for the legend
      

    // Loop through our depth intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < depth.length; i++) {
      console.log(colors[i]);
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        depth[i] + (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");

    }
    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(map);


});

console.log("working");
