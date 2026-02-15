import { LayoutDashboard, AlertTriangle, Activity, Settings, Compass, Brain } from "lucide-react";
import { NavLink } from "@/components/NavLink";

export const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Explorer", url: "/explorer", icon: Compass },
  { title: "Quiz", url: "/quiz", icon: Brain },
  { title: "Anomalies", url: "/anomalies", icon: AlertTriangle },
  { title: "Stability", url: "/stability", icon: Activity },
  { title: "Settings", url: "/settings", icon: Settings },
];

const AppSidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen border-r border-sidebar-border bg-sidebar shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <h1 className="font-orbitron text-lg font-bold tracking-wider">
          <span className="text-primary glow-text-cyan">SPACE</span>
          <span className="text-foreground">-X</span>
        </h1>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
          Weather Monitor v2.4
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            end={item.url === "/"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-rajdhani font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-primary glow-text-cyan"
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Systems Online
          </span>
        </div>
        <div className="mt-2 text-[10px] font-mono text-muted-foreground/60">
          UPLINK: 99.7% • LAT: 12ms
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
