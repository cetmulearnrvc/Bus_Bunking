const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
// const maps=require("C:\Users\acer\Documents\bus-bunching-ai\frontend\index.html");

const app = express();
app.use(express.json());
app.use(cors());

// SQLite database in memory
const db = new sqlite3.Database(":memory:");
const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

db.serialize(() => {
    db.run("CREATE TABLE buses (id INTEGER PRIMARY KEY, location TEXT, load INTEGER)");
});

// API to get all buses
app.get("/buses", (req, res) => {
    db.all("SELECT * FROM buses", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// app.get("/", (req, res) => {
//     res.render(maps);
// });

app.get("/maps", (req, res) => {
    res.send("Backend is running! Use API endpoints like /buses or /stop-skip-decision.");
});
// API to update bus location & load
app.post("/update-bus", (req, res) => {
    const { id, location, load } = req.body;
    db.run("INSERT INTO buses (id, location, load) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET location=?, load=?", 
           [id, location, load, location, load], 
           (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// AI-based Stop-Skipping Decision API
app.get("/stop-skip-decision", (req, res) => {
    db.all("SELECT * FROM buses ORDER BY id", [], (err, buses) => {
        if (err) return res.status(500).json({ error: err.message });

        let decisions = buses.map((bus, index) => {
            if (index > 0) {
                let prevBus = buses[index - 1];
                let [lat1, lon1] = prevBus.location.split(",").map(Number);
                let [lat2, lon2] = bus.location.split(",").map(Number);

                let distance = Math.sqrt((lat2 - lat1) ** 2 + (lon2 - lon1) ** 2);

                return {
                    bus_id: bus.id,
                    skip_stop: distance < 0.01 && bus.load < 20
                };
            }
            return { bus_id: bus.id, skip_stop: false };
        });

        res.json(decisions);
    });
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));
