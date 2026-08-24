// Middleware to protect routes that require authentication
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  
  // If request is an API call, return 401 JSON
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access. Please log in.'
    });
  }
  
  // For browser pages, redirect to login
  res.redirect('/login');
};

// Middleware to redirect authenticated users away from public pages like login/register
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/tasks');
  }
  next();
};

module.exports = {
  requireAuth,
  redirectIfAuthenticated
};
