import Navigation from '@/components/Navigation';
import StatCard from '@/components/StatCard';
import FilterPanel from '@/components/FilterPanel';
import BackupHealthChart from '@/components/BackupHealthChart';
import VaultSummaryCards from '@/components/VaultSummaryCards';
import FuturePanels from '@/components/FuturePanels';
import RecentActivity from '@/components/RecentActivity';
import { Database, Shield, Activity, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, RecoveryVault, BackupItem } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import dashboardHero from '@/assets/dashboard-hero.png';

const Index = () => {
  const [selectedSubscription, setSelectedSubscription] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [vaultData, setVaultData] = useState<RecoveryVault[]>([]);
  const [backupItems, setBackupItems] = useState<BackupItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Filter backup items when subscription changes
  useEffect(() => {
    if (selectedSubscription !== 'all') {
      loadBackupItemsBySubscription(selectedSubscription);
    } else {
      loadBackupItems();
    }
  }, [selectedSubscription]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [subscriptionsData, vaultsData, backupItemsData] = await Promise.all([
        api.getDistinctSubscriptions(),
        api.getRecoveryVaults(),
        api.getBackupItems()
      ]);
      
      setSubscriptions(subscriptionsData);
      setVaultData(vaultsData);
      setBackupItems(backupItemsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadBackupItems = async () => {
    try {
      const data = await api.getBackupItems();
      setBackupItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load backup items';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const loadBackupItemsBySubscription = async (subscription: string) => {
    try {
      const data = await api.getBackupItemsBySubscription(subscription);
      setBackupItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load backup items for subscription';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    await loadData();
  };

  // Calculate stats from real data
  const totalVaults = vaultData.length;
  const healthyBackups = backupItems.filter(item => item.lastBackupStatus === 'Completed').length;
  const healthyPercentage = backupItems.length > 0 ? Math.round((healthyBackups / backupItems.length) * 100) : 0;
  const activeVMs = backupItems.length;
  const alertsCount = backupItems.filter(item => 
    item.lastBackupStatus === 'Failed' || item.backupPreCheck !== 'Healthy'
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="relative rounded-xl overflow-hidden bg-gradient-primary p-8 text-white">
            <div className="absolute inset-0 opacity-10">
              <img 
                src={dashboardHero} 
                alt="Dashboard Overview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">AzureOps Monitor Dashboard</h1>
              <p className="text-xl text-white/90">
                Centralized view for Azure Backup & Vault health across all subscriptions
              </p>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="mb-8">
          <FilterPanel
            subscriptions={subscriptions}
            onSubscriptionChange={setSelectedSubscription}
            onSearchChange={setSearchTerm}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Vaults"
            value={totalVaults}
            description="Recovery Service Vaults"
            icon={Database}
            variant="default"
          />
          <StatCard
            title="Healthy Backups"
            value={`${healthyPercentage}%`}
            description="All backup operations"
            icon={Shield}
            variant={healthyPercentage >= 80 ? "success" : healthyPercentage >= 60 ? "warning" : "error"}
          />
          <StatCard
            title="Active VMs"
            value={activeVMs}
            description="With backup enabled"
            icon={Activity}
            variant="default"
          />
          <StatCard
            title="Alerts"
            value={alertsCount}
            description="Requiring attention"
            icon={AlertTriangle}
            variant={alertsCount === 0 ? "success" : alertsCount <= 5 ? "warning" : "error"}
          />
        </div>

        {/* Vault Summary Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Vault Overview</h2>
          <VaultSummaryCards vaults={vaultData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Backup Health Chart */}
          <div className="lg:col-span-2">
            <BackupHealthChart backupItems={backupItems} />
          </div>
          
          {/* Recent Activity */}
          <div>
            <RecentActivity backupItems={backupItems} />
          </div>
        </div>

        {/* Future Panels */}
        <div className="mb-8">
          <FuturePanels />
        </div>
      </main>
    </div>
  );
};

export default Index;
