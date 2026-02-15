import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendPoint } from "@/hooks/useSpaceXData";

interface TrendGraphProps {
  data: TrendPoint[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 border border-border rounded-lg px-3 py-2 text-[10px] font-mono">
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: {p.value?.toFixed(1) ?? "—"}
        </p>
      ))}
    </div>
  );
};

const TrendGraph = ({ data, loading }: TrendGraphProps) => {
  const hasData = data.some(d => d.weather !== null || d.solar_wind !== null || d.radiation !== null);

  return (
    <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm glow-border-cyan p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan">
          📈 Long-Horizon Trend Analysis
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">
          {data.length > 0 ? `${data.length} DATAPOINTS` : "AWAITING DATA"}
        </span>
      </div>

      {loading || !hasData ? (
        <div className="h-48 flex flex-col items-center justify-center gap-2">
          <div className="text-xs font-mono text-muted-foreground animate-pulse">
            {loading ? "INITIALIZING SENSOR STREAM..." : "COLLECTING TREND DATA — UPDATES EVERY 5 SECONDS"}
          </div>
          {/* Shimmer bars */}
          <div className="w-full space-y-2 mt-4 px-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-2 rounded-full bg-muted/30 animate-pulse"
                style={{ width: `${70 + Math.random() * 30}%`, animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: "#64748b", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={{ stroke: "#1e293b" }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#64748b", fontFamily: "monospace" }}
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={6}
              wrapperStyle={{ fontSize: "10px", fontFamily: "monospace", paddingTop: "8px" }}
            />
            <Line
              type="monotone" dataKey="weather"
              stroke="#00d4ff" strokeWidth={1.5} dot={false}
              name="Weather (°C)" connectNulls activeDot={{ r: 3, fill: "#00d4ff" }}
            />
            <Line
              type="monotone" dataKey="solar_wind"
              stroke="#f59e0b" strokeWidth={1.5} dot={false}
              name="Solar Wind (km/s)" connectNulls activeDot={{ r: 3, fill: "#f59e0b" }}
            />
            <Line
              type="monotone" dataKey="radiation"
              stroke="#ff4444" strokeWidth={1.5} dot={false}
              name="Radiation (µSv/h)" connectNulls activeDot={{ r: 3, fill: "#ff4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrendGraph;
