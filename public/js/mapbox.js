/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicGh1Y3R2MzAyIiwiYSI6ImNrdng0NGkwbWNjY2szMHM3Z3NybDU2MG0ifQ.U6z1eZuY-ceOz7A6FcLQ6g';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/phuctv302/ckvx6b2za24ou15q9mj8ebgm0',
    scrollZoom: false,
  });

  // Add zoom and rotation controls
  map.addControl(new mapboxgl.NavigationControl());

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    // add marker to map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add pop up
    new mapboxgl.Popup({
      closeOnClick: false,
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`Day ${loc.day}: ${loc.description}`)
      .addTo(map);

    // Extend map bound to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
