const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // ✅ Make sure path is correct
const protectedRoutes = require('./routes/protectedRoutes');
const { pool } = require('./config/db'); // Optional, just to check DB connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json()); // ✅ Parse JSON bodies

// ✅ Register auth routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);

// Optional: root route to test server
app.get('/', (req, res) => {
  res.send('Zepto backend is running!');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
