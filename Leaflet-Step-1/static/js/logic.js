// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

//  Define streetmap layer
var baseMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers

// Create our map, giving it the streetmap and earthquakes layers to display on load
var myMap = L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
  layers: [baseMap]
});

function getColor(magnitude){
  switch (true) {
    case magnitude >= 0 && magnitude < 1:
      return "#ff9900";
    case magnitude >= 1 && magnitude < 2:
      return "#00ff02";
    case magnitude >= 2:
      return "#660066";
    default:
      return "#00ff00";
    
  }
 }

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Get the response,
  earthquake_data = data.features;

  earthquake_data.forEach(function(site){
  // console.log(site)
  // Add circles to map
  var longitude = site.geometry.coordinates[0];
  var latitude = site.geometry.coordinates[1];
  var i = L.circle([latitude, longitude], {
    fillOpacity: 0.75,
    fillColor: getColor(site.properties.mag),
    // Adjust radius
    radius: site.properties.mag * 15000,
    }).bindPopup("<h1>" + site.properties.place + "</h1>" + "<h1>" + site.properties.mag + "</h1>").addTo(myMap);
});

// Add a legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitudes = [0,1,2],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(magnitudes[i]) + '"></i> ' +
            magnitudes[i] + (magnitudes[i + 1] ? '&ndash;' + magnitudes[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


});


