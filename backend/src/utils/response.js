// Reusable response helpers for consistent API output.

export const success = (res, data = null, message = "OK", status = 200) =>
  res.status(status).json({ success: true, message, data });

export const created = (res, data = null, message = "Created") =>
  success(res, data, message, 201);

export const fail = (res, message = "Error", status = 400, details = null) =>
  res.status(status).json({ success: false, message, details });

export class ApiError extends Error {
  constructor(message, status = 400, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
