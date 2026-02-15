import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Anomalies from "./pages/Anomalies";
import Stability from "./pages/Stability";
import Settings from "./pages/Settings";
import Explorer from "./pages/Explorer";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";
import AppSidebar from "./components/AppSidebar";
import SpaceAIChatbox from "./components/SpaceAIChatbox";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex-1 min-w-0">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/anomalies" element={<Anomalies />} />
              <Route path="/stability" element={<Stability />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
        {/* Global floating AI chatbox */}
        <SpaceAIChatbox />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
