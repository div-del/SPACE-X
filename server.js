import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sensorRoutes from "./routes/sensor.js";
import anomalyRoutes from "./routes/anomaly.js";
import stabilityRoutes from "./routes/stability.js";
import healthRoutes from "./routes/health.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(requestLogger);

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/sensor",    sensorRoutes);
app.use("/api/anomaly",   anomalyRoutes);
app.use("/api/stability", stabilityRoutes);
app.use("/api/health",    healthRoutes);

// ── 404 Catch-all ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// ── Global Error Handler ───────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 SPACE-X backend running on port ${PORT}`);
  console.log(`   ENV: ${process.env.NODE_ENV || "development"}`);
});

export default app;
