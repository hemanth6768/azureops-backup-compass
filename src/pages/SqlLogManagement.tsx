import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import SqlMonitoringPanel from "@/components/SqlMonitoringPanel";
import { Database, FileText } from "lucide-react";
import { useEffect } from "react";
import BackButton from "@/components/BackButton";

const SqlLogManagement = () => {
  useEffect(() => {
    document.title = "Log Management | AzureOps";
  }, []);

  return (
    <>
      {/* Header with sidebar trigger */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Log Management</h1>
            <p className="text-xs text-muted-foreground">Detailed files view</p>
          </div>
        </div>
        <div className="ml-auto">
          <BackButton to="/sql-monitoring" label="Back to SQL Monitoring" />
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Log Management Files
          </h1>
          <p className="text-muted-foreground mt-2">
            Search databases and switch between row/log file types
          </p>
        </div>

        <SqlMonitoringPanel />
      </main>
    </>
  );
};

export default SqlLogManagement;
