import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LogManagementOverview from "@/components/LogManagementOverview";

// SQL Server Monitoring left panel with scalable tab architecture
// Add future tabs by appending to the panels array below
const SqlMonitoringPanel: React.FC = () => {
  const panels: { value: string; label: string; content: React.ReactNode }[] = [
    {
      value: "log-management",
      label: "Log Management",
      content: <LogManagementOverview />,
    },
    // Future-ready: add more panels here
    // { value: "capacity", label: "Capacity", content: <CapacityPanel /> },
  ];

  return (
    <section aria-label="SQL Server Monitoring">

      <div className="w-full">
        <Tabs defaultValue={panels[0].value} className="w-full">
          <TabsList className="mb-2">
            {panels.map((p) => (
              <TabsTrigger key={p.value} value={p.value}>
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {panels.map((p) => (
            <TabsContent key={p.value} value={p.value}>
              {p.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default SqlMonitoringPanel;
