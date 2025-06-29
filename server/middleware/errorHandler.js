export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error
  let error = {
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString()
  };

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.error = 'Validation failed';
    error.code = 'VALIDATION_ERROR';
    error.details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json(error);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.error = 'Invalid token';
    error.code = 'TOKEN_INVALID';
    return res.status(401).json(error);
  }

  if (err.name === 'TokenExpiredError') {
    error.error = 'Token expired';
    error.code = 'TOKEN_EXPIRED';
    return res.status(401).json(error);
  }

  // SQLite errors
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    error.error = 'Resource already exists';
    error.code = 'DUPLICATE_RESOURCE';
    return res.status(409).json(error);
  }

  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    error.error = 'Referenced resource not found';
    error.code = 'FOREIGN_KEY_ERROR';
    return res.status(400).json(error);
  }

  // Custom application errors
  if (err.statusCode) {
    error.error = err.message;
    error.code = err.code || 'APPLICATION_ERROR';
    return res.status(err.statusCode).json(error);
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error.error = 'File too large';
    error.code = 'FILE_TOO_LARGE';
    return res.status(413).json(error);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error.error = 'Unexpected file field';
    error.code = 'UNEXPECTED_FILE';
    return res.status(400).json(error);
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    error.error = 'Too many requests';
    error.code = 'RATE_LIMIT_EXCEEDED';
    return res.status(429).json(error);
  }

  // Default 500 error
  res.status(500).json(error);
};

export const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = 'NOT_FOUND';
  next(error);
};