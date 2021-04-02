import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import MapBoxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import "./index.scss";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWx0YS1kZW52ZXIiLCJhIjoiY2s2czlyeHZlMDB0bzNlcjQ0MnoweGhtayJ9.A_2JYo7d7yPDljD96RCrEQ";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 13,
  center: [-122.675, 45.5051],
});

map.addControl(
  new MapBoxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    localGeocoder: forwardGeocoder,
    placeholder: 'Enter search e.g. Alta'
  })
);

map.addControl(
  new mapboxgl.NavigationControl()
);


map.on("load", () => {
  map.addSource("mapbox-traffic", {
    type: "vector",
    url: "mapbox://mapbox.mapbox-traffic-v1",
  });
  map.addLayer({
    id: "traffic-data",
    type: "line",
    source: "mapbox-traffic",
    "source-layer": "traffic",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-width": 1.5,
      "line-color": [
        "case",
        ["==", "low", ["get", "congestion"]],
        "#00908C",
        ["==", "moderate", ["get", "congestion"]],
        "#3862AE",
        ["==", "heavy", ["get", "congestion"]],
        "#ee4e8b",
        ["==", "severe", ["get", "congestion"]],
        "#b43b71",
        "#222222",
      ],
    },
  });
});

map.on('load', function () {
        map.addSource('contours', {
            type: 'vector',
            url: 'mapbox://mapbox.mapbox-terrain-v2'
        });
        map.addLayer({
            'id': 'contours',
            'type': 'line',
            'source': 'contours',
            'source-layer': 'contour',
            'layout': {
                'visibility': 'visible',
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#877b59',
                'line-width': 1
            }
        });
    });

    var customData = {
      'features': [
        {
          'type': 'Feature',
          'properties': {
          'title': 'Alta - Moving Forward!'
        },
      'geometry': {
      'coordinates': [-122.66089, 45.51774],
      'type': 'Point'
      }
    }
  ],
      'type': 'FeatureCollection'
};

function forwardGeocoder(query) {
    var matchingFeatures = [];
    for (var i = 0; i < customData.features.length; i++) {
    var feature = customData.features[i];
    if (
      feature.properties.title
      .toLowerCase()
      .search(query.toLowerCase()) !== -1
    ) {

      feature['place_name'] = '🚲 ' + feature.properties.title;
      feature['center'] = feature.geometry.coordinates;
      feature['place_type'] = ['alta'];
      matchingFeatures.push(feature);
    }
  }
return matchingFeatures;
}
