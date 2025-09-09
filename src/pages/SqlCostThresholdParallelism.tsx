import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Sliders, Server, Database, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import { api, type CostParallelismSetting } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const SqlCostThresholdParallelism = () => {
  const [settings, setSettings] = useState<CostParallelismSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Cost Threshold for Parallelism | AzureOps";
    fetchCostParallelismSettings();
  }, []);

  const fetchCostParallelismSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getCostParallelism();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Group settings by server name
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.serverName]) {
      acc[setting.serverName] = [];
    }
    acc[setting.serverName].push(setting);
    return acc;
  }, {} as Record<string, CostParallelismSetting[]>);

  const getSettingIcon = (settingName: string) => {
    if (settingName.includes('cost threshold')) {
      return <Settings className="w-4 h-4" />;
    } else if (settingName.includes('degree of parallelism')) {
      return <Database className="w-4 h-4" />;
    }
    return <Settings className="w-4 h-4" />;
  };

  const getSettingStatus = (configured: number, running: number) => {
    if (configured === running) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Synchronized</Badge>;
    } else {
      return <Badge variant="destructive">Out of Sync</Badge>;
    }
  };

  return (
    <>
      {/* Header with sidebar trigger */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              Cost Threshold for Parallelism
            </h1>
            <p className="text-xs text-muted-foreground">Detailed view</p>
          </div>
        </div>
        <div className="ml-auto">
          <BackButton to="/sql-monitoring" label="Back to SQL Monitoring" />
        </div>
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Cost Threshold for Parallelism
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor and analyze parallelism settings across your SQL Server instances
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <p>Loading parallelism settings...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedSettings).length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <CardTitle className="mb-2">No Data Available</CardTitle>
                  <CardDescription>
                    No parallelism settings found. Please check your SQL Server connections.
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedSettings).map(([serverName, serverSettings]) => (
                <Card key={serverName} className="card-enhanced">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Server className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{serverName}</CardTitle>
                        <CardDescription>
                          Parallelism Configuration ({serverSettings.length} settings)
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {serverSettings.map((setting, index) => (
                        <div
                          key={index}
                          className="p-4 border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getSettingIcon(setting.settingName)}
                              <h3 className="font-medium text-sm capitalize">
                                {setting.settingName}
                              </h3>
                            </div>
                            {getSettingStatus(setting.configuredValue, setting.runningValue)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground mb-1">Configured Value</p>
                              <p className="font-semibold text-lg text-primary">
                                {setting.configuredValue}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground mb-1">Running Value</p>
                              <p className="font-semibold text-lg text-secondary-foreground">
                                {setting.runningValue}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
};

export default SqlCostThresholdParallelism;
