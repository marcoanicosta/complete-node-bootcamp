/* eslint-disable*/
export const displayMap = ( locations) => {
mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY29jb3N0YTEiLCJhIjoiY2xhenJ0MTNoMHZodDNwb3E2Y3kwY2RvayJ9.22xB7_3QuO-QC8VugyE67g';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/marcocosta1/clazz0arr007s14lgs2uit8o4', // style URL
    // center: [-121.325674,38.863151],
    // zoom: 8,
    // interactive: false
    scrollZoom: false

});


const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc =>{
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    })
        .setLngLat(loc.coordinates)
        .addTo(map);

    //Add popup
    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);

    //Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100

        }
    });
};