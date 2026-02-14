import StarBackground from "@/components/StarBackground";
import StatusTile from "@/components/StatusTile";
import StabilityRing from "@/components/StabilityRing";
import AnomalyFeed from "@/components/AnomalyFeed";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-grid scanline">
      <StarBackground />

      <div className="relative z-10 p-4 md:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-orbitron font-bold tracking-wider text-primary glow-text-cyan">
              MISSION CONTROL
            </h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              SECTOR 7G • SOL 847 • {new Date().toLocaleTimeString()} UTC
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
            ALL SYSTEMS NOMINAL
          </div>
        </div>

        {/* Status Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatusTile
            icon="🌤️"
            label="Planetary Weather"
            value="-67"
            unit="°C"
            hasAnomaly={false}
          />
          <StatusTile
            icon="🌬️"
            label="Solar Wind"
            value="482"
            unit="km/s"
            hasAnomaly={true}
          />
          <StatusTile
            icon="☢️"
            label="Radiation"
            value="892"
            unit="µSv/h"
            hasAnomaly={true}
          />
        </div>

        {/* Stability + Anomaly Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stability Panel */}
          <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm glow-border-cyan p-6">
            <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan mb-6">
              📊 Pattern Stability Score
            </h3>
            <div className="flex justify-around items-center flex-wrap gap-6">
              <StabilityRing label="Planetary" value={82} icon="🌤️" />
              <StabilityRing label="Solar Wind" value={45} icon="🌬️" />
              <StabilityRing label="Radiation" value={28} icon="☢️" />
            </div>
          </div>

          {/* Anomaly Feed */}
          <AnomalyFeed />
        </div>
      </div>
    </div>
  );
};

export default Index;
