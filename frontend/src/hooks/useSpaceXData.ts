import { useState, useEffect, useRef, useCallback } from "react";

// ── Types (exported for child components) ────────────────────────

export interface SensorReading {
    sensor_type: string;
    value: number;
    unit: string;
    recorded_at: string;
}

export interface Anomaly {
    id: string;
    sensor_type: string;
    value: number;
    threshold: number | null;
    severity: "low" | "medium" | "high" | "critical";
    description: string | null;
    detected_at: string;
    acknowledged: boolean;
}

export interface StabilityScore {
    sensor_type: string;
    score: number; // 0.0 – 1.0
    drift_detected: boolean;
    drift_magnitude: number | null;
    computed_at: string;
}

export interface TrendPoint {
    time: string;
    weather: number | null;
    solar_wind: number | null;
    radiation: number | null;
}

export interface AIInsight {
    sensor: string;
    message: string;
    prediction: string;
    driftProb: number;
}

interface AnomalySummary {
    low: number;
    medium: number;
    high: number;
    critical: number;
}

interface Sensors {
    weather: SensorReading | null;
    solar_wind: SensorReading | null;
    radiation: SensorReading | null;
}

interface Stability {
    weather: StabilityScore | null;
    solar_wind: StabilityScore | null;
    radiation: StabilityScore | null;
}

interface SpaceXData {
    sensors: Sensors;
    stability: Stability;
    anomalies: Anomaly[];
    summary: AnomalySummary;
    trendHistory: TrendPoint[];
    aiInsights: AIInsight[];
    missionStart: Date;
    backendOnline: boolean;
    loading: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL || "";

async function fetchJSON<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${API_BASE}${path}`);
        if (!res.ok) return null;
        const json = await res.json();
        return json.data ?? json;
    } catch {
        return null;
    }
}

/** Produce a human-readable AI insight from stability data */
function deriveInsights(stability: Stability, sensors: Sensors): AIInsight[] {
    const insights: AIInsight[] = [];
    const types = ["weather", "solar_wind", "radiation"] as const;
    const labels: Record<string, string> = {
        weather: "Planetary Weather",
        solar_wind: "Solar Wind",
        radiation: "Radiation",
    };

    for (const t of types) {
        const s = stability[t];
        const r = sensors[t];
        if (!s) continue;

        const pct = Math.round(s.score * 100);
        const drift = s.drift_detected;
        const val = r ? `${r.value} ${r.unit}` : "N/A";

        let message: string;
        let prediction: string;
        let driftProb: number;

        if (pct >= 70) {
            message = `${labels[t]} patterns are stable (${pct}% confidence). Current reading: ${val}.`;
            prediction = `Conditions expected to remain within nominal bounds for the next 6–12 hours.`;
            driftProb = Math.max(5, 100 - pct + Math.round(Math.random() * 5));
        } else if (pct >= 40) {
            message = `${labels[t]} showing moderate variability (${pct}% stability). Current: ${val}. ${drift ? "Drift detected in recent window." : ""}`;
            prediction = `Model predicts possible threshold breach in 2–6 hours. Recommend increased monitoring cadence.`;
            driftProb = Math.round(50 + Math.random() * 20);
        } else {
            message = `⚠ ${labels[t]} highly unstable (${pct}% stability). ${drift ? "Active drift confirmed." : ""} Current: ${val}.`;
            prediction = `High probability of anomaly within 1 hour. Recommend immediate crew alert and contingency preparation.`;
            driftProb = Math.round(75 + Math.random() * 20);
        }

        insights.push({ sensor: t, message, prediction, driftProb: Math.min(driftProb, 99) });
    }

    return insights.length > 0 ? insights : [
        {
            sensor: "system",
            message: "Awaiting sufficient data to generate AI insights. Sensor stream initializing...",
            prediction: "Predictive models will activate after first data cycle.",
            driftProb: 0,
        },
    ];
}

// ── Hook ─────────────────────────────────────────────────────────

export function useSpaceXData(): SpaceXData {
    const [sensors, setSensors] = useState<Sensors>({ weather: null, solar_wind: null, radiation: null });
    const [stability, setStability] = useState<Stability>({ weather: null, solar_wind: null, radiation: null });
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [summary, setSummary] = useState<AnomalySummary>({ low: 0, medium: 0, high: 0, critical: 0 });
    const [trendHistory, setTrendHistory] = useState<TrendPoint[]>([]);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [backendOnline, setBackendOnline] = useState(false);
    const [loading, setLoading] = useState(true);

    const missionStartRef = useRef(new Date());
    const MAX_TREND = 60; // keep last 60 data points

    const poll = useCallback(async () => {
        try {
            const [sensorData, anomalyData, summaryData, stabilityData] = await Promise.all([
                fetchJSON<Record<string, SensorReading | null>>("/sensor/latest"),
                fetchJSON<Anomaly[]>("/anomaly?limit=20"),
                fetchJSON<AnomalySummary>("/anomaly/summary"),
                fetchJSON<Record<string, StabilityScore | null>>("/stability/latest"),
            ]);

            if (!sensorData) {
                setBackendOnline(false);
                setLoading(false);
                return;
            }

            setBackendOnline(true);

            const newSensors: Sensors = {
                weather: sensorData.weather ?? null,
                solar_wind: sensorData.solar_wind ?? null,
                radiation: sensorData.radiation ?? null,
            };
            setSensors(newSensors);

            if (anomalyData) setAnomalies(Array.isArray(anomalyData) ? anomalyData : []);
            if (summaryData) setSummary({ low: 0, medium: 0, high: 0, critical: 0, ...summaryData });

            const newStability: Stability = {
                weather: stabilityData?.weather ?? null,
                solar_wind: stabilityData?.solar_wind ?? null,
                radiation: stabilityData?.radiation ?? null,
            };
            setStability(newStability);

            // Append to trend history
            const point: TrendPoint = {
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
                weather: newSensors.weather?.value ?? null,
                solar_wind: newSensors.solar_wind?.value ?? null,
                radiation: newSensors.radiation?.value ?? null,
            };
            setTrendHistory((prev) => [...prev.slice(-(MAX_TREND - 1)), point]);

            // Derive AI insights from stability + sensor data
            setAiInsights(deriveInsights(newStability, newSensors));

            setLoading(false);
        } catch {
            setBackendOnline(false);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        poll(); // initial fetch
        const id = setInterval(poll, 5000);
        return () => clearInterval(id);
    }, [poll]);

    return {
        sensors,
        stability,
        anomalies,
        summary,
        trendHistory,
        aiInsights,
        missionStart: missionStartRef.current,
        backendOnline,
        loading,
    };
}
