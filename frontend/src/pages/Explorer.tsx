import { useState, useEffect } from "react";
import StarBackground from "@/components/StarBackground";
import PlanetCard from "@/components/PlanetCard";
import PlanetCompare from "@/components/PlanetCompare";
import { planets, spaceFacts, Planet } from "@/data/space-data";

const Explorer = () => {
    const [compareMode, setCompareMode] = useState(false);
    const [selected, setSelected] = useState<Planet[]>([]);
    const [showCompare, setShowCompare] = useState(false);
    const [factIdx, setFactIdx] = useState(0);
    const [factVisible, setFactVisible] = useState(true);

    // Cycle through space facts
    useEffect(() => {
        const interval = setInterval(() => {
            setFactVisible(false);
            setTimeout(() => {
                setFactIdx((prev) => (prev + 1) % spaceFacts.length);
                setFactVisible(true);
            }, 400);
        }, 6000);
        return () => clearInterval(interval);
    }, []);

    const toggleSelect = (planet: Planet) => {
        setSelected((prev) => {
            const exists = prev.find((p) => p.name === planet.name);
            if (exists) return prev.filter((p) => p.name !== planet.name);
            if (prev.length >= 2) return [prev[1], planet]; // replace oldest
            return [...prev, planet];
        });
    };

    const handleCompare = () => {
        if (selected.length === 2) setShowCompare(true);
    };

    return (
        <div className="relative min-h-screen bg-grid scanline">
            <StarBackground />

            <div className="relative z-10 p-4 md:p-6 lg:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-xl font-orbitron font-bold tracking-wider text-primary glow-text-cyan">
                            🪐 INTERACTIVE EXPLORER
                        </h1>
                        <p className="text-xs font-mono text-muted-foreground mt-1">
                            Explore the Solar System • Tap planets to learn more
                        </p>
                    </div>

                    {/* Compare Controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                setCompareMode(!compareMode);
                                if (compareMode) setSelected([]);
                            }}
                            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all border ${compareMode
                                    ? "bg-primary/20 border-primary text-primary"
                                    : "bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50"
                                }`}
                        >
                            {compareMode ? "✕ EXIT COMPARE" : "⚡ COMPARE PLANETS"}
                        </button>

                        {compareMode && (
                            <button
                                onClick={handleCompare}
                                disabled={selected.length < 2}
                                className="px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    background: selected.length === 2
                                        ? "linear-gradient(135deg, hsl(195 100% 50%), hsl(220 100% 50%))"
                                        : "hsl(228 40% 12%)",
                                    color: selected.length === 2 ? "hsl(228 80% 4%)" : "hsl(215 30% 50%)",
                                }}
                            >
                                COMPARE ({selected.length}/2)
                            </button>
                        )}
                    </div>
                </div>

                {/* Live Space Facts Ticker */}
                <div
                    className="rounded-lg border border-primary/20 px-4 py-3 flex items-center gap-3"
                    style={{
                        background: "linear-gradient(135deg, hsl(195 100% 50% / 0.05), hsl(220 100% 50% / 0.05))",
                    }}
                >
                    <div className="flex items-center gap-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                        <span className="text-[10px] font-orbitron font-bold text-warning tracking-wider">SPACE FACT</span>
                    </div>
                    <p
                        className={`text-xs font-mono text-foreground/80 transition-opacity duration-400 ${factVisible ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        🌟 {spaceFacts[factIdx]}
                    </p>
                </div>

                {/* Planet Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {planets.map((planet) => (
                        <PlanetCard
                            key={planet.name}
                            planet={planet}
                            selected={!!selected.find((p) => p.name === planet.name)}
                            onSelect={() => toggleSelect(planet)}
                            compareMode={compareMode}
                        />
                    ))}
                </div>

                {/* Solar System Scale */}
                <div className="rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm p-6 glow-border-cyan">
                    <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan mb-4">
                        ☀️ Solar System Scale
                    </h3>
                    <div className="relative h-16 overflow-hidden rounded-lg bg-muted/20">
                        {/* Sun */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-lg shadow-[0_0_20px_rgba(255,200,0,0.6)]">
                            ☀️
                        </div>
                        {/* Planets on scale */}
                        {planets.map((planet, i) => {
                            const positions = [5, 10, 15, 22, 40, 58, 75, 90]; // approximate logarithmic
                            return (
                                <div
                                    key={planet.name}
                                    className="absolute top-1/2 -translate-y-1/2 group"
                                    style={{ left: `${positions[i]}%` }}
                                >
                                    <div
                                        className="rounded-full flex items-center justify-center transition-transform hover:scale-150 cursor-pointer"
                                        style={{
                                            width: `${Math.max(12, Math.min(28, planet.diameter / 5000))}px`,
                                            height: `${Math.max(12, Math.min(28, planet.diameter / 5000))}px`,
                                            background: planet.gradient,
                                            boxShadow: `0 0 8px ${planet.color}60`,
                                        }}
                                        title={planet.name}
                                    />
                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-muted-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                        {planet.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-[9px] font-mono text-muted-foreground/50">
                        <span>← Sun</span>
                        <span>Outer Solar System →</span>
                    </div>
                </div>
            </div>

            {/* Compare Modal */}
            {showCompare && selected.length === 2 && (
                <PlanetCompare
                    planets={[selected[0], selected[1]]}
                    onClose={() => setShowCompare(false)}
                />
            )}
        </div>
    );
};

export default Explorer;
