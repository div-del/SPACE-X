import { Router } from "express";
import supabase from "../config/supabase.js";

const router = Router();

// ── POST /api/stability ────────────────────────────────────────
// Receives a stability score from the Python LSTM model
router.post("/", async (req, res, next) => {
  try {
    const {
      sensor_type,
      score,           // float 0.0 – 1.0  (1.0 = perfectly stable)
      window_hours,    // how many hours of data this covers
      model_version,
      drift_detected,  // boolean
      drift_magnitude, // float | null
      metadata,
    } = req.body;

    if (!sensor_type || score === undefined) {
      return res.status(400).json({ error: "sensor_type and score are required" });
    }

    if (score < 0 || score > 1) {
      return res.status(400).json({ error: "score must be between 0.0 and 1.0" });
    }

    const { data, error } = await supabase
      .from("stability_scores")
      .insert([{
        sensor_type,
        score,
        window_hours:    window_hours || 24,
        model_version:   model_version || "1.0.0",
        drift_detected:  drift_detected ?? false,
        drift_magnitude: drift_magnitude ?? null,
        metadata:        metadata || {},
        computed_at:     new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/stability/latest ──────────────────────────────────
// Latest stability score per sensor type — ideal for dashboard tiles
router.get("/latest", async (req, res, next) => {
  try {
    const types = ["weather", "solar_wind", "radiation"];
    const results = {};

    await Promise.all(
      types.map(async (type) => {
        const { data, error } = await supabase
          .from("stability_scores")
          .select("*")
          .eq("sensor_type", type)
          .order("computed_at", { ascending: false })
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

// ── GET /api/stability/history ─────────────────────────────────
// Time-series of stability scores (for trend charts)
router.get("/history", async (req, res, next) => {
  try {
    const {
      sensor_type,
      from,
      to,
      limit = 200,
    } = req.query;

    let query = supabase
      .from("stability_scores")
      .select("sensor_type, score, drift_detected, drift_magnitude, computed_at")
      .order("computed_at", { ascending: true })
      .limit(Number(limit));

    if (sensor_type) query = query.eq("sensor_type", sensor_type);
    if (from)        query = query.gte("computed_at", from);
    if (to)          query = query.lte("computed_at", to);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/stability/drift ───────────────────────────────────
// All recorded drift events
router.get("/drift", async (req, res, next) => {
  try {
    const { sensor_type, limit = 50 } = req.query;

    let query = supabase
      .from("stability_scores")
      .select("*")
      .eq("drift_detected", true)
      .order("computed_at", { ascending: false })
      .limit(Number(limit));

    if (sensor_type) query = query.eq("sensor_type", sensor_type);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

export default router;
