import Navigation from '@/components/Navigation';
import StatCard from '@/components/StatCard';
import FilterPanel from '@/components/FilterPanel';
import VaultSummaryCards from '@/components/VaultSummaryCards';
import { Database, Shield, Activity, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, RecoveryVault } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import dashboardHero from '@/assets/dashboard-hero.png';

const Index = () => {
  const [selectedSubscription, setSelectedSubscription] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [vaultData, setVaultData] = useState<RecoveryVault[]>([]);
  const [stats, setStats] = useState({
    totalVaults: 0,
    activeVMs: 0,
    healthyBackupPercentage: '0%',
    inactiveVMs: 0
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when subscription changes
  useEffect(() => {
    loadData();
  }, [selectedSubscription]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const subscriptionParam = selectedSubscription !== 'all' ? selectedSubscription : undefined;
      
      const [
        subscriptionsData, 
        vaultsData, 
        vaultCountData, 
        activeVMsData, 
        healthyBackupData, 
        inactiveVMsData
      ] = await Promise.all([
        api.getDistinctSubscriptions(),
        api.getRecoveryVaults(subscriptionParam),
        api.getVaultCount(subscriptionParam),
        api.getActiveVMsCount(subscriptionParam),
        api.getHealthyBackupPercentage(subscriptionParam),
        api.getInactiveVMsCount(subscriptionParam)
      ]);
      
      setSubscriptions(subscriptionsData);
      setVaultData(vaultsData);
      setStats({
        totalVaults: vaultCountData.TotalVaults,
        activeVMs: activeVMsData.ActiveVMs,
        healthyBackupPercentage: healthyBackupData.HealthyBackupPercentage,
        inactiveVMs: inactiveVMsData.InactiveVMs
      });
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

  const handleRefresh = async () => {
    await loadData();
  };

  const handleInactiveVMsClick = () => {
    navigate('/inactive-vms');
  };

  // Parse percentage for variant calculation
  const healthyPercentage = parseFloat(stats.healthyBackupPercentage.replace('%', ''));

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
            value={stats.totalVaults}
            description="Recovery Service Vaults"
            icon={Database}
            variant="default"
          />
          <StatCard
            title="Healthy Backups"
            value={stats.healthyBackupPercentage}
            description="All backup operations"
            icon={Shield}
            variant={healthyPercentage >= 80 ? "success" : healthyPercentage >= 60 ? "warning" : "error"}
          />
          <StatCard
            title="Active VMs"
            value={stats.activeVMs}
            description="With backup enabled"
            icon={Activity}
            variant="default"
          />
          <StatCard
            title="Inactive VMs"
            value={stats.inactiveVMs}
            description="Requiring attention"
            icon={AlertTriangle}
            variant={stats.inactiveVMs === 0 ? "success" : stats.inactiveVMs <= 5 ? "warning" : "error"}
            onClick={handleInactiveVMsClick}
            clickable={true}
          />
        </div>

        {/* Vault Summary Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Vault Overview</h2>
          <VaultSummaryCards vaults={vaultData} />
        </div>
      </main>
    </div>
  );
};

export default Index;