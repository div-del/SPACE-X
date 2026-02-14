import { useState } from "react";

const endpoints = [
  {
    group: "Sensor Readings",
    color: "#00d4ff",
    icon: "📡",
    routes: [
      {
        method: "POST", path: "/api/sensor",
        desc: "Ingest one reading (ESP32 or Python AI layer)",
        body: `{\n  "sensor_type": "solar_wind",\n  "value": 450.3,\n  "unit": "km/s",\n  "source": "esp32",\n  "metadata": { "location": "L1" }\n}`,
        response: `{ "success": true, "data": { "id": "uuid", ... } }`,
        note: "sensor_type: weather | solar_wind | radiation"
      },
      {
        method: "POST", path: "/api/sensor/batch",
        desc: "Bulk ingest up to 500 readings",
        body: `{\n  "readings": [\n    { "sensor_type": "radiation", "value": 0.12, "unit": "Sv" },\n    { "sensor_type": "weather",   "value": 1013, "unit": "hPa" }\n  ]\n}`,
        response: `{ "success": true, "inserted": 2 }`,
        note: "Max 500 per batch. recorded_at optional (defaults to now)"
      },
      {
        method: "GET", path: "/api/sensor",
        desc: "List readings with filters",
        body: null,
        response: `{ "success": true, "count": 42, "data": [...] }`,
        note: "Query params: sensor_type, source, from, to, limit, offset"
      },
      {
        method: "GET", path: "/api/sensor/latest",
        desc: "Most recent reading per sensor type",
        body: null,
        response: `{ "success": true, "data": { "weather": {...}, "solar_wind": {...}, "radiation": {...} } }`,
        note: "Perfect for dashboard header tiles"
      },
    ]
  },
  {
    group: "Anomaly Detection",
    color: "#ff4d4d",
    icon: "⚠️",
    routes: [
      {
        method: "POST", path: "/api/anomaly",
        desc: "Report a detected anomaly (from Python LSTM model)",
        body: `{\n  "sensor_type": "radiation",\n  "value": 2.8,\n  "threshold": 1.0,\n  "severity": "high",\n  "model_version": "1.2.0",\n  "description": "Spike exceeds 3σ baseline"\n}`,
        response: `{ "success": true, "data": { "id": "uuid", "acknowledged": false, ... } }`,
        note: "severity: low | medium | high | critical"
      },
      {
        method: "GET", path: "/api/anomaly",
        desc: "List anomalies with filters",
        body: null,
        response: `{ "success": true, "count": 7, "data": [...] }`,
        note: "Query params: sensor_type, severity, acknowledged, from, to, limit"
      },
      {
        method: "GET", path: "/api/anomaly/summary",
        desc: "Count of anomalies by severity (dashboard badge)",
        body: null,
        response: `{ "success": true, "data": { "low": 4, "medium": 2, "high": 1, "critical": 0 } }`,
        note: "No filters — returns total counts across all time"
      },
      {
        method: "PATCH", path: "/api/anomaly/:id/acknowledge",
        desc: "Mark an anomaly as acknowledged by operator",
        body: null,
        response: `{ "success": true, "data": { "acknowledged": true, "acknowledged_at": "..." } }`,
        note: "Replace :id with the anomaly UUID"
      },
    ]
  },
  {
    group: "Stability Scores",
    color: "#7eff6a",
    icon: "📊",
    routes: [
      {
        method: "POST", path: "/api/stability",
        desc: "Store a computed stability score from the AI model",
        body: `{\n  "sensor_type": "weather",\n  "score": 0.87,\n  "window_hours": 24,\n  "model_version": "1.2.0",\n  "drift_detected": false,\n  "drift_magnitude": null\n}`,
        response: `{ "success": true, "data": { "id": "uuid", "score": 0.87, ... } }`,
        note: "score: float 0.0 (chaotic) → 1.0 (perfectly stable)"
      },
      {
        method: "GET", path: "/api/stability/latest",
        desc: "Latest score per sensor type",
        body: null,
        response: `{ "success": true, "data": { "weather": {...}, "solar_wind": {...}, "radiation": {...} } }`,
        note: "Ideal for the 3 stability tiles on your dashboard"
      },
      {
        method: "GET", path: "/api/stability/history",
        desc: "Time-series of stability scores for trend charts",
        body: null,
        response: `{ "success": true, "count": 120, "data": [...] }`,
        note: "Query params: sensor_type, from, to, limit (max 200)"
      },
      {
        method: "GET", path: "/api/stability/drift",
        desc: "All recorded drift events",
        body: null,
        response: `{ "success": true, "count": 3, "data": [...] }`,
        note: "Only returns rows where drift_detected = true"
      },
    ]
  },
  {
    group: "Health",
    color: "#c084fc",
    icon: "💓",
    routes: [
      {
        method: "GET", path: "/api/health",
        desc: "Server + Supabase connectivity check",
        body: null,
        response: `{ "status": "healthy", "database": "ok", "uptime_s": 3600, "response_ms": 42 }`,
        note: "Returns 503 if Supabase is unreachable"
      },
    ]
  }
];

const METHOD_COLORS = {
  GET:   { bg: "#1a3a2a", text: "#4ade80", border: "#166534" },
  POST:  { bg: "#1a2a3a", text: "#60a5fa", border: "#1e40af" },
  PATCH: { bg: "#2a1a3a", text: "#c084fc", border: "#6b21a8" },
};

