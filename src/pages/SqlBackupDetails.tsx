import React, { useState, useEffect, useCallback } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/BackButton";
import { useToast } from "@/components/ui/use-toast";
import { api, SqlServerHost, BackupRecord } from "@/lib/api";
import { Database, Calendar } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SqlBackupDetails = () => {
  const { toast } = useToast();
  const [data, setData] = useState<BackupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [servers, setServers] = useState<SqlServerHost[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [serversLoading, setServersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"backups" | "schedules">("backups");
  const [selectedDays, setSelectedDays] = useState<string>("1");
  const [customDays, setCustomDays] = useState<string>("");

  useEffect(() => {
    document.title = "SQL Server Backup Details | SQL Server Monitoring | AzureOps";
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedServer) return;
    
    try {
      setLoading(true);
      const days = selectedDays === "custom" ? parseInt(customDays) || 1 : parseInt(selectedDays);
      const serverNames = selectedServer === "all" ? servers.map(s => s.serverName) : [selectedServer];
      
      const response = await api.getBackupCollectionByDays(serverNames, days);
      setData(response.backups || []);
    } catch (error: any) {
      toast({
        title: "Failed to load backup details",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedServer, selectedDays, customDays, servers, toast]);

  useEffect(() => {
    const loadServers = async () => {
      setServersLoading(true);
      try {
        const list = await api.getSqlServers();
        const filtered = list.filter((s) => (s.tag ?? "").toUpperCase() === "HOST-SQL");
        setServers(filtered);
      } catch (error: any) {
        toast({
          title: "Failed to load servers",
          description: error?.message ?? "Unknown error",
          variant: "destructive"
        });
      } finally {
        setServersLoading(false);
      }
    };
    loadServers();
  }, []);

  useEffect(() => {
    if (selectedServer && servers.length > 0) {
      fetchData();
    }
  }, [fetchData]);

  const truncateText = (text: string, maxLength: number = 40) => {
    if (!text) return "—";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "—";
    }
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">SQL Server Backup Details</h1>
            <p className="text-xs text-muted-foreground">
              Database backup monitoring and schedules
            </p>
          </div>
        </div>
        <BackButton to="/sql-monitoring" />
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            SQL Server Backup Details
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor database backup status and schedules
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-3 items-end">
            <div className="min-w-[220px]">
              <label className="block text-xs text-muted-foreground mb-1">SQL Server</label>
              <Select value={selectedServer} onValueChange={(v) => setSelectedServer(v)}>
                <SelectTrigger aria-label="Select SQL Server">
                  <SelectValue placeholder={serversLoading ? "Loading servers..." : "Select SQL Server (HOST-SQL)"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Servers</SelectItem>
                  {servers.map((s) => (
                    <SelectItem key={s.serverName} value={s.serverName}>
                      {s.serverName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[150px]">
              <label className="block text-xs text-muted-foreground mb-1">History Days</label>
              <Select value={selectedDays} onValueChange={(v) => setSelectedDays(v)}>
                <SelectTrigger aria-label="Select Days">
                  <SelectValue placeholder="Select Days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="2">2 Days</SelectItem>
                  <SelectItem value="3">3 Days</SelectItem>
                  <SelectItem value="4">4 Days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedDays === "custom" && (
              <div className="min-w-[100px]">
                <label className="block text-xs text-muted-foreground mb-1">Days</label>
                <Input
                  type="number"
                  placeholder="Enter days"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  min="1"
                  max="365"
                />
              </div>
            )}
            
            <Button 
              onClick={fetchData} 
              disabled={loading || !selectedServer || (selectedDays === "custom" && !customDays)}
              className="mb-0"
            >
              {loading ? "Loading..." : "Load Backups"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={activeTab === "backups" ? "default" : "outline"}
              onClick={() => setActiveTab("backups")}
              size="sm"
            >
              Backups
            </Button>
            <Button
              variant={activeTab === "schedules" ? "default" : "outline"}
              onClick={() => setActiveTab("schedules")}
              size="sm"
            >
              Schedules
            </Button>
          </div>
        </div>

        {activeTab === "backups" && (
          <div className="relative w-full overflow-x-auto rounded-lg border">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Server Name</TableHead>
                  <TableHead className="text-left">Database Name</TableHead>
                  <TableHead className="text-left">Backup Type</TableHead>
                  <TableHead className="text-left">Start Date</TableHead>
                  <TableHead className="text-left">Finish Date</TableHead>
                  <TableHead className="text-left">Duration (min)</TableHead>
                  <TableHead className="text-left">Backup Location</TableHead>
                  <TableHead className="text-left">Storage Account</TableHead>
                  <TableHead className="text-left">Container</TableHead>
                  <TableHead className="text-left">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-left">Loading…</TableCell>
                      <TableCell className="text-left">—</TableCell>
                      <TableCell className="text-left">—</TableCell>
                      <TableCell className="text-left">—</TableCell>
                      <TableCell className="text-left">—</TableCell>
                      <TableCell className="text-left">—</TableCell>
                      <TableCell className="text-left">—</TableCell>
                      <TableCell className="text-left">—</TableCell>
                      <TableCell className="text-left">—</TableCell>
                      <TableCell className="text-left">—</TableCell>
                    </TableRow>
                  ))
                ) : data.length ? (
                  <TooltipProvider>
                    {data.map((row, idx) => (
                      <TableRow key={`${row.serverName}-${row.databaseName}-${idx}`}>
                        <TableCell className="text-left">{row.serverName || "—"}</TableCell>
                        <TableCell className="text-left">{row.databaseName || "—"}</TableCell>
                        <TableCell className="text-left">{row.backupType || "—"}</TableCell>
                        <TableCell className="text-left">{formatDate(row.backupStartDate)}</TableCell>
                        <TableCell className="text-left">{formatDate(row.backupFinishDate)}</TableCell>
                        <TableCell className="text-left">{row.durationMinutes ?? "—"}</TableCell>
                        <TableCell className="text-left">
                          {row.backupLocation ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{truncateText(row.backupLocation)}</span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-md break-words">
                                <p>{row.backupLocation}</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-left">{row.storageAccount || "—"}</TableCell>
                        <TableCell className="text-left">{row.container || "—"}</TableCell>
                        <TableCell className="text-left">{row.notes || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TooltipProvider>
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-left text-muted-foreground">
                      No backup records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {activeTab === "schedules" && (
          <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted">
            <div className="text-center">
              <Database className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Schedules Coming Soon</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Backup schedule monitoring will be available in a future update.
              </p>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default SqlBackupDetails;