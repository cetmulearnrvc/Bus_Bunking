const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("buses.db");

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS buses (id INTEGER PRIMARY KEY, location TEXT, load INTEGER)");

    // Insert initial bus data if table is empty
    db.get("SELECT COUNT(*) AS count FROM buses", [], (err, row) => {
        if (row.count === 0) {
            const stmt = db.prepare("INSERT INTO buses (id, location, load) VALUES (?, ?, ?)");
            stmt.run(1, "12.9716,77.5946", 30);
            stmt.run(2, "12.9611,77.5970", 20);
            stmt.run(3, "12.9500,77.6010", 15);
            stmt.finalize();
        }
    });
});

// API to get bus locations
app.get("/buses", (req, res) => {
    db.all("SELECT * FROM buses", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Simulate live bus location update every 3s
setInterval(() => {
    db.all("SELECT * FROM buses", [], (err, buses) => {
        if (err) return console.error("Error fetching buses:", err.message);

        buses.forEach(bus => {
            let [lat, lon] = bus.location.split(",").map(Number);
            lat += (Math.random() - 0.0025) * 0.005; // Small movement
            lon += (Math.random() - 0.0025) * 0.005;

            db.run("UPDATE buses SET location = ? WHERE id = ?", [`${lat},${lon}`, bus.id]);
        });
    });
}, 3000);

app.listen(1000, () => console.log("🚀 Server running on http://localhost:1000"));
