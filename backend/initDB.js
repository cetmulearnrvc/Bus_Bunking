const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./buses.db");

db.serialize(() => {
    db.run("DROP TABLE IF EXISTS buses"); // Reset table
    db.run(`CREATE TABLE buses (id INTEGER PRIMARY KEY, location TEXT, load INTEGER)`);

    const stmt = db.prepare("INSERT INTO buses (id, location, load) VALUES (?, ?, ?)");
    stmt.run(1, "12.9716,77.5946", 30);
    stmt.run(2, "12.9722,77.5938", 25);
    stmt.run(3, "12.9730,77.5922", 20);
    stmt.finalize();

    console.log("✅ Database initialized with buses");
});

db.close();
