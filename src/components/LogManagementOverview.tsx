import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Database, HardDrive } from 'lucide-react';
import { api, LargeLogFile } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
const LogManagementOverview = () => {
  const [logFiles, setLogFiles] = useState<LargeLogFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLogFiles();
  }, []);

  const loadLogFiles = async () => {
    try {
      setIsLoading(true);
      const data = await api.getLargeLogFiles();
      setLogFiles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load large log files",
        variant: "destructive",
      });
      console.error('Failed to load large log files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSizeVariant = (size: string) => {
    const sizeValue = parseFloat(size.replace(/[^\d.]/g, ''));
    if (sizeValue >= 10) return 'destructive';
    if (sizeValue >= 7) return 'default';
    return 'secondary';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-muted-foreground" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="card-enhanced">
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (logFiles.length === 0) {
    return (
      <div className="text-center py-8">
        <HardDrive className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Large Log Files</h3>
        <p className="text-muted-foreground">All log files are within acceptable size limits.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-warning rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Log Management Overview</h3>
          <p className="text-sm text-muted-foreground">
            {logFiles.length} log file{logFiles.length !== 1 ? 's' : ''} requiring attention ({'>'}5GB)
          </p>
        </div>
      </div>

      <ScrollArea className="max-h-[28rem] [&>[data-radix-scroll-area-scrollbar]]:bg-muted/50 [&>[data-radix-scroll-area-scrollbar]]:border-0 [&>[data-radix-scroll-area-scrollbar]]:w-3 [&>[data-radix-scroll-area-thumb]]:bg-muted-foreground/40 [&>[data-radix-scroll-area-thumb]]:rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
          {logFiles.map((logFile, index) => (
            <Card key={index} className="card-enhanced">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Database className="w-4 h-4 text-primary" />
                  <span className="truncate">{logFile.serverName}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Database:</span>
                    <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                      {logFile.databaseName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Total Size:</span>
                    <Badge variant={getSizeVariant(logFile.totalSize)} className="text-xs">
                      {logFile.totalSize}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Free Space:</span>
                    <span className="text-sm font-medium text-foreground">
                      {logFile.freeSpace}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LogManagementOverview;