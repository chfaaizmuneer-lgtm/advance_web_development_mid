/**
 * middleware/errorHandler.js
 * Global Error Handling Middleware
 */

// 404 Not Found handler
exports.notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

// General error handler
exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const isDev = process.env.NODE_ENV === 'development';

  // API routes return JSON errors
  if (req.originalUrl.startsWith('/api')) {
    return res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      stack: isDev ? err.stack : undefined,
    });
  }

  // Web routes render error page
  res.status(statusCode).render('error', {
    message: err.message || 'Something went wrong',
    error: isDev ? err : {},
    title: `Error ${statusCode}`,
  });
};
