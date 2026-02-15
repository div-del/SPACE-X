import StarBackground from "@/components/StarBackground";
import { useSpaceXData } from "@/hooks/useSpaceXData";

const Settings = () => {
    const { backendOnline } = useSpaceXData();

    return (
        <div className="relative min-h-screen bg-grid scanline">
            <StarBackground />
            <div className="relative z-10 p-4 md:p-6 lg:p-8 space-y-6">
                <div>
                    <h1 className="text-xl font-orbitron font-bold tracking-wider text-primary glow-text-cyan">
                        SYSTEM SETTINGS
                    </h1>
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                        CONFIGURATION • MISSION CONTROL PARAMETERS
                    </p>
                </div>

                {/* Connection Status */}
                <div className="rounded-lg border border-border bg-card/60 backdrop-blur-sm glow-border-cyan p-6 space-y-4">
                    <h3 className="text-xs font-orbitron uppercase tracking-widest text-primary glow-text-cyan">
                        ⚙️ System Status
                    </h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs font-mono text-muted-foreground">Backend Connection</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${backendOnline ? "bg-success animate-pulse" : "bg-destructive"}`} />
                                <span className={`text-xs font-mono ${backendOnline ? "text-success" : "text-destructive"}`}>
                                    {backendOnline ? "ONLINE" : "OFFLINE"}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs font-mono text-muted-foreground">API Endpoint</span>
                            <span className="text-xs font-mono text-primary">http://localhost:5000</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs font-mono text-muted-foreground">Polling Interval</span>
                            <span className="text-xs font-mono text-primary">5 seconds</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs font-mono text-muted-foreground">Sensor Types</span>
                            <span className="text-xs font-mono text-primary">Weather · Solar Wind · Radiation</span>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-border/30">
                            <span className="text-xs font-mono text-muted-foreground">AI Model</span>
                            <span className="text-xs font-mono text-primary">LSTM v1.0</span>
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <span className="text-xs font-mono text-muted-foreground">Version</span>
                            <span className="text-xs font-mono text-primary">Weather Monitor v2.4</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
