require('dotenv').config();
require('dns').setServers(['8.8.8.8']);

// Sanitize MONGODB_URI if it contains invalid options
if (process.env.MONGODB_URI) {
  try {
    const url = new URL(process.env.MONGODB_URI);
    url.searchParams.delete('studyflow');
    if (url.pathname === '/' || url.pathname === '') {
      url.pathname = '/studyflow';
    }
    process.env.MONGODB_URI = url.toString();
  } catch (e) {
    // Ignore URL parsing errors here, let mongoose handle invalid URIs
  }
}
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo').MongoStore || require('connect-mongo');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/apiRoutes');
const pageRoutes = require('./routes/pageRoutes');
const apiErrorHandler = require('./middleware/apiErrorHandler');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data and JSON (with sensible limits)
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// ──── Session Configuration ────
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Make user available to all EJS templates
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId } : null;
  next();
});

// ──── Routes ────

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'StudyFlow server is running' });
});

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
