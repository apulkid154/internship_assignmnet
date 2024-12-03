const sqlite3 = require('sqlite3').verbose();

// Create and connect to the database
const db = new sqlite3.Database('./schools.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the schools database.');
});

// Initialize the table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL
    )
  `);
});

module.exports = db;
