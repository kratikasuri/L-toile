const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const pool = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Tokens cannot be verified securely.');
}

app.use(cors());
app.use(helmet());
app.use(express.json()); // Parse JSON bodies
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic rate limiting to reduce brute force and abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);


// Optional: root route to test server
app.get('/', (req, res) => {
  res.send('Zepto backend is running!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Generic error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
