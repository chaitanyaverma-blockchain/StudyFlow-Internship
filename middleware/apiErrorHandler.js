// Error handler specifically for /api/* routes
const apiErrorHandler = (err, req, res, next) => {
  // Only intercept if the route starts with /api
  if (req.originalUrl.startsWith('/api/')) {
    console.error('API Error:', err.stack || err);
    
    // Check if it's a JSON parsing error
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON payload format'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unexpected server error'
    });
  }
  
  // Otherwise, pass it down to the default EJS error handler
  next(err);
};

module.exports = apiErrorHandler;
