let map;
let markers = {}; // Store markers by bus ID

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 12.9716, lng: 77.5946 },
        zoom: 12,
    });

    updateBusLocations(); // Initial fetch
    setInterval(updateBusLocations, 3000); // Auto-update every 3 seconds
}

// Fetch bus locations from backend
function updateBusLocations() {
    fetch("http://localhost:1000/buses")
        .then(response => response.json())
        .then(data => {
            data.forEach(bus => {
                const [lat, lng] = bus.location.split(",").map(Number);
                if (markers[bus.id]) {
                    // Update existing marker position
                    markers[bus.id].setPosition({ lat, lng });
                } else {
                    // Create new marker
                    markers[bus.id] = new google.maps.Marker({
                        position: { lat, lng },
                        map: map,
                        title: `Bus ${bus.id} (Load: ${bus.load})`
                    });
                }
            });
        })
        .catch(error => console.error("Error fetching bus data:", error));
}
