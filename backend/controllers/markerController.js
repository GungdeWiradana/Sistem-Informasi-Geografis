const db = require('../config/db');

// Ambil semua marker
exports.getAllMarkers = (req, res) => {
  db.query('SELECT * FROM markers', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Tambah marker baru
exports.createMarker = (req, res) => {
  const { name, latitude, longitude, description } = req.body;
  const sql = 'INSERT INTO markers (name, latitude, longitude, description) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, latitude, longitude, description], (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send('Marker berhasil ditambahkan!');
  });
};

// Update marker
exports.updateMarker = (req, res) => {
  const { id } = req.params;
  const { name, latitude, longitude, description } = req.body;
  const sql = 'UPDATE markers SET name = ?, latitude = ?, longitude = ?, description = ? WHERE id = ?';
  db.query(sql, [name, latitude, longitude, description, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Marker berhasil diperbarui!');
  });
};

// Hapus marker
exports.deleteMarker = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM markers WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Marker berhasil dihapus!');
  });
};
