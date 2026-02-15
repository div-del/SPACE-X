import { useState } from "react";
import { Planet } from "@/data/space-data";

interface PlanetCardProps {
    planet: Planet;
    selected: boolean;
    onSelect: () => void;
    compareMode: boolean;
}

const PlanetCard = ({ planet, selected, onSelect, compareMode }: PlanetCardProps) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className="group perspective-1000 cursor-pointer"
            onClick={() => {
                if (compareMode) {
                    onSelect();
                } else {
                    setFlipped(!flipped);
                }
            }}
        >
            <div
                className={`relative w-full h-[280px] transition-transform duration-700 preserve-3d ${flipped && !compareMode ? "rotate-y-180" : ""
                    }`}
                style={{
                    transformStyle: "preserve-3d",
                    transform: flipped && !compareMode ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Front of Card */}
                <div
                    className={`absolute inset-0 rounded-xl border overflow-hidden backface-hidden transition-all duration-300 ${selected
                            ? "border-primary ring-2 ring-primary/40"
                            : "border-border/40 hover:border-primary/50"
                        }`}
                    style={{
                        backfaceVisibility: "hidden",
                        background: "hsl(228 60% 7% / 0.8)",
                        boxShadow: selected
                            ? "0 0 25px hsl(195 100% 50% / 0.3)"
                            : "0 0 15px hsl(195 100% 50% / 0.05)",
                    }}
                >
                    {/* Planet Gradient Orb */}
                    <div className="flex items-center justify-center pt-6 pb-3">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-5xl transition-transform duration-500 group-hover:scale-110 group-hover:animate-float"
                            style={{
                                background: planet.gradient,
                                boxShadow: `0 0 30px ${planet.color}40, 0 0 60px ${planet.color}20`,
                            }}
                        >
                            {planet.emoji}
                        </div>
                    </div>

                    {/* Name & Type */}
                    <div className="text-center px-4">
                        <h3 className="text-base font-orbitron font-bold text-primary glow-text-cyan tracking-wider">
                            {planet.name.toUpperCase()}
                        </h3>
                        <span className="text-[10px] font-mono text-muted-foreground">{planet.type}</span>
                    </div>

                    {/* Quick Stats (visible on hover) */}
                    <div className="px-4 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                            <div className="bg-muted/20 rounded px-2 py-1">
                                <span className="text-muted-foreground">Moons:</span>{" "}
                                <span className="text-primary">{planet.moons}</span>
                            </div>
                            <div className="bg-muted/20 rounded px-2 py-1">
                                <span className="text-muted-foreground">Temp:</span>{" "}
                                <span className="text-primary">{planet.temperature}</span>
                            </div>
                            <div className="bg-muted/20 rounded px-2 py-1 col-span-2">
                                <span className="text-muted-foreground">Distance:</span>{" "}
                                <span className="text-primary">{planet.distanceFromSun}</span>
                            </div>
                        </div>
                    </div>

                    {/* Compare badge */}
                    {compareMode && (
                        <div className="absolute top-3 right-3">
                            <div
                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected ? "bg-primary border-primary" : "border-muted-foreground/40"
                                    }`}
                            >
                                {selected && (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="hsl(228 80% 4%)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Flip hint */}
                    {!compareMode && (
                        <div className="absolute bottom-2 left-0 right-0 text-center opacity-0 group-hover:opacity-60 transition-opacity">
                            <span className="text-[9px] font-mono text-muted-foreground">TAP TO FLIP</span>
                        </div>
                    )}
                </div>

                {/* Back of Card */}
                <div
                    className="absolute inset-0 rounded-xl border border-primary/30 overflow-hidden p-4 flex flex-col"
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: "hsl(228 60% 7% / 0.95)",
                        boxShadow: "0 0 25px hsl(195 100% 50% / 0.15)",
                    }}
                >
                    <h4 className="text-xs font-orbitron font-bold text-primary glow-text-cyan mb-2">
                        {planet.name.toUpperCase()}
                    </h4>
                    <p className="text-[11px] font-mono text-muted-foreground leading-relaxed mb-3">
                        {planet.description}
                    </p>

                    <div className="space-y-1.5 text-[10px] font-mono flex-1">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Diameter</span>
                            <span className="text-foreground">{planet.diameter.toLocaleString()} km</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Mass</span>
                            <span className="text-foreground">{planet.mass}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Day Length</span>
                            <span className="text-foreground">{planet.dayLength}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Year Length</span>
                            <span className="text-foreground">{planet.yearLength}</span>
                        </div>
                    </div>

                    {/* Fun fact */}
                    <div className="mt-2 pt-2 border-t border-border/40">
                        <p className="text-[10px] font-mono text-warning/80 leading-relaxed">
                            💡 {planet.funFact}
                        </p>
                    </div>

                    <div className="text-center mt-2 opacity-60">
                        <span className="text-[9px] font-mono text-muted-foreground">TAP TO FLIP BACK</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanetCard;
