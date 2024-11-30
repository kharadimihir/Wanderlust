document.addEventListener('DOMContentLoaded', function () {
    // Use the coordinates passed from the server-side
    var map = L.map('map').setView([coordinates[1], coordinates[0]], 13);  // Set initial map view to listing's coordinates
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);

    // Add marker for the listing's location
    var marker = L.marker([coordinates[1], coordinates[0]]).addTo(map)
        .bindPopup(('<b>' + listing.location + '</b><br><p>Exact location will be provided after booking</p>'))
        .openPopup();  // You can use the listing's title and location in the popup

    // Set map center and zoom dynamically based on listing coordinates
    map.setView([coordinates[1], coordinates[0]], 13); // Update map view to the listing's coordinates

    // Add geocoding control (optional)
    var options = {
        key: `${mapToken}`,
        limit: 10,
        proximity: [coordinates[1], coordinates[0]].join(','),
    };

    var geocoder = L.Control.geocoder(options).addTo(map);
});
