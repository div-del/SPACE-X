import { Router } from "express";
import supabase from "../config/supabase.js";

const router = Router();

// ── POST /api/anomaly ──────────────────────────────────────────
// Called by the Python AI layer when an anomaly is detected
router.post("/", async (req, res, next) => {
  try {
    const {
      sensor_type,
      reading_id,      // FK to sensor_readings (optional)
      value,
      threshold,
      severity,        // "low" | "medium" | "high" | "critical"
      model_version,
      description,
      metadata,
    } = req.body;

    if (!sensor_type || value === undefined || !severity) {
      return res.status(400).json({
        error: "sensor_type, value, and severity are required",
      });
    }

    const validSeverities = ["low", "medium", "high", "critical"];
    if (!validSeverities.includes(severity)) {
      return res.status(400).json({
        error: `severity must be one of: ${validSeverities.join(", ")}`,
      });
    }

    const { data, error } = await supabase
      .from("anomalies")
      .insert([{
        sensor_type,
        reading_id:    reading_id || null,
        value,
        threshold:     threshold ?? null,
        severity,
        model_version: model_version || "1.0.0",
        description:   description || null,
        metadata:      metadata || {},
        detected_at:   new Date().toISOString(),
        acknowledged:  false,
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/anomaly ───────────────────────────────────────────
// List anomalies, filterable by severity, type, acknowledged state
router.get("/", async (req, res, next) => {
  try {
    const {
      sensor_type,
      severity,
      acknowledged,
      from,
      to,
      limit = 50,
      offset = 0,
    } = req.query;

    let query = supabase
      .from("anomalies")
      .select("*")
      .order("detected_at", { ascending: false })
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (sensor_type)   query = query.eq("sensor_type", sensor_type);
    if (severity)      query = query.eq("severity", severity);
    if (acknowledged !== undefined) {
      query = query.eq("acknowledged", acknowledged === "true");
    }
    if (from) query = query.gte("detected_at", from);
    if (to)   query = query.lte("detected_at", to);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/anomaly/summary ───────────────────────────────────
// Count of anomalies by severity (useful for dashboard widgets)
router.get("/summary", async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from("anomalies")
      .select("severity");

    if (error) throw error;

    const summary = data.reduce((acc, row) => {
      acc[row.severity] = (acc[row.severity] || 0) + 1;
      return acc;
    }, { low: 0, medium: 0, high: 0, critical: 0 });

    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

// ── PATCH /api/anomaly/:id/acknowledge ────────────────────────
// Mark an anomaly as acknowledged (operator workflow)
router.patch("/:id/acknowledge", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("anomalies")
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Anomaly not found" });

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

export default router;
