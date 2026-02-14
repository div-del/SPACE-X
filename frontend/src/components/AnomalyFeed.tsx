import { Badge } from "@/components/ui/badge";

type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface Anomaly {
  id: number;
  sensor: string;
  value: string;
  severity: Severity;
  timestamp: string;
}

const mockAnomalies: Anomaly[] = [
  { id: 1, sensor: "Radiation", value: "892 µSv/h", severity: "CRITICAL", timestamp: "14:32:07" },
  { id: 2, sensor: "Solar Wind", value: "645 km/s", severity: "HIGH", timestamp: "14:31:52" },
  { id: 3, sensor: "Planetary Weather", value: "-142°C", severity: "MEDIUM", timestamp: "14:30:18" },
  { id: 4, sensor: "Solar Wind", value: "580 km/s", severity: "HIGH", timestamp: "14:28:45" },
  { id: 5, sensor: "Radiation", value: "420 µSv/h", severity: "MEDIUM", timestamp: "14:25:33" },
  { id: 6, sensor: "Planetary Weather", value: "1.2 kPa", severity: "LOW", timestamp: "14:22:10" },
  { id: 7, sensor: "Radiation", value: "310 µSv/h", severity: "LOW", timestamp: "14:18:55" },
  { id: 8, sensor: "Solar Wind", value: "710 km/s", severity: "CRITICAL", timestamp: "14:15:02" },
];

const severityConfig: Record<Severity, { className: string }> = {
  LOW: { className: "bg-muted text-muted-foreground border-muted" },
  MEDIUM: { className: "bg-warning/20 text-warning border-warning/40" },
  HIGH: { className: "bg-destructive/20 text-destructive border-destructive/40" },
  CRITICAL: { className: "bg-destructive/30 text-destructive border-destructive/60 animate-pulse-badge" },
};

const AnomalyFeed = () => {
  return (
    <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm glow-border-cyan overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan">
          ⚡ Anomaly Feed
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">LIVE</span>
      </div>

      {/* Feed */}
      <div className="max-h-[340px] overflow-y-auto">
        {mockAnomalies.map((a) => (
          <div
            key={a.id}
            className="px-4 py-3 border-b border-border/50 flex items-center gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-rajdhani font-semibold text-foreground">
                  {a.sensor}
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono px-1.5 py-0 h-5 ${severityConfig[a.severity].className}`}
                >
                  {a.severity}
                </Badge>
              </div>
              <span className="text-xs font-mono text-muted-foreground">{a.value}</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground whitespace-nowrap">
              {a.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnomalyFeed;
