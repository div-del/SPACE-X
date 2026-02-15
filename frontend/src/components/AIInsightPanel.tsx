import { AIInsight } from "@/hooks/useSpaceXData";
import { useState, useEffect } from "react";

interface AIInsightPanelProps {
  insights: AIInsight[];
  loading: boolean;
}

const AIInsightPanel = ({ insights, loading }: AIInsightPanelProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  // Cycle through insights every 6 seconds
  useEffect(() => {
    if (insights.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % insights.length);
        setVisible(true);
      }, 300);
    }, 6000);
    return () => clearInterval(interval);
  }, [insights.length]);

  const insight = insights[activeIdx];

  const getDriftColor = (prob: number) => {
    if (prob >= 70) return "text-destructive";
    if (prob >= 40) return "text-warning";
    return "text-success";
  };

  return (
    <div className="rounded-lg border border-primary/30 bg-card/60 backdrop-blur-sm p-5"
      style={{ boxShadow: "0 0 20px hsl(200 100% 50% / 0.08)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan">
          🤖 AI Insight
        </h3>
        <div className="flex items-center gap-2">
          {insights.length > 1 && (
            <div className="flex gap-1">
              {insights.map((_, i) => (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === activeIdx ? "bg-primary" : "bg-muted"}`}
                />
              ))}
            </div>
          )}
          <span className="text-[10px] font-mono text-muted-foreground">LSTM v1.0</span>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3 bg-muted/30 rounded w-3/4" />
          <div className="h-3 bg-muted/30 rounded w-full" />
          <div className="h-3 bg-muted/30 rounded w-1/2" />
        </div>
      ) : insight ? (
        <div className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>
          {/* Sensor tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-primary/30 text-primary bg-primary/10">
              {insight.sensor.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground">Pattern Analysis</span>
          </div>

          {/* Message */}
          <p className="text-xs font-mono text-muted-foreground leading-relaxed mb-4">
            {insight.message}
          </p>

          {/* Divider */}
          <div className="border-t border-border/50 my-3" />

          {/* Prediction */}
          <div className="flex items-start gap-2 mb-3">
            <span className="text-[10px] font-mono text-primary mt-0.5">▶</span>
            <p className="text-xs font-mono text-foreground/80 leading-relaxed">
              {insight.prediction}
            </p>
          </div>

          {/* Drift probability bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono text-muted-foreground">Predicted Drift Probability</span>
              <span className={`text-[10px] font-orbitron font-bold ${getDriftColor(insight.driftProb)}`}>
                {insight.driftProb}%
              </span>
            </div>
            <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${insight.driftProb}%`,
                  background: insight.driftProb >= 70
                    ? "hsl(0, 100%, 64%)"
                    : insight.driftProb >= 40
                    ? "hsl(45, 100%, 50%)"
                    : "hsl(152, 100%, 50%)",
                  boxShadow: `0 0 8px ${insight.driftProb >= 70 ? "hsl(0 100% 64% / 0.5)" : insight.driftProb >= 40 ? "hsl(45 100% 50% / 0.5)" : "hsl(152 100% 50% / 0.5)"}`,
                }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AIInsightPanel;
