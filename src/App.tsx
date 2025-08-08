import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BackupItems from "./pages/BackupItems";
import RecoveryVaults from "./pages/RecoveryVaults";
import InactiveVMs from "./pages/InactiveVMs";
import VMCpuUsage from "./pages/VMCpuUsage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SqlMonitoring from "./pages/SqlMonitoring";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/backup-items" element={<BackupItems />} />
          <Route path="/recovery-vaults" element={<RecoveryVaults />} />
          <Route path="/inactive-vms" element={<InactiveVMs />} />
          <Route path="/vm-cpu-usage" element={<VMCpuUsage />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/sql-monitoring" element={<SqlMonitoring />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
