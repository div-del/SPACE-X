import { useState, useEffect, useRef } from "react";
import StarBackground from "@/components/StarBackground";
import StatusTile from "@/components/StatusTile";
import StabilityRing from "@/components/StabilityRing";
import AnomalyFeed from "@/components/AnomalyFeed";
import TrendGraph from "@/components/TrendGraph";
import AIInsightPanel from "@/components/AIInsightPanel";
import NasaApod from "@/components/NasaApod";
import { useSpaceXData } from "@/hooks/useSpaceXData";

// Mission timer hook
function useMissionTime(start: Date) {
  const [elapsed, setElapsed] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - start.getTime()) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, "0");
      const s = (diff % 60).toString().padStart(2, "0");
      setElapsed(`${h}h ${m}m ${s}s`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [start]);
  return elapsed;
}

// Last analysis timer
function useLastAnalysis(backendOnline: boolean) {
  const [secs, setSecs] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval>>();
  useEffect(() => {
    setSecs(0);
    clearInterval(ref.current);
    ref.current = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(ref.current);
  }, [backendOnline]);
  return secs;
}

const Index = () => {
  const { sensors, stability, anomalies, summary, trendHistory, aiInsights, missionStart, backendOnline, loading } = useSpaceXData();
  const missionTime = useMissionTime(missionStart);
  const lastAnalysisSecs = useLastAnalysis(backendOnline);

  const hasWeatherAnomaly = anomalies.some(a => a.sensor_type === "weather" && !a.acknowledged);
  const hasSolarWindAnomaly = anomalies.some(a => a.sensor_type === "solar_wind" && !a.acknowledged);
  const hasRadiationAnomaly = anomalies.some(a => a.sensor_type === "radiation" && !a.acknowledged);

  const totalAlerts = summary.critical + summary.high + summary.medium + summary.low;
  const avgStability = Math.round((
    ((stability.weather?.score ?? 0) +
      (stability.solar_wind?.score ?? 0) +
      (stability.radiation?.score ?? 0)) / 3
  ) * 100);

  // Dynamic system status
  const systemStatus = (() => {
    if (summary.critical > 0 || avgStability < 30) return {
      label: "CRITICAL ENVIRONMENT", color: "bg-destructive", dot: "bg-destructive", text: "text-destructive"
    };
    if (summary.high > 0 || avgStability < 60) return {
      label: "MODERATE RISK", color: "bg-warning", dot: "bg-warning", text: "text-warning"
    };
    return {
      label: "ALL SYSTEMS NOMINAL", color: "bg-success", dot: "bg-success", text: "text-success"
    };
  })();

  return (
    <div className="relative min-h-screen bg-grid scanline">
      <StarBackground />

      {/* Backend offline banner */}
      {!backendOnline && (
        <div className="relative z-50 w-full bg-destructive/20 border-b border-destructive/60 px-4 py-2 text-center">
          <span className="text-xs font-mono text-destructive animate-pulse">
            ⚠ BACKEND OFFLINE — cd backend && npm run dev
          </span>
        </div>
      )}

      {/* ── Live Streaming + AI Status Bar ───────────────── */}
      <div className="relative z-20 w-full border-b border-border/40 bg-card/40 backdrop-blur-sm px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        {/* Live stream indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse shadow-[0_0_6px_hsl(0_100%_64%/0.8)]" />
            <span className="text-[11px] font-mono font-bold text-foreground">LIVE SENSOR STREAM ACTIVE</span>
          </div>
          <span className="text-[10px] font-mono text-muted-foreground hidden sm:block">
            Data updating every <span className="text-primary">5</span> seconds
          </span>
          <span className="text-[10px] font-mono text-muted-foreground hidden md:block">
            Source: <span className="text-primary/80">Deep Space Simulation Node</span>
          </span>
        </div>

        {/* AI processing status */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span>AI Model Status: <span className="text-primary">Learning Pattern Stability</span></span>
          <span className="text-muted-foreground/50">•</span>
          <span>Last Analysis: <span className="text-primary">{lastAnalysisSecs}</span> seconds ago</span>
        </div>
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8 space-y-6">

        {/* ── Header ───────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-orbitron font-bold tracking-wider text-primary glow-text-cyan">
              MISSION CONTROL
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              SECTOR 7G • SOL 847 • {new Date().toLocaleTimeString()} UTC
            </p>
          </div>

          {/* Right side — status + meta */}
          <div className="flex flex-col items-end gap-1.5">
            {/* Dynamic system status */}
            <div className={`flex items-center gap-2 text-[11px] font-mono ${systemStatus.text}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${systemStatus.dot} animate-pulse`} />
              {systemStatus.label}
              {totalAlerts > 0 && (
                <span className="ml-1 text-[10px] text-muted-foreground">
                  ({summary.critical} CRIT · {summary.high} HIGH)
                </span>
              )}
            </div>

            {/* Mission time */}
            <div className="text-[10px] font-mono text-muted-foreground">
              MISSION TIME: {missionTime} ACTIVE MONITORING
            </div>

            {/* Data source label */}
            <div className="text-[10px] font-mono text-muted-foreground/60">
              DATA SOURCE: SIMULATED DEEP SPACE SENSOR STREAM • LATENCY: 2.4 SEC
            </div>
          </div>
        </div>

        {/* ── Status Tiles ─────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusTile
            icon="🌤️" label="Planetary Weather"
            value={loading ? "—" : sensors.weather ? String(sensors.weather.value) : "NO DATA"}
            unit={sensors.weather?.unit ?? "°C"}
            hasAnomaly={hasWeatherAnomaly}
          />
          <StatusTile
            icon="🌬️" label="Solar Wind"
            value={loading ? "—" : sensors.solar_wind ? String(sensors.solar_wind.value) : "NO DATA"}
            unit={sensors.solar_wind?.unit ?? "km/s"}
            hasAnomaly={hasSolarWindAnomaly}
          />
          <StatusTile
            icon="☢️" label="Radiation"
            value={loading ? "—" : sensors.radiation ? String(sensors.radiation.value) : "NO DATA"}
            unit={sensors.radiation?.unit ?? "µSv/h"}
            hasAnomaly={hasRadiationAnomaly}
          />
        </div>

        {/* ── Trend Graph (FULL WIDTH) ──────────────────────── */}
        <TrendGraph data={trendHistory} loading={loading} />

        {/* ── AI Insight + Stability ───────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIInsightPanel insights={aiInsights} loading={loading} />

          {/* Stability Panel */}
          <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm glow-border-cyan p-6">
            <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan mb-6">
              📊 Pattern Stability Score
            </h3>
            <div className="flex justify-around items-center flex-wrap gap-6">
              <StabilityRing label="Planetary" value={loading ? 0 : Math.round((stability.weather?.score ?? 0) * 100)} icon="🌤️" />
              <StabilityRing label="Solar Wind" value={loading ? 0 : Math.round((stability.solar_wind?.score ?? 0) * 100)} icon="🌬️" />
              <StabilityRing label="Radiation" value={loading ? 0 : Math.round((stability.radiation?.score ?? 0) * 100)} icon="☢️" />
            </div>
            {loading && (
              <p className="text-center text-xs font-mono text-muted-foreground mt-4 animate-pulse">
                LOADING STABILITY DATA...
              </p>
            )}
          </div>
        </div>

        {/* ── Anomaly Feed ─────────────────────────────────── */}
        <AnomalyFeed anomalies={anomalies} loading={loading} />

        {/* ── NASA APOD + Quick Links ────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NasaApod />

          {/* Quick Links */}
          <div className="rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm glow-border-cyan p-6">
            <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan mb-4">
              🚀 Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/explorer"
                className="group rounded-lg border border-border/40 bg-muted/10 p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform inline-block">🪐</span>
                <span className="text-xs font-orbitron font-bold text-foreground/80 block">EXPLORER</span>
                <span className="text-[9px] font-mono text-muted-foreground">Solar System</span>
              </a>
              <a
                href="/quiz"
                className="group rounded-lg border border-border/40 bg-muted/10 p-4 text-center hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform inline-block">🛰️</span>
                <span className="text-xs font-orbitron font-bold text-foreground/80 block">SPACE QUIZ</span>
                <span className="text-[9px] font-mono text-muted-foreground">Test Knowledge</span>
              </a>
            </div>
            <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-center">
              <p className="text-[10px] font-mono text-primary/80">
                💬 Click the <span className="text-primary font-bold">🚀</span> button to ask Space AI anything!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Index;
