import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, RefreshCw } from 'lucide-react';
import { api, RecoveryVault } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const RecoveryVaults = () => {
  const [vaults, setVaults] = useState<RecoveryVault[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<RecoveryVault[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadVaults();
  }, [selectedSubscription]);

  useEffect(() => {
    filterVaults();
  }, [searchTerm, vaults]);

  const loadData = async () => {
    try {
      const subscriptionsData = await api.getDistinctSubscriptions();
      setSubscriptions(subscriptionsData);
      await loadVaults();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const loadVaults = async () => {
    setIsLoading(true);
    try {
      const subscriptionParam = selectedSubscription !== 'all' ? selectedSubscription : undefined;
      const data = await api.getRecoveryVaults(subscriptionParam);
      setVaults(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load recovery vaults';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterVaults = () => {
    const filtered = vaults.filter(vault => 
      vault.vaultName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vault.subscriptionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vault.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vault.resourceGroupName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVaults(filtered);
  };

  const handleRefresh = async () => {
    await loadVaults();
  };

  const exportToCSV = () => {
    const headers = [
      'Vault Name',
      'Subscription',
      'Resource Group',
      'Location'
    ];

    const csvContent = [
      headers.join(','),
      ...filteredVaults.map(vault => [
        vault.vaultName,
        vault.subscriptionName,
        vault.resourceGroupName,
        vault.location
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-vaults.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Recovery Vaults</h1>
          <p className="text-muted-foreground mt-2">Manage and monitor Azure Recovery Service Vaults</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                Recovery Service Vaults
                <span className="text-sm font-normal text-muted-foreground">
                  ({filteredVaults.length} vaults)
                </span>
              </CardTitle>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <Select value={selectedSubscription} onValueChange={setSelectedSubscription}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscriptions</SelectItem>
                    {subscriptions.map((sub) => (
                      <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search vaults..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                
                <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={exportToCSV}
                  disabled={filteredVaults.length === 0}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading recovery vaults...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vault Name</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Resource Group</TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVaults.map((vault, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{vault.vaultName}</TableCell>
                        <TableCell>{vault.subscriptionName}</TableCell>
                        <TableCell>{vault.resourceGroupName}</TableCell>
                        <TableCell className="capitalize">{vault.location}</TableCell>
                      </TableRow>
                    ))}
                    {filteredVaults.length === 0 && !isLoading && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No recovery vaults found
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
    </div>
  );
};

export default RecoveryVaults;