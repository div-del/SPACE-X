const VALID_SENSOR_TYPES = ["weather", "solar_wind", "radiation"];
const VALID_SOURCES      = ["esp32", "arduino", "simulator", "python_model", "batch"];

export function validateSensorPayload(req, res, next) {
  const { sensor_type, value, unit } = req.body;

  if (!sensor_type) {
    return res.status(400).json({ error: "sensor_type is required" });
  }

  if (!VALID_SENSOR_TYPES.includes(sensor_type)) {
    return res.status(400).json({
      error: `sensor_type must be one of: ${VALID_SENSOR_TYPES.join(", ")}`,
    });
  }

  if (value === undefined || value === null) {
    return res.status(400).json({ error: "value is required" });
  }

  if (typeof value !== "number" || isNaN(value)) {
    return res.status(400).json({ error: "value must be a number" });
  }

  if (!unit || typeof unit !== "string") {
    return res.status(400).json({ error: "unit is required (e.g. hPa, km/s, Sv)" });
  }

  if (req.body.source && !VALID_SOURCES.includes(req.body.source)) {
    return res.status(400).json({
      error: `source must be one of: ${VALID_SOURCES.join(", ")}`,
    });
  }

  next();
}
