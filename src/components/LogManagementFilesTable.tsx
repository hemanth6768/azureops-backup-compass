import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api, SqlServerHost } from "@/lib/api";
import { Minimize2 } from "lucide-react";

interface FileRecord {
  serverName: string;
  databaseName: string;
  fileName: string;
  physicalPath?: string; // excluded from table rendering
  fileType: string;
  totalSize: string;
  usedSpace: string;
  freeSpace: string;
  collectedAt: string;
}

const LogManagementFilesTable: React.FC = () => {
  const { toast } = useToast();
  const [fileType, setFileType] = useState<"log" | "row">("log");
  const [query, setQuery] = useState("");
  const [data, setData] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [servers, setServers] = useState<SqlServerHost[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>("");
  const [serversLoading, setServersLoading] = useState(false);

  const handleShrink = (record: FileRecord) => {
    toast({
      title: "Shrink operation initiated",
      description: `Shrinking ${record.fileName} on ${record.serverName}`,
    });
    console.log("Shrinking file:", record);
  };

  const fetchData = useCallback(async () => {
    if (!selectedServer) {
      setData([]);
      return;
    }
    try {
      setLoading(true);
      const json = await api.getServerFiles(selectedServer, fileType);
      setData(Array.isArray(json) ? (json as unknown as FileRecord[]) : []);
    } catch (error: any) {
      toast({
        title: "Failed to load SQL files",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [fileType, selectedServer, toast]);

  useEffect(() => {
    const loadServers = async () => {
      setServersLoading(true);
      try {
        const list = await api.getSqlServers();
        const filtered = list.filter((s) => (s.tag ?? "").toUpperCase() === "HOST-SQL");
        setServers(filtered);
      } catch (error: any) {
        toast({ title: "Failed to load servers", description: error?.message ?? "Unknown error", variant: "destructive" });
      } finally {
        setServersLoading(false);
      }
    };
    loadServers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((d) => String(d.databaseName).toLowerCase().includes(q));
  }, [data, query]);

  const lastCaptured = useMemo(() => {
    if (!data.length) return undefined;
    // choose the latest collectedAt among rows
    const latest = data.reduce((acc: number, cur) => {
      const t = new Date(cur.collectedAt).getTime();
      return isNaN(t) ? acc : Math.max(acc, t);
    }, 0);
    return latest ? new Date(latest) : undefined;
  }, [data]);

  return (
    <section aria-label="SQL Server log files">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex gap-2 items-center">
          <div className="min-w-[160px]">
            <label className="block text-xs text-muted-foreground mb-1">File type</label>
            <Select value={fileType} onValueChange={(v) => setFileType(v as "log" | "row")}>
              <SelectTrigger aria-label="Select file type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="row">row</SelectItem>
                <SelectItem value="log">log</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[220px]">
            <label className="block text-xs text-muted-foreground mb-1">Server</label>
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

          <div className="min-w-[220px]">
            <label className="block text-xs text-muted-foreground mb-1">Search by database name</label>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. MyDatabase"
              aria-label="Search database name"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {lastCaptured ? (
            <span>
              Data captured at: {lastCaptured.toLocaleString()}
            </span>
          ) : (
            <span>No capture timestamp available</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <div className="relative w-full overflow-x-auto rounded-lg border">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Server</TableHead>
                <TableHead className="text-left">Database</TableHead>
                <TableHead className="text-left">File name</TableHead>
                <TableHead className="text-left">File type</TableHead>
                <TableHead className="text-left">Total size</TableHead>
                <TableHead className="text-left">Used space</TableHead>
                <TableHead className="text-left">Free space</TableHead>
                <TableHead className="text-left">Actions</TableHead>
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
                  </TableRow>
                ))
              ) : filtered.length ? (
                filtered.map((row, idx) => (
                  <TableRow key={`${row.serverName}-${row.databaseName}-${row.fileName}-${idx}`}>
                    <TableCell className="text-left">{row.serverName}</TableCell>
                    <TableCell className="text-left">{row.databaseName}</TableCell>
                    <TableCell className="text-left">{row.fileName}</TableCell>
                    <TableCell className="text-left">{row.fileType}</TableCell>
                    <TableCell className="text-left">{row.totalSize}</TableCell>
                    <TableCell className="text-left">{row.usedSpace}</TableCell>
                    <TableCell className="text-left">{row.freeSpace}</TableCell>
                    <TableCell className="text-left">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShrink(row)}
                        className="h-8 px-3 text-xs"
                      >
                        <Minimize2 className="w-3 h-3 mr-1" />
                        Shrink
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-left text-muted-foreground">
                    No records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default LogManagementFilesTable;
