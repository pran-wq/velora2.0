import { logger } from "../utils/logger.js";

// 404 handler — mount after all routes.
export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

// Centralized error handler — mount last.
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  logger.error(err.message, status === 500 ? err.stack : "");
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
    details: err.details || null,
  });
};

export default errorHandler;
