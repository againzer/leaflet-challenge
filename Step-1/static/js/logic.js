//creating map object
var myMap = L.map("map", {
    center: [34.0522, -118.2437],
    zoom:4
  });


//adding tile layer

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    /////how do I reference my gitignore
    accessToken: 'pk.eyJ1IjoiYWNnYWluZXIxIiwiYSI6ImNrcWxoOGNwajBxcmUycm12Z3Y2bDhkZm8ifQ.Z2-8GuOTCf8qb9508FqKdg'
  }).addTo(myMap);


//load geojson data
var geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var geojson;

function getradius(magnitude){
    return (magnitude*2);
};



function getcolor(depth){
    if(depth < 300){
        return '#FFEDA0'
    }
    if(depth < 400){
        return '#FED976'
    }
    if(depth < 500){
        return '#FEB24C'
    }
    if(depth < 600){
        return '#FD8D3C'
    }
    if(depth < 700){
        return '#FC4E2A'
    }
    if(depth < 800){
        return '#E31A1C'
    }
    if(depth < 900){
        return '#BD0026'
    }
    if(depth < 1000){
        return '#800026'
    }
    else {'#000000'}
};

// grab data with d3
d3.json(geoData).then(function(data) {
    // Create a new choropleth layer
    geojson = L.geoJson(data, {
      // Define what  property in the features to use
      
    // binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Location: " + feature.properties.place + "<br>" +
            "Magnitude" + feature.properties.mag);
        },
        pointToLayer: function(feature, latlng){
            return L.circleMarker(latlng, {
                radius: getradius(feature.properties.mag),
                fillColor: getcolor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }
            )
        } 
        }).addTo(myMap);


    // set up the legend
    var legend = L.control({ position: "bottomleft" });

    legend.onAdd = function() {

    var div = L.DomUtil.create("div", "info legend");
    var limits = ['0-300','300-400','400-500','500-600','600-700','700-800','800-900','900-1000','1000+'];
    var colors = ['#FFEDA0','#FEB24C','#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026','#000000'] ;
    var labels = ['0-300','300-400','400-500','500-600','600-700','700-800','800-900','900-1000','1000+'];

    // Add min & max
    var legendInfo = "<h4>Earthquake Magnitude</h4>" +
        "<div class = 'legend'>" +
        "</div>";

    div.innerHTML = legendInfo;

    for( i = 0; i < limits.length-1; i++){
        div.innerHTML += "<li style = 'background: " + colors[i] +"'>"+
        labels[i]+    
        "</li>";
    }
    return div;
    };

    
    //add legend to map

    legend.addTo(myMap);
});
