const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database'); // Import database

const app = express();
app.use(bodyParser.json());

// Add School api
app.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, address, latitude, longitude], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// List Schools api
app.get('/listSchools', (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  db.all(`SELECT * FROM schools`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // Calculate distances and sort schools
    const schools = rows.map((school) => {
      const distance = Math.sqrt(
        Math.pow(userLat - school.latitude, 2) + Math.pow(userLon - school.longitude, 2)
      );
      return { ...school, distance };
    });

    schools.sort((a, b) => a.distance - b.distance);
    res.json(schools);
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
