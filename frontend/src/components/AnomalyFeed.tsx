import { Anomaly, useSpaceXData } from "@/hooks/useSpaceXData";

interface AnomalyFeedProps {
    anomalies?: Anomaly[];
    loading?: boolean;
}

const severityConfig = {
    critical: {
        dot: "bg-destructive",
        border: "border-destructive/50",
        badge: "bg-destructive/20 text-destructive",
        glow: "shadow-[0_0_8px_hsl(0_100%_64%/0.3)]",
    },
    high: {
        dot: "bg-warning",
        border: "border-warning/50",
        badge: "bg-warning/20 text-warning",
        glow: "shadow-[0_0_8px_hsl(45_100%_50%/0.2)]",
    },
    medium: {
        dot: "bg-primary",
        border: "border-primary/30",
        badge: "bg-primary/20 text-primary",
        glow: "",
    },
    low: {
        dot: "bg-muted-foreground",
        border: "border-border",
        badge: "bg-muted text-muted-foreground",
        glow: "",
    },
};

const sensorIcons: Record<string, string> = {
    weather: "🌤️",
    solar_wind: "🌬️",
    radiation: "☢️",
};

const AnomalyFeed = (props: AnomalyFeedProps) => {
    const hookData = useSpaceXData();
    const anomalies = props.anomalies ?? hookData.anomalies;
    const loading = props.loading ?? hookData.loading;

    const unacknowledged = anomalies.filter((a) => !a.acknowledged);
    const acknowledged = anomalies.filter((a) => a.acknowledged);

    const formatTime = (iso: string) => {
        try {
            return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        } catch {
            return "—";
        }
    };

    return (
        <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm glow-border-cyan p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan">
                    🚨 Anomaly Feed
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                    {unacknowledged.length > 0 && (
                        <span className="text-destructive animate-pulse">
                            {unacknowledged.length} ACTIVE
                        </span>
                    )}
                    <span>{anomalies.length} TOTAL</span>
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-14 rounded-md bg-muted/20 animate-pulse"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </div>
            ) : anomalies.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-xs font-mono text-success animate-pulse">
                        ✓ NO ANOMALIES DETECTED
                    </p>
                    <p className="text-[10px] font-mono text-muted-foreground mt-1">
                        All sensor readings within nominal parameters
                    </p>
                </div>
            ) : (
                <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                    {/* Active anomalies first */}
                    {unacknowledged.map((a) => {
                        const cfg = severityConfig[a.severity] ?? severityConfig.low;
                        return (
                            <div
                                key={a.id}
                                className={`
                  flex items-start gap-3 rounded-md border px-3 py-2.5
                  bg-card/80 backdrop-blur-sm transition-all duration-300
                  ${cfg.border} ${cfg.glow}
                `}
                            >
                                {/* Severity dot */}
                                <div className="pt-1">
                                    <div className={`w-2 h-2 rounded-full ${cfg.dot} ${a.severity === "critical" ? "animate-pulse" : ""}`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm">{sensorIcons[a.sensor_type] ?? "📡"}</span>
                                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${cfg.badge}`}>
                                            {a.severity.toUpperCase()}
                                        </span>
                                        <span className="text-[10px] font-mono text-muted-foreground">
                                            {a.sensor_type.replace("_", " ").toUpperCase()}
                                        </span>
                                        <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">
                                            {formatTime(a.detected_at)}
                                        </span>
                                    </div>

                                    <p className="text-xs font-mono text-foreground/80 mt-1 truncate">
                                        {a.description ?? `Value ${a.value} exceeded threshold${a.threshold ? ` (${a.threshold})` : ""}`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Acknowledged anomalies (dimmed) */}
                    {acknowledged.map((a) => {
                        const cfg = severityConfig[a.severity] ?? severityConfig.low;
                        return (
                            <div
                                key={a.id}
                                className="flex items-start gap-3 rounded-md border border-border/40 px-3 py-2 bg-card/40 opacity-50"
                            >
                                <div className="pt-1">
                                    <div className={`w-2 h-2 rounded-full ${cfg.dot} opacity-50`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm">{sensorIcons[a.sensor_type] ?? "📡"}</span>
                                        <span className="text-[10px] font-mono text-muted-foreground">
                                            {a.sensor_type.replace("_", " ").toUpperCase()} — ACKNOWLEDGED
                                        </span>
                                        <span className="ml-auto text-[10px] font-mono text-muted-foreground/40">
                                            {formatTime(a.detected_at)}
                                        </span>
                                    </div>
                                    <p className="text-xs font-mono text-muted-foreground mt-1 truncate">
                                        {a.description ?? `Value ${a.value}`}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AnomalyFeed;
