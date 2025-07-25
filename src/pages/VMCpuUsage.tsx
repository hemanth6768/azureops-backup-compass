import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Cpu } from 'lucide-react';
import { api, VMUsage } from '@/lib/api';
import { toast } from 'sonner';

const VMCpuUsage = () => {
  const [selectedSubscription, setSelectedSubscription] = useState<string>('all');
  const [filteredData, setFilteredData] = useState<VMUsage[]>([]);

  // Fetch all VM usages
  const { data: vmUsages = [], isLoading: isLoadingUsages, error: usagesError } = useQuery({
    queryKey: ['vmUsages'],
    queryFn: api.getVMUsages,
  });

  // Fetch subscriptions
  const { data: subscriptions = [], isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: api.getDistinctSubscriptions,
  });

  // Fetch subscription-specific data when subscription is selected
  const { data: subscriptionUsages, isLoading: isLoadingSubscriptionData } = useQuery({
    queryKey: ['vmUsages', selectedSubscription],
    queryFn: () => api.getVMUsagesBySubscription(selectedSubscription),
    enabled: selectedSubscription !== 'all' && selectedSubscription !== '',
  });

  useEffect(() => {
    if (usagesError) {
      toast.error('Failed to load VM usage data');
    }
  }, [usagesError]);

  useEffect(() => {
    if (selectedSubscription === 'all') {
      setFilteredData(vmUsages);
    } else if (subscriptionUsages) {
      setFilteredData(subscriptionUsages);
    } else if (selectedSubscription !== '' && selectedSubscription !== 'all') {
      // Filter local data if API doesn't return data
      const filtered = vmUsages.filter(
        usage => usage.subscriptionName === selectedSubscription
      );
      setFilteredData(filtered);
    }
  }, [selectedSubscription, vmUsages, subscriptionUsages]);

  const formatCpuUsage = (usage: number) => {
    return `${usage.toFixed(2)}%`;
  };

  const getCpuUsageColor = (usage: number) => {
    if (usage >= 80) return 'destructive';
    if (usage >= 60) return 'secondary';
    return 'default';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isLoading = isLoadingUsages || isLoadingSubscriptions || isLoadingSubscriptionData;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <Cpu className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Azure VM CPU Usage</h1>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4">
            <Card>
              <CardHeader>
                <CardTitle>CPU Usage across Subscriptions</CardTitle>
                <CardDescription>
                  Monitor CPU usage for virtual machines across your Azure subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label htmlFor="subscription-select" className="text-sm font-medium">
                      Filter by Subscription:
                    </label>
                    <Select
                      value={selectedSubscription}
                      onValueChange={setSelectedSubscription}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Select subscription" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Subscriptions</SelectItem>
                        {subscriptions.map((subscription) => (
                          <SelectItem key={subscription} value={subscription}>
                            {subscription}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </div>
                  )}
                </div>

                {filteredData.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Computer Name</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead>Max CPU Usage</TableHead>
                          <TableHead>Time Generated</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((usage, index) => (
                          <TableRow key={`${usage.computer}-${usage.timeGenerated}-${index}`}>
                            <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                            <TableCell className="font-medium">
                              {usage.computer}
                            </TableCell>
                            <TableCell>{usage.subscriptionName}</TableCell>
                            <TableCell>
                              <Badge variant={getCpuUsageColor(usage.maxCPUUsage)}>
                                {formatCpuUsage(usage.maxCPUUsage)}
                              </Badge>
                            </TableCell>
                            <TableCell>{formatDateTime(usage.timeGenerated)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Cpu className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No VM Usage Data</h3>
                    <p className="text-muted-foreground">
                      {selectedSubscription !== 'all' 
                        ? `No CPU usage data found for subscription "${selectedSubscription}"`
                        : 'No CPU usage data available at the moment'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default VMCpuUsage;