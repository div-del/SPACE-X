import { Planet } from "@/data/space-data";

interface PlanetCompareProps {
    planets: [Planet, Planet];
    onClose: () => void;
}

const metrics: { key: keyof Planet; label: string; format?: (v: any) => string; unit?: string; isNumeric?: boolean }[] = [
    { key: "diameter", label: "Diameter", format: (v: number) => v.toLocaleString(), unit: "km", isNumeric: true },
    { key: "moons", label: "Moons", isNumeric: true },
    { key: "temperature", label: "Temperature" },
    { key: "dayLength", label: "Day Length" },
    { key: "yearLength", label: "Year Length" },
    { key: "mass", label: "Mass" },
    { key: "distanceFromSun", label: "Distance from Sun" },
    { key: "type", label: "Type" },
];

const PlanetCompare = ({ planets: [a, b], onClose }: PlanetCompareProps) => {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            <div
                className="relative w-full max-w-2xl rounded-xl border border-primary/30 p-6 overflow-y-auto max-h-[80vh]"
                style={{
                    background: "hsl(228 60% 7% / 0.95)",
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 0 40px hsl(195 100% 50% / 0.15), 0 20px 60px rgba(0,0,0,0.5)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted/30 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                    ✕
                </button>

                <h2 className="text-sm font-orbitron font-bold text-primary glow-text-cyan tracking-widest mb-6 text-center">
                    ⚡ PLANET COMPARISON
                </h2>

                {/* Planet Headers */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 mb-6">
                    {/* Planet A */}
                    <div className="text-center">
                        <div
                            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-2"
                            style={{
                                background: a.gradient,
                                boxShadow: `0 0 20px ${a.color}40`,
                            }}
                        >
                            {a.emoji}
                        </div>
                        <h3 className="text-sm font-orbitron font-bold text-foreground">{a.name}</h3>
                        <span className="text-[10px] font-mono text-muted-foreground">{a.type}</span>
                    </div>

                    {/* VS */}
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full border border-warning/50 flex items-center justify-center">
                            <span className="text-xs font-orbitron font-bold text-warning">VS</span>
                        </div>
                    </div>

                    {/* Planet B */}
                    <div className="text-center">
                        <div
                            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-2"
                            style={{
                                background: b.gradient,
                                boxShadow: `0 0 20px ${b.color}40`,
                            }}
                        >
                            {b.emoji}
                        </div>
                        <h3 className="text-sm font-orbitron font-bold text-foreground">{b.name}</h3>
                        <span className="text-[10px] font-mono text-muted-foreground">{b.type}</span>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="space-y-2">
                    {metrics.map((m) => {
                        const valA = a[m.key];
                        const valB = b[m.key];
                        const displayA = m.format ? m.format(valA) : String(valA);
                        const displayB = m.format ? m.format(valB) : String(valB);

                        // Determine which is "better" for bar visualization
                        let barA = 50;
                        let barB = 50;
                        if (m.isNumeric && typeof valA === "number" && typeof valB === "number") {
                            const total = valA + valB || 1;
                            barA = (valA / total) * 100;
                            barB = (valB / total) * 100;
                        }

                        return (
                            <div key={m.key} className="rounded-lg bg-muted/20 border border-border/30 p-3">
                                <div className="text-[10px] font-mono text-muted-foreground text-center mb-2 uppercase tracking-wider">
                                    {m.label}
                                </div>
                                <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                                    <div className="text-right">
                                        <span className="text-xs font-mono" style={{ color: a.color }}>
                                            {displayA}{m.unit ? ` ${m.unit}` : ""}
                                        </span>
                                    </div>
                                    {m.isNumeric ? (
                                        <div className="w-32 h-2 rounded-full bg-muted/30 overflow-hidden flex">
                                            <div
                                                className="h-full rounded-l-full transition-all duration-1000"
                                                style={{ width: `${barA}%`, background: a.color }}
                                            />
                                            <div
                                                className="h-full rounded-r-full transition-all duration-1000"
                                                style={{ width: `${barB}%`, background: b.color }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-32 border-t border-border/40" />
                                    )}
                                    <div className="text-left">
                                        <span className="text-xs font-mono" style={{ color: b.color }}>
                                            {displayB}{m.unit ? ` ${m.unit}` : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Fun Facts */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted/20 border border-border/30 p-3">
                        <p className="text-[10px] font-mono text-warning/80">💡 {a.funFact}</p>
                    </div>
                    <div className="rounded-lg bg-muted/20 border border-border/30 p-3">
                        <p className="text-[10px] font-mono text-warning/80">💡 {b.funFact}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanetCompare;
