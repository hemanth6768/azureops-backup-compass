import React, { useState, useEffect, useCallback, useMemo } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BackButton from "@/components/BackButton";
import { useToast } from "@/components/ui/use-toast";
import { api, SqlServerHost, QueryAnalysisRecord } from "@/lib/api";
import { Search, Database } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SqlQueryAnalysis = () => {
  const { toast } = useToast();
  const [data, setData] = useState<QueryAnalysisRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [servers, setServers] = useState<SqlServerHost[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [serversLoading, setServersLoading] = useState(false);

  useEffect(() => {
    document.title = "Query Analysis | SQL Server Monitoring | AzureOps";
  }, []);

  const fetchData = useCallback(async () => {
    if (!selectedServer) {
      setData([]);
      return;
    }
    try {
      setLoading(true);
      const response = await api.getQueryAnalysis(selectedServer);
      console.log('Query Analysis API Response:', response);
      setData(response.records || []);
    } catch (error: any) {
      console.error('Query Analysis API Error:', error);
      toast({
        title: "Failed to load query analysis",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedServer, toast]);

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
    fetchData();
  }, [fetchData]);

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "—";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "object") {
      if (Object.keys(value).length === 0) return "—";
      return JSON.stringify(value);
    }
    return String(value);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "—";
    }
  };

  const lastCaptured = useMemo(() => {
    if (!data.length) return undefined;
    const latest = data.reduce((acc: number, cur) => {
      const t = new Date(cur.collection_time).getTime();
      return isNaN(t) ? acc : Math.max(acc, t);
    }, 0);
    return latest ? new Date(latest) : undefined;
  }, [data]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Query Analysis</h1>
            <p className="text-xs text-muted-foreground">
              SQL query execution monitoring
            </p>
          </div>
        </div>
        <BackButton to="/sql-monitoring" />
      </header>

      <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            SQL Query Analysis
          </h1>
          <p className="text-muted-foreground mt-2">
            Monitor query execution and performance metrics
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-2 items-center">
            <div className="min-w-[220px]">
              <label className="block text-xs text-muted-foreground mb-1">SQL Server</label>
              <Select value={selectedServer} onValueChange={(v) => setSelectedServer(v)}>
                <SelectTrigger aria-label="Select SQL Server">
                  <SelectValue placeholder={serversLoading ? "Loading servers..." : "Select SQL Server (HOST-SQL)"} />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((s) => (
                    <SelectItem key={s.serverName} value={s.serverName}>
                      {s.serverName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            {lastCaptured ? (
              <span>Data captured at: {lastCaptured.toLocaleString()}</span>
            ) : (
              <span>No capture timestamp available</span>
            )}
          </div>
        </div>

        <div className="relative w-full overflow-x-auto rounded-lg border">
          <Table className="min-w-[1200px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Server</TableHead>
                <TableHead className="text-left">Duration</TableHead>
                <TableHead className="text-left">SQL Text</TableHead>
                <TableHead className="text-left">Login Name</TableHead>
                <TableHead className="text-left">Host Name</TableHead>
                <TableHead className="text-left">Database</TableHead>
                <TableHead className="text-left">Program Name</TableHead>
                <TableHead className="text-left">Login Time</TableHead>
                <TableHead className="text-left">Start Time</TableHead>
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
                  </TableRow>
                ))
              ) : data.length ? (
                <TooltipProvider>
                  {data.map((row, idx) => (
                    <TableRow key={`${row.session_id}-${idx}`}>
                      <TableCell className="text-left">{selectedServer}</TableCell>
                      <TableCell className="text-left">{formatValue(row["dd hh:mm:ss.mss"])}</TableCell>
                      <TableCell className="text-left">
                        {row.sql_text ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">{truncateText(row.sql_text)}</span>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-md break-words whitespace-pre-wrap">
                              <p>{row.sql_text}</p>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-left">{formatValue(row.login_name)}</TableCell>
                      <TableCell className="text-left">{formatValue(row.host_name)}</TableCell>
                      <TableCell className="text-left">{formatValue(row.database_name)}</TableCell>
                      <TableCell className="text-left">{formatValue(row.program_name)}</TableCell>
                      <TableCell className="text-left">{formatDateTime(row.login_time)}</TableCell>
                      <TableCell className="text-left">{formatDateTime(row.start_time)}</TableCell>
                    </TableRow>
                  ))}
                </TooltipProvider>
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-left text-muted-foreground">
                    {selectedServer ? "No query analysis records found." : "Please select a server to view query analysis."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
};

export default SqlQueryAnalysis;