export default function APIReference() {
  const [activeGroup, setActiveGroup] = useState(null);
  const [expandedRoute, setExpandedRoute] = useState(null);

  const filtered = activeGroup
    ? endpoints.filter(e => e.group === activeGroup)
    : endpoints;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      color: "#e2e8f0",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: "32px 24px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🚀</span>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", color: "#fff" }}>
            SPACE-X Backend API
          </h1>
          <span style={{
            background: "#1a1a2e", border: "1px solid #334155",
            borderRadius: 6, padding: "2px 10px", fontSize: 11, color: "#64748b"
          }}>
            localhost:5000
          </span>
        </div>
        <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
          Express + Supabase · 3 tables · 12 endpoints
        </p>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        <button onClick={() => setActiveGroup(null)} style={{
          background: !activeGroup ? "#1e293b" : "transparent",
          border: `1px solid ${!activeGroup ? "#475569" : "#1e293b"}`,
          color: !activeGroup ? "#e2e8f0" : "#64748b",
          borderRadius: 20, padding: "4px 14px", fontSize: 12, cursor: "pointer"
        }}>All</button>
        {endpoints.map(e => (
          <button key={e.group} onClick={() => setActiveGroup(activeGroup === e.group ? null : e.group)} style={{
            background: activeGroup === e.group ? "#1e293b" : "transparent",
            border: `1px solid ${activeGroup === e.group ? e.color + "66" : "#1e293b"}`,
            color: activeGroup === e.group ? e.color : "#64748b",
            borderRadius: 20, padding: "4px 14px", fontSize: 12, cursor: "pointer"
          }}>
            {e.icon} {e.group}
          </button>
        ))}
      </div>

      {/* Endpoint groups */}
      {filtered.map(group => (
        <div key={group.group} style={{ marginBottom: 32 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10, marginBottom: 14,
            borderBottom: `1px solid ${group.color}22`, paddingBottom: 10
          }}>
            <span style={{ fontSize: 18 }}>{group.icon}</span>
            <span style={{ color: group.color, fontWeight: 600, fontSize: 14, letterSpacing: "0.5px" }}>
              {group.group.toUpperCase()}
            </span>
            <span style={{ color: "#334155", fontSize: 12 }}>
              {group.routes.length} endpoint{group.routes.length > 1 ? "s" : ""}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {group.routes.map((route, i) => {
              const key = `${group.group}-${i}`;
              const isOpen = expandedRoute === key;
              const mc = METHOD_COLORS[route.method] || METHOD_COLORS.GET;

              return (
                <div key={key} style={{
                  background: "#0f1117",
                  border: `1px solid ${isOpen ? group.color + "44" : "#1e293b"}`,
                  borderRadius: 10,
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}>
                  {/* Row */}
                  <div
                    onClick={() => setExpandedRoute(isOpen ? null : key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 16px", cursor: "pointer",
                    }}
                  >
                    <span style={{
                      background: mc.bg, color: mc.text, border: `1px solid ${mc.border}`,
                      borderRadius: 5, padding: "2px 8px", fontSize: 11, fontWeight: 700,
                      minWidth: 44, textAlign: "center", letterSpacing: "0.5px"
                    }}>{route.method}</span>
                    <span style={{ color: "#94a3b8", fontSize: 13, flex: 1 }}>
                      <span style={{ color: "#e2e8f0" }}>{route.path}</span>
                    </span>
                    <span style={{ color: "#475569", fontSize: 12, flex: 2 }}>{route.desc}</span>
                    <span style={{ color: "#334155", fontSize: 14, userSelect: "none" }}>
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #1e293b", padding: "16px" }}>
                      {route.note && (
                        <div style={{
                          background: "#0d1117", border: "1px solid #334155",
                          borderRadius: 6, padding: "8px 12px", marginBottom: 12,
                          fontSize: 12, color: "#64748b"
                        }}>
                          💡 {route.note}
                        </div>
                      )}
                      <div style={{ display: "grid", gridTemplateColumns: route.body ? "1fr 1fr" : "1fr", gap: 12 }}>
                        {route.body && (
                          <div>
                            <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, letterSpacing: "1px" }}>REQUEST BODY</div>
                            <pre style={{
                              background: "#060608", border: "1px solid #1e293b", borderRadius: 6,
                              padding: 12, margin: 0, fontSize: 11, color: "#7dd3fc",
                              overflowX: "auto", lineHeight: 1.6
                            }}>{route.body}</pre>
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, letterSpacing: "1px" }}>RESPONSE</div>
                          <pre style={{
                            background: "#060608", border: "1px solid #1e293b", borderRadius: 6,
                            padding: 12, margin: 0, fontSize: 11, color: "#86efac",
                            overflowX: "auto", lineHeight: 1.6
                          }}>{route.response}</pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div style={{ borderTop: "1px solid #1e293b", paddingTop: 20, marginTop: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {[
            { label: "Supabase Tables", value: "sensor_readings · anomalies · stability_scores" },
            { label: "Auth", value: "service_role key (in .env) — never expose to frontend" },
            { label: "Python AI → Backend", value: "POST /api/sensor/batch  ·  POST /api/stability  ·  POST /api/anomaly" },
          ].map(item => (
            <div key={item.label} style={{
              background: "#0f1117", border: "1px solid #1e293b",
              borderRadius: 8, padding: "10px 14px"
            }}>
              <div style={{ fontSize: 10, color: "#475569", letterSpacing: "1px", marginBottom: 4 }}>{item.label.toUpperCase()}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
