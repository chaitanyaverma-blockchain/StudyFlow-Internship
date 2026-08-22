const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/apiRoutes');
const pageRoutes = require('./routes/pageRoutes');
const apiErrorHandler = require('./middleware/apiErrorHandler');

const app = express();
const PORT = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data and JSON (with sensible limits)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ──── Routes ────

// Mount API routes
app.use('/api', apiRoutes);

// Mount Page routes
app.use('/', pageRoutes);

// ──── Error Handling ────

// Specific JSON error handler for API routes
app.use(apiErrorHandler);

// 404 handler – catches all unmatched page routes
app.use((req, res) => {
  // If it's an API route that missed, return JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ success: false, message: 'API Route Not Found' });
  }
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Default Error handler for page routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { title: 'Error', message: 'Something went wrong on the server.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`StudyFlow server is running at http://localhost:${PORT}`);
});
