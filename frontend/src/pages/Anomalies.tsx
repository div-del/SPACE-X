import StarBackground from "@/components/StarBackground";
import AnomalyFeed from "@/components/AnomalyFeed";

const Anomalies = () => {
  return (
    <div className="relative min-h-screen bg-grid scanline">
      <StarBackground />
      <div className="relative z-10 p-4 md:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-xl font-orbitron font-bold tracking-wider text-primary glow-text-cyan">
            ANOMALY FEED
          </h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            REAL-TIME ANOMALY DETECTION • ALL SECTORS
          </p>
        </div>
        <AnomalyFeed />
      </div>
    </div>
  );
};

export default Anomalies;
