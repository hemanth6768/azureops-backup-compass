import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Sliders } from 'lucide-react';
import { useEffect } from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import BackButton from '@/components/BackButton';

const SqlCostThresholdParallelism = () => {
  useEffect(() => {
    document.title = 'Cost Threshold for Parallelism | AzureOps';
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header with sidebar trigger */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sliders className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Cost Threshold for Parallelism</h1>
                <p className="text-xs text-muted-foreground">Detailed view</p>
              </div>
            </div>
            <div className="ml-auto">
              <BackButton to="/sql-monitoring" label="Back to SQL Monitoring" />
            </div>
          </header>

          <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Cost Threshold for Parallelism</h1>
              <p className="text-muted-foreground mt-2">Insights and configuration coming soon</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <CardTitle className="mb-2">Work in progress</CardTitle>
                <CardDescription>
                  This module will surface recommended settings, current values, and workload analysis.
                </CardDescription>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default SqlCostThresholdParallelism;
