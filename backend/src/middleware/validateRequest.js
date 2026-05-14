import { ApiError } from "../utils/response.js";

/**
 * Reusable validator that checks required fields exist and are non-empty on req.body.
 *
 * Usage:
 *   router.post("/x", validateRequest(["email", "password"]), handler);
 *
 * Also supports validating a different source:
 *   validateRequest(["id"], "params")
 */
export const validateRequest = (fields = [], source = "body") => {
  if (!Array.isArray(fields))
    throw new Error("validateRequest: fields must be an array");

  return (req, _res, next) => {
    const data = req[source] || {};
    const missing = [];

    for (const f of fields) {
      const v = data[f];
      if (
        v === undefined ||
        v === null ||
        (typeof v === "string" && v.trim() === "")
      )
        missing.push(f);
    }

    if (missing.length)
      return next(
        new ApiError(`Missing required field(s): ${missing.join(", ")}`, 400)
      );

    next();
  };
};

export default validateRequest;
