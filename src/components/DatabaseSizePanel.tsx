import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { api, DatabaseSize, SqlServerHost } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Database } from 'lucide-react';

interface ChartDatum {
  name: string;
  sizeGB: number;
}

const parseSizeGB = (size: string): number => {
  // Handles values like "21.55 GB" or "21 GB" or just numbers
  const n = parseFloat((size || '').toString().replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
};

const DatabaseSizePanel = () => {
  const { toast } = useToast();
  const [servers, setServers] = useState<SqlServerHost[]>([]);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [rawData, setRawData] = useState<DatabaseSize[]>([]);
  const [loadingServers, setLoadingServers] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoadingServers(true);
        const all = await api.getSqlServers();
        const filtered = (all || []).filter((s) => s.tag === 'HOST-SQL' && s.serverName);
        setServers(filtered);
        if (filtered.length > 0) {
          setSelectedServer(filtered[0].serverName);
        }
      } catch (e: any) {
        toast({ title: 'Failed to load SQL servers', description: e?.message ?? 'Please try again later', variant: 'destructive' });
      } finally {
        setLoadingServers(false);
      }
    };
    fetchServers();
  }, [toast]);

  useEffect(() => {
    const fetchSizes = async () => {
      if (!selectedServer) return;
      try {
        setLoadingData(true);
        const data = await api.getDatabaseSizes(selectedServer);
        setRawData(data || []);
      } catch (e: any) {
        toast({ title: 'Failed to load database sizes', description: e?.message ?? 'Please try again later', variant: 'destructive' });
      } finally {
        setLoadingData(false);
      }
    };
    fetchSizes();
  }, [selectedServer, toast]);

  const chartData: ChartDatum[] = useMemo(() => {
    const normalized = (rawData || []).map((d) => ({ name: d.databaseName, sizeGB: parseSizeGB(d.size) }));
    return normalized
      .sort((a, b) => b.sizeGB - a.sizeGB)
      .slice(0, 10);
  }, [rawData]);

  return (
    <section aria-label="Top 10 Largest Databases by Size">
      <Card className="bg-gradient-card shadow-card animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <CardTitle>Database Size</CardTitle>
          </div>
          <div className="w-64">
            {loadingServers ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={selectedServer} onValueChange={setSelectedServer}>
                <SelectTrigger aria-label="Select SQL Server">
                  <SelectValue placeholder="Select SQL Server" />
                </SelectTrigger>
                <SelectContent>
                  {servers.map((s) => (
                    <SelectItem key={s.serverName} value={s.serverName}>
                      {s.serverName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loadingData ? (
            <div className="h-72">
              <Skeleton className="h-full w-full" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-40 grid place-items-center text-sm text-muted-foreground">
              {selectedServer ? 'No data available for the selected server' : 'Select a SQL server to view database sizes'}
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={48}
                  />
                  <YAxis
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                    tickLine={{ stroke: 'hsl(var(--border))' }}
                    label={{ value: 'Size (GB)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value.toFixed(2)} GB`, 'Size']}
                  />
                  <Bar dataKey="sizeGB" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default DatabaseSizePanel;
