interface StatusTileProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  hasAnomaly?: boolean;
}

const StatusTile = ({ icon, label, value, unit, hasAnomaly = false }: StatusTileProps) => {
  return (
    <div
      className={`
        relative rounded-lg border p-5 backdrop-blur-sm transition-all duration-500
        bg-card/80
        ${hasAnomaly
          ? "border-destructive/70 glow-border-red animate-pulse-glow-red"
          : "border-border glow-border-cyan"
        }
      `}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/60 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/60 rounded-br-lg" />

      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-orbitron uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        {hasAnomaly && (
          <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-destructive animate-pulse-badge">
            ⚠ ANOMALY
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className={`text-4xl font-orbitron font-bold ${hasAnomaly ? "text-destructive glow-text-red" : "text-primary glow-text-cyan"}`}>
          {value}
        </span>
        <span className="text-sm font-mono text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
};

export default StatusTile;
