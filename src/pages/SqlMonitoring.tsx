import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import LogManagementOverview from "@/components/LogManagementOverview";
import DatabaseSizePanel from "@/components/DatabaseSizePanel";
import StatCard from "@/components/StatCard";
import { Database, FileText, Sliders } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SqlMonitoring = () => {
  useEffect(() => {
    document.title = "SQL Server Monitoring Dashboard | AzureOps";
  }, []);
  const navigate = useNavigate();

  return (
    <>
      {/* Header with sidebar trigger */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">SQL Server Monitoring</h1>
            <p className="text-xs text-muted-foreground">
              Centralized SQL monitoring modules
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            SQL Server Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore modules like Log Management and more
          </p>
        </div>

        <LogManagementOverview />

        <DatabaseSizePanel />

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Log Management"
            value="Open"
            description="View SQL files usage and health"
            icon={FileText}
            clickable
            onClick={() => navigate("/sql-monitoring/log-management")}
          />
          <StatCard
            title="Cost Threshold for Parallelism"
            value="Open"
            description="Analyze and optimize parallelism settings"
            icon={Sliders}
            clickable
            onClick={() =>
              navigate("/sql-monitoring/cost-threshold-parallelism")
            }
          />
        </section>
      </main>
    </>
  );
};

export default SqlMonitoring;
