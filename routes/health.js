import { Router } from "express";
import supabase from "../config/supabase.js";

const router = Router();

// ── GET /api/health ────────────────────────────────────────────
router.get("/", async (req, res) => {
  const start = Date.now();

  // Ping Supabase with a lightweight query
  const { error } = await supabase
    .from("sensor_readings")
    .select("id")
    .limit(1);

  const dbStatus = error ? "unreachable" : "ok";
  const responseTime = Date.now() - start;

  res.status(dbStatus === "ok" ? 200 : 503).json({
    status:        dbStatus === "ok" ? "healthy" : "degraded",
    timestamp:     new Date().toISOString(),
    uptime_s:      Math.floor(process.uptime()),
    response_ms:   responseTime,
    database:      dbStatus,
    version:       process.env.npm_package_version || "1.0.0",
  });
});

export default router;
