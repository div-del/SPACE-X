import StarBackground from "@/components/StarBackground";
import StabilityRing from "@/components/StabilityRing";

const Stability = () => {
  return (
    <div className="relative min-h-screen bg-grid scanline">
      <StarBackground />
      <div className="relative z-10 p-4 md:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-xl font-orbitron font-bold tracking-wider text-primary glow-text-cyan">
            PATTERN STABILITY
          </h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            STABILITY ANALYSIS • ALL MONITORED PATTERNS
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm glow-border-cyan p-8">
          <div className="flex justify-around items-center flex-wrap gap-10">
            <StabilityRing label="Planetary" value={82} icon="🌤️" />
            <StabilityRing label="Solar Wind" value={45} icon="🌬️" />
            <StabilityRing label="Radiation" value={28} icon="☢️" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stability;
