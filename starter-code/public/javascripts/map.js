mapboxgl.accessToken = 'pk.eyJ1IjoiYXNlYndlYmRldiIsImEiOiJjanJ0ODV6MDgwaTNvNDNteTM0M2JsaDBpIn0.Xc7UMIWCDtK2c4RRT3R3qw';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
zoom: 3,
  center: [13.41, 52.52]
});


if(navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    let lng=position.coords.longitude;
    let lat=position.coords.latitude;
    map.setCenter([lng,lat]);

    var userMarker = new mapboxgl.Marker({
      color: "red",
      draggable: false
    })
      .setLngLat([lng, lat])
      .addTo(map);
  });
}

// Marker
var marker = new mapboxgl.Marker({
  color: "blue",
  draggable: true
})
  .setLngLat([11.41, 33.52])
  .addTo(map);

  