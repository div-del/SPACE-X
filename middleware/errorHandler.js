export function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err.message);

  // Supabase / PostgREST errors carry a `code` field
  if (err.code) {
    return res.status(400).json({
      success: false,
      error:   err.message,
      code:    err.code,
    });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    error:   err.message || "Internal server error",
  });
}
