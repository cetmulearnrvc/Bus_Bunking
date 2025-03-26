import fetch from "node-fetch";

// Dummy Bus Data
const buses = [
    { id: 1, lat: 12.9716, lon: 77.5946, load: 25 },
    { id: 2, lat: 12.9720, lon: 77.5950, load: 18 },
];

// Function to update bus locations
async function updateBusLocations() {
    for (let bus of buses) {
        // Simulating small random movement
        bus.lat += (Math.random() - 0.5) * 0.001;
        bus.lon += (Math.random() - 0.5) * 0.001;
        bus.load = Math.floor(Math.random() * 50); // Random load

        await fetch("http://localhost:3000/update-bus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: bus.id, location: `${bus.lat},${bus.lon}`, load: bus.load })
        });
    }
}

// Update locations every 5 seconds
setInterval(updateBusLocations, 5000);
console.log("🚀 GPS Simulation running...");
