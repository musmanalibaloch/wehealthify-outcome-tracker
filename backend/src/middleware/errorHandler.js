export function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details: messages });
  }

  if (err.code === 11000) {
    return res.status(409).json({ error: 'Resource already exists', field: err.keyPattern });
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  res.status(status).json({ error: message });
}
