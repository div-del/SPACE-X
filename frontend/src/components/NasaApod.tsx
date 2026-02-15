import { useState, useEffect } from "react";
import { curatedApod, ApodEntry } from "@/data/space-data";

const NasaApod = () => {
    const [entry, setEntry] = useState<ApodEntry | null>(null);
    const [expanded, setExpanded] = useState(false);
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        // Pick a "daily" entry based on the day of year
        const dayOfYear = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
        );
        const idx = dayOfYear % curatedApod.length;
        setEntry(curatedApod[idx]);
    }, []);

    if (!entry) return null;

    return (
        <div className="rounded-lg border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden glow-border-cyan">
            <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between">
                <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan">
                    🔭 Astronomy Picture of the Day
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground">
                    NASA APOD
                </span>
            </div>

            <div className="relative">
                {/* Image */}
                {!imgError ? (
                    <div className="relative h-52 overflow-hidden">
                        <img
                            src={entry.url}
                            alt={entry.title}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-cover"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

                        {/* Title overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h4 className="text-sm font-orbitron font-bold text-foreground"
                                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
                            >
                                {entry.title}
                            </h4>
                            {entry.copyright && (
                                <span className="text-[9px] font-mono text-muted-foreground/80">
                                    © {entry.copyright}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center bg-muted/20">
                        <div className="text-center">
                            <span className="text-4xl">🔭</span>
                            <p className="text-xs font-mono text-muted-foreground mt-2">{entry.title}</p>
                        </div>
                    </div>
                )}

                {/* Description */}
                <div className="p-4">
                    <p className={`text-[11px] font-mono text-muted-foreground leading-relaxed ${!expanded ? "line-clamp-3" : ""
                        }`}>
                        {entry.explanation}
                    </p>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-[10px] font-mono text-primary hover:text-primary/80 mt-1 transition-colors"
                    >
                        {expanded ? "Show less" : "Read more..."}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NasaApod;
