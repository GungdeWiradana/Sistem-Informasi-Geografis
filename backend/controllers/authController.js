const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // ✅ Tambahkan ini

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, hash], (err, result) => {
      if (err) return res.status(500).send('Terjadi kesalahan saat registrasi.');
      res.status(201).send('Registrasi berhasil!');
    });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan server.');
  }
};

// LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send('Terjadi kesalahan server.');
    if (results.length === 0) return res.status(401).send('Email tidak ditemukan.');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Password salah.');

    // ✅ Buat JWT token
    const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  });
};

// LOGOUT (Optional for client use)
exports.logout = (req, res) => {
  // Logout di sisi client hanya perlu menghapus token dari localStorage
  res.status(200).send('Logout berhasil (hapus token di sisi client)');
};
