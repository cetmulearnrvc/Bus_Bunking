const map = L.map('map').setView([12.97, 77.59], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

function fetchBusData() {
    fetch("http://localhost:3000/buses")
        .then(res => res.json())
        .then(data => {
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) map.removeLayer(layer);
            });

            data.forEach(bus => {
                let [lat, lon] = bus.location.split(",").map(Number);
                L.marker([lat, lon]).addTo(map).bindPopup(`Bus ${bus.id} - Load: ${bus.load}`);
            });
        });
}

function fetchDecisions() {
    fetch("http://localhost:3000/stop-skip-decision")
        .then(res => res.json())
        .then(decisions => {
            document.getElementById("decisions").innerHTML = decisions.map(d => 
                `<p>Bus ${d.bus_id}: ${d.skip_stop ? "Skipping Next Stop 🚀" : "Stopping 🛑"}</p>`
            ).join("");
        });
}

// Refresh data every 5 seconds
setInterval(() => {
    fetchBusData();
    fetchDecisions();
}, 5000);
