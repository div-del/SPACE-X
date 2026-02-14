interface StabilityRingProps {
  label: string;
  value: number; // 0-100
  icon: string;
}

const StabilityRing = ({ label, value, icon }: StabilityRingProps) => {
  const size = 130;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const getColor = (v: number) => {
    if (v >= 70) return { stroke: "hsl(152, 100%, 50%)", class: "text-success", glow: "drop-shadow(0 0 6px hsl(152 100% 50% / 0.6))" };
    if (v >= 40) return { stroke: "hsl(45, 100%, 50%)", class: "text-warning", glow: "drop-shadow(0 0 6px hsl(45 100% 50% / 0.6))" };
    return { stroke: "hsl(0, 100%, 64%)", class: "text-destructive", glow: "drop-shadow(0 0 6px hsl(0 100% 64% / 0.6))" };
  };

  const color = getColor(value);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" style={{ filter: color.glow }}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(220, 60%, 15%)"
            strokeWidth={strokeWidth}
          />
          {/* Value ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg">{icon}</span>
          <span className={`text-xl font-orbitron font-bold ${color.class}`}>
            {value}%
          </span>
        </div>
      </div>
      <span className="text-xs font-orbitron uppercase tracking-widest text-muted-foreground text-center">
        {label}
      </span>
    </div>
  );
};

export default StabilityRing;
