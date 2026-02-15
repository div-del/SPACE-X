import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { navItems } from "./AppSidebar";

const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    return (
        <div className="md:hidden fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
                <h1 className="font-orbitron text-lg font-bold tracking-wider">
                    <span className="text-primary glow-text-cyan">SPACE</span>
                    <span className="text-foreground">-X</span>
                </h1>
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <button className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent text-primary transition-colors">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80vw] sm:w-[350px] p-0 border-r border-sidebar-border bg-sidebar">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <SheetDescription className="sr-only">Main navigation for mobile devices</SheetDescription>

                    <div className="flex flex-col h-full">
                        {/* Logo area */}
                        <div className="p-6 border-b border-sidebar-border">
                            <h1 className="font-orbitron text-xl font-bold tracking-wider">
                                <span className="text-primary glow-text-cyan">SPACE</span>
                                <span className="text-foreground">-X</span>
                            </h1>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-1">
                                Mobile Uplink Active
                            </p>
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.url;
                                return (
                                    <Link
                                        key={item.title}
                                        to={item.url}
                                        onClick={() => setOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-rajdhani font-medium transition-all ${isActive
                                                ? "bg-sidebar-accent text-primary glow-text-cyan"
                                                : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                                            }`}
                                    >
                                        <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                                        <span>{item.title}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer */}
                        <div className="p-6 border-t border-sidebar-border">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                                    Systems Online
                                </span>
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default MobileNav;
