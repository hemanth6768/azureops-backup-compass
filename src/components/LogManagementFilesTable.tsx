import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

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

const SERVER = "rfms-host-sql-R"; // as provided

const LogManagementFilesTable: React.FC = () => {
  const { toast } = useToast();
  const [fileType, setFileType] = useState<"log" | "row">("log");
  const [query, setQuery] = useState("");
  const [data, setData] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const url = `http://localhost:33411/api/Monitoring/server/${SERVER}?fileType=${fileType}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json: FileRecord[] = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (error: any) {
      toast({
        title: "Failed to load SQL files",
        description: error?.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [fileType, toast]);

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
          <div className="min-w-[180px]">
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
          <Table className="min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Server</TableHead>
                <TableHead className="text-left">Database</TableHead>
                <TableHead className="text-left">File name</TableHead>
                <TableHead className="text-left">File type</TableHead>
                <TableHead className="text-left">Total size</TableHead>
                <TableHead className="text-left">Used space</TableHead>
                <TableHead className="text-left">Free space</TableHead>
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
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-left text-muted-foreground">
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
