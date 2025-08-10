import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, ArrowLeft, AlertTriangle } from 'lucide-react';
import { api, BackupItem } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import BackButton from '@/components/BackButton';

const InactiveVMs = () => {
  const [inactiveVMs, setInactiveVMs] = useState<BackupItem[]>([]);
  const [filteredVMs, setFilteredVMs] = useState<BackupItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subscriptionParam = searchParams.get('subscription');

  useEffect(() => {
    loadInactiveVMs();
  }, [subscriptionParam]);

  useEffect(() => {
    filterVMs();
  }, [searchTerm, inactiveVMs]);

  const loadInactiveVMs = async () => {
    setIsLoading(true);
    try {
      let data;
      if (subscriptionParam) {
        data = await api.getInactiveVMsBySubscription(subscriptionParam);
      } else {
        data = await api.getInactiveVMDetails();
      }
      setInactiveVMs(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load inactive VMs';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterVMs = () => {
    const filtered = inactiveVMs.filter(vm => 
      vm.vmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.subscriptionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.vaultName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vm.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVMs(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'completed') return <Badge variant="default" className="bg-success text-white">Completed</Badge>;
    if (statusLower === 'failed') return <Badge variant="destructive">Failed</Badge>;
    if (statusLower === 'inprogress') return <Badge variant="secondary">In Progress</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  const getPreCheckBadge = (preCheck: string) => {
    const preCheckLower = preCheck.toLowerCase();
    if (preCheckLower === 'healthy') return <Badge variant="default" className="bg-success text-white">Healthy</Badge>;
    if (preCheckLower === 'actionrequired') return <Badge variant="destructive">Action Required</Badge>;
    if (preCheckLower === 'passed') return <Badge variant="default" className="bg-success text-white">Passed</Badge>;
    return <Badge variant="outline">{preCheck}</Badge>;
  };

  const exportToCSV = () => {
    const headers = [
      'VM Name',
      'Subscription',
      'Vault Name', 
      'Resource Group',
      'Backup Pre-Check',
      'Last Backup Status',
      'Latest Restore Point',
      'Policy Name',
      'Policy Sub Type'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredVMs.map(vm => [
        vm.vmName,
        vm.subscriptionName,
        vm.vaultName,
        vm.resourceGroup,
        vm.backupPreCheck,
        vm.lastBackupStatus,
        vm.latestRestorePoint,
        vm.policyName,
        vm.policySubType
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inactive-vms.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Inactive VMs</h1>
                <p className="text-xs text-muted-foreground">VMs requiring backup attention</p>
              </div>
            </div>
            <div className="ml-auto">
              <BackButton to="/" label="Back to Dashboard" />
            </div>
          </header>
      
      <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inactive VMs Details</h1>
            {subscriptionParam && (
              <p className="text-muted-foreground mt-1">
                Filtered for subscription: <span className="font-medium">{subscriptionParam}</span>
              </p>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                Inactive Virtual Machines
                <Badge variant="secondary">{filteredVMs.length} VMs</Badge>
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search VMs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={exportToCSV}
                  disabled={filteredVMs.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>VM Name</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Vault Name</TableHead>
                      <TableHead>Resource Group</TableHead>
                      <TableHead>Backup Pre-Check</TableHead>
                      <TableHead>Last Backup Status</TableHead>
                      <TableHead>Latest Restore Point</TableHead>
                      <TableHead>Policy Name</TableHead>
                      <TableHead>Policy Sub Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVMs.map((vm, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground font-bold">{index + 1}</TableCell>
                        <TableCell className="font-medium">{vm.vmName}</TableCell>
                        <TableCell>{vm.subscriptionName}</TableCell>
                        <TableCell>{vm.vaultName}</TableCell>
                        <TableCell>{vm.resourceGroup}</TableCell>
                        <TableCell>{getPreCheckBadge(vm.backupPreCheck)}</TableCell>
                        <TableCell>{getStatusBadge(vm.lastBackupStatus)}</TableCell>
                        <TableCell>{new Date(vm.latestRestorePoint).toLocaleDateString()}</TableCell>
                        <TableCell>{vm.policyName || 'N/A'}</TableCell>
                        <TableCell>{vm.policySubType}</TableCell>
                      </TableRow>
                    ))}
                    {filteredVMs.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                          No inactive VMs found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default InactiveVMs;