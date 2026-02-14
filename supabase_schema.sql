-- ================================================================
-- SPACE-X :: Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ================================================================

-- ── 1. sensor_readings ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sensor_readings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_type  TEXT NOT NULL CHECK (sensor_type IN ('weather', 'solar_wind', 'radiation')),
  value        NUMERIC NOT NULL,
  unit         TEXT NOT NULL,
  source       TEXT NOT NULL DEFAULT 'esp32',
  metadata     JSONB DEFAULT '{}',
  recorded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for time-range queries on sensor type
CREATE INDEX IF NOT EXISTS idx_sensor_readings_type_time
  ON sensor_readings (sensor_type, recorded_at DESC);

-- ── 2. anomalies ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS anomalies (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_type      TEXT NOT NULL CHECK (sensor_type IN ('weather', 'solar_wind', 'radiation')),
  reading_id       UUID REFERENCES sensor_readings(id) ON DELETE SET NULL,
  value            NUMERIC NOT NULL,
  threshold        NUMERIC,
  severity         TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  model_version    TEXT NOT NULL DEFAULT '1.0.0',
  description      TEXT,
  metadata         JSONB DEFAULT '{}',
  detected_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  acknowledged     BOOLEAN NOT NULL DEFAULT FALSE,
  acknowledged_at  TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for unacknowledged critical anomalies (dashboard alert panel)
CREATE INDEX IF NOT EXISTS idx_anomalies_unacked
  ON anomalies (severity, acknowledged, detected_at DESC)
  WHERE acknowledged = FALSE;

-- ── 3. stability_scores ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stability_scores (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_type      TEXT NOT NULL CHECK (sensor_type IN ('weather', 'solar_wind', 'radiation')),
  score            NUMERIC NOT NULL CHECK (score >= 0 AND score <= 1),
  window_hours     INTEGER NOT NULL DEFAULT 24,
  model_version    TEXT NOT NULL DEFAULT '1.0.0',
  drift_detected   BOOLEAN NOT NULL DEFAULT FALSE,
  drift_magnitude  NUMERIC,
  metadata         JSONB DEFAULT '{}',
  computed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for latest score per type
CREATE INDEX IF NOT EXISTS idx_stability_type_time
  ON stability_scores (sensor_type, computed_at DESC);

-- ── 4. Row-Level Security (RLS) ─────────────────────────────────
-- Backend uses service role key → bypasses RLS automatically.
-- If you ever expose these tables via anon key, enable RLS here.

ALTER TABLE sensor_readings  ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies        ENABLE ROW LEVEL SECURITY;
ALTER TABLE stability_scores ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (already the default, but explicit is good)
CREATE POLICY "service_role_all_sensor_readings"
  ON sensor_readings FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_anomalies"
  ON anomalies FOR ALL
  TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_stability_scores"
  ON stability_scores FOR ALL
  TO service_role USING (true) WITH CHECK (true);
