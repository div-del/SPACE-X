"""
SPACE-X AI Model
================
Fetches real space weather data from NOAA,
computes stability scores using a rolling window approach,
detects anomalies, and POSTs everything to the Express backend.

Run: python main.py
"""

import time
import requests
import numpy as np
from datetime import datetime, timezone
from collections import deque
import logging

# ── Config ─────────────────────────────────────────────────────
BACKEND_URL   = "http://localhost:5000"
POLL_INTERVAL = 30        # seconds between NOAA fetches
WINDOW_SIZE   = 20        # rolling window for stability scoring
MODEL_VERSION = "1.2.0"

# Anomaly thresholds (based on real space weather scales)
THRESHOLDS = {
    "solar_wind": {"low": 400, "medium": 500, "high": 600, "critical": 750},
    "radiation":  {"low": 1.0, "medium": 5.0, "high": 50.0, "critical": 200.0},
    "weather":    {"low": 200, "medium": 500, "high": 1000, "critical": 2000},
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
log = logging.getLogger("SPACE-X-AI")

# ── Rolling History for Stability ──────────────────────────────
history = {
    "solar_wind": deque(maxlen=WINDOW_SIZE),
    "radiation":  deque(maxlen=WINDOW_SIZE),
    "weather":    deque(maxlen=WINDOW_SIZE),
}

# ── NOAA Data Fetchers ─────────────────────────────────────────
def fetch_solar_wind() -> dict | None:
    """Fetch real-time solar wind speed from NOAA SWPC."""
    try:
        url = "https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json"
        res = requests.get(url, timeout=10)
        data = res.json()
        # Last entry: [time, density, speed, temperature]
        latest = data[-1]
        speed = float(latest[2]) if latest[2] not in [None, ""] else None
        if speed and speed > 0:
            return {"value": round(speed, 1), "unit": "km/s"}
    except Exception as e:
        log.warning(f"Solar wind fetch failed: {e}")
    return None

def fetch_radiation() -> dict | None:
    """Fetch real-time proton flux (radiation) from NOAA GOES."""
    try:
        url = "https://services.swpc.noaa.gov/json/goes/primary/integral-protons-1-day.json"
        res = requests.get(url, timeout=10)
        data = res.json()
        # Get latest >10 MeV proton flux
        latest = data[-1]
        flux = float(latest.get("flux", 0))
        if flux > 0:
            return {"value": round(flux, 4), "unit": "pfu"}
    except Exception as e:
        log.warning(f"Radiation fetch failed: {e}")
    return None

def fetch_weather() -> dict | None:
    """Fetch geomagnetic storm index (Kp) as planetary weather proxy."""
    try:
        url = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json"
        res = requests.get(url, timeout=10)
        data = res.json()
        latest = data[-1]
        kp = float(latest[1]) if latest[1] not in [None, ""] else None
        if kp is not None:
            return {"value": round(kp, 2), "unit": "Kp"}
    except Exception as e:
        log.warning(f"Weather/Kp fetch failed: {e}")
    return None

# ── Stability Scoring ──────────────────────────────────────────
def compute_stability(sensor_type: str, value: float) -> dict:
    """
    Compute pattern stability score (0.0–1.0) using coefficient of variation.
    Lower CV = more stable = higher score.
    Also detects drift using linear regression slope.
    """
    history[sensor_type].append(value)
    window = list(history[sensor_type])

    if len(window) < 3:
        return {"score": 1.0, "drift_detected": False, "drift_magnitude": None}

    arr  = np.array(window, dtype=float)
    mean = np.mean(arr)
    std  = np.std(arr)

    # Coefficient of variation → stability
    cv    = std / mean if mean != 0 else 0
    score = max(0.0, min(1.0, 1.0 - (cv * 2)))

    # Drift detection via linear slope
    x     = np.arange(len(arr))
    slope = np.polyfit(x, arr, 1)[0]
    drift = abs(slope) > (mean * 0.02)  # >2% change per step

    return {
        "score":           round(score, 3),
        "drift_detected":  bool(drift),
        "drift_magnitude": round(float(slope), 4) if drift else None,
    }

# ── Anomaly Detection ──────────────────────────────────────────
def detect_anomaly(sensor_type: str, value: float) -> str | None:
    """Return severity string if anomaly detected, else None."""
    t = THRESHOLDS.get(sensor_type, {})
    if value >= t.get("critical", float("inf")): return "critical"
    if value >= t.get("high",     float("inf")): return "high"
    if value >= t.get("medium",   float("inf")): return "medium"
    if value >= t.get("low",      float("inf")): return "low"
    return None

# ── Backend POST helpers ───────────────────────────────────────
def post_sensor(sensor_type: str, value: float, unit: str):
    payload = {
        "sensor_type": sensor_type,
        "value":       value,
        "unit":        unit,
        "source":      "python_model",
        "metadata":    {"model_version": MODEL_VERSION},
    }
    res = requests.post(f"{BACKEND_URL}/api/sensor", json=payload, timeout=5)
    res.raise_for_status()
    return res.json().get("data", {})

def post_stability(sensor_type: str, stability: dict, window_hours: float):
    payload = {
        "sensor_type":     sensor_type,
        "score":           stability["score"],
        "window_hours":    max(1, int(window_hours * 60)),
        "model_version":   MODEL_VERSION,
        "drift_detected":  stability["drift_detected"],
        "drift_magnitude": stability["drift_magnitude"],
    }
    res = requests.post(f"{BACKEND_URL}/api/stability", json=payload, timeout=5)
    res.raise_for_status()

def post_anomaly(sensor_type: str, value: float, severity: str, reading_id: str | None):
    payload = {
        "sensor_type":   sensor_type,
        "value":         value,
        "severity":      severity,
        "model_version": MODEL_VERSION,
        "reading_id":    reading_id,
        "description":   f"{sensor_type.replace('_',' ').title()} exceeded {severity} threshold",
    }
    res = requests.post(f"{BACKEND_URL}/api/anomaly", json=payload, timeout=5)
    res.raise_for_status()

# ── Main Loop ──────────────────────────────────────────────────
def run():
    log.info("🚀 SPACE-X AI Model starting...")
    log.info(f"   Backend : {BACKEND_URL}")
    log.info(f"   Interval: every {POLL_INTERVAL}s")
    log.info(f"   Window  : {WINDOW_SIZE} readings")

    cycle = 0
    while True:
        cycle += 1
        log.info(f"── Cycle {cycle} ─────────────────────────────")

        sensors = {
            "solar_wind": fetch_solar_wind(),
            "radiation":  fetch_radiation(),
            "weather":    fetch_weather(),
        }

        for sensor_type, reading in sensors.items():
            if reading is None:
                log.warning(f"  {sensor_type}: no data from NOAA")
                continue

            value = reading["value"]
            unit  = reading["unit"]
            log.info(f"  {sensor_type}: {value} {unit}")

            try:
                # 1. Post sensor reading
                saved = post_sensor(sensor_type, value, unit)
                reading_id = saved.get("id")

                # 2. Compute + post stability (only after 3+ readings)
                stability = compute_stability(sensor_type, value)
                window_hours = round((len(history[sensor_type]) * POLL_INTERVAL) / 3600, 4)
                if window_hours == 0:
                    window_hours = 0.01
                if len(history[sensor_type]) >= 3:
                    post_stability(sensor_type, stability, window_hours)
                log.info(f"    stability={stability['score']:.3f} drift={stability['drift_detected']}")

                # 3. Detect + post anomaly
                severity = detect_anomaly(sensor_type, value)
                if severity:
                    post_anomaly(sensor_type, value, severity, reading_id)
                    log.warning(f"    ⚠ ANOMALY [{severity.upper()}] detected!")

            except requests.RequestException as e:
                log.error(f"  Backend POST failed for {sensor_type}: {e}")

        log.info(f"  Sleeping {POLL_INTERVAL}s...")
        time.sleep(POLL_INTERVAL)

if __name__ == "__main__":
    run()
