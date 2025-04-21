const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const markerRoutes = require('./routes/markerRoutes');
require('./config/db'); // koneksi database

dotenv.config();
const app = express();


app.use(cors());

app.use(bodyParser.json());
app.use('/api/auth', authRoutes);
app.use('/api/markers', markerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
