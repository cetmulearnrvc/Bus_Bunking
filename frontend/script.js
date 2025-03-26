let map;
let markers = {}; // Store markers by bus ID

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 12.9716, lng: 77.5946 },
        zoom: 12,
    });

    fetchBusData();
    setInterval(fetchBusData, 3000); // Auto-update every 3 seconds
}

// Fetch bus locations from backend
function fetchBusData() {
    fetch("http://localhost:3000/buses")
        .then(response => response.json())
        .then(data => updateBusesOnMap(data))
        .catch(error => console.error("Error fetching bus data:", error));
}

// Update bus markers on the map
function updateBusesOnMap(buses) {
    buses.forEach(bus => {
        const [lat, lng] = bus.location.split(",").map(Number);

        if (markers[bus.id]) {
            markers[bus.id].setPosition({ lat, lng });
        } else {
            markers[bus.id] = new google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: `Bus ${bus.id} - Load: ${bus.load}`,
                icon: "bus-icon.png",
            });
        }
    });
}
