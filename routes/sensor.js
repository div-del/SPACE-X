import { Router } from "express";
import supabase from "../config/supabase.js";
import { validateSensorPayload } from "../middleware/validators.js";

const router = Router();

// ── POST /api/sensor ───────────────────────────────────────────
// Ingest a sensor reading (from ESP32, Python AI layer, or simulator)
router.post("/", validateSensorPayload, async (req, res, next) => {
  try {
    const { sensor_type, value, unit, source, metadata } = req.body;

    const { data, error } = await supabase
      .from("sensor_readings")
      .insert([{
        sensor_type,           // "weather" | "solar_wind" | "radiation"
        value,                 // numeric reading
        unit,                  // "hPa" | "km/s" | "Sv" etc.
        source: source || "esp32",
        metadata: metadata || {},
        recorded_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ── POST /api/sensor/batch ─────────────────────────────────────
// Bulk ingest (e.g. Python AI model sending a batch of processed readings)
router.post("/batch", async (req, res, next) => {
  try {
    const { readings } = req.body;

    if (!Array.isArray(readings) || readings.length === 0) {
      return res.status(400).json({ error: "readings must be a non-empty array" });
    }

    if (readings.length > 500) {
      return res.status(400).json({ error: "Batch limit is 500 readings" });
    }

    const rows = readings.map((r) => ({
      sensor_type: r.sensor_type,
      value:       r.value,
      unit:        r.unit,
      source:      r.source || "batch",
      metadata:    r.metadata || {},
      recorded_at: r.recorded_at || new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("sensor_readings")
      .insert(rows)
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, inserted: data.length });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/sensor ────────────────────────────────────────────
// Retrieve readings with optional filters
router.get("/", async (req, res, next) => {
  try {
    const {
      sensor_type,
      source,
      from,
      to,
      limit = 100,
      offset = 0,
    } = req.query;

    let query = supabase
      .from("sensor_readings")
      .select("*")
      .order("recorded_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (sensor_type) query = query.eq("sensor_type", sensor_type);
    if (source)      query = query.eq("source", source);
    if (from)        query = query.gte("recorded_at", from);
    if (to)          query = query.lte("recorded_at", to);

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/sensor/latest ─────────────────────────────────────
// Get the most recent reading per sensor type
router.get("/latest", async (req, res, next) => {
  try {
    const types = ["weather", "solar_wind", "radiation"];
    const results = {};

    await Promise.all(
      types.map(async (type) => {
        const { data, error } = await supabase
          .from("sensor_readings")
          .select("*")
          .eq("sensor_type", type)
          .order("recorded_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error) results[type] = data;
      })
    );

    res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
});

export default router;
