// Minimal logger with levels and timestamps.

const ts = () => new Date().toISOString();

const log = (level, args) =>
  console.log(`[${ts()}] [${level}]`, ...args);

export const logger = {
  info: (...a) => log("INFO", a),
  warn: (...a) => log("WARN", a),
  error: (...a) => log("ERROR", a),
  debug: (...a) =>
    process.env.NODE_ENV !== "production" && log("DEBUG", a),
};

export default logger;
