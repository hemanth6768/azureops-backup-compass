import Navigation from '@/components/Navigation';
import StatCard from '@/components/StatCard';
import FilterPanel from '@/components/FilterPanel';
import BackupHealthChart from '@/components/BackupHealthChart';
import VaultSummaryCards from '@/components/VaultSummaryCards';
import FuturePanels from '@/components/FuturePanels';
import RecentActivity from '@/components/RecentActivity';
import { Database, Shield, Activity, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import dashboardHero from '@/assets/dashboard-hero.png';

const Index = () => {
  const [selectedSubscription, setSelectedSubscription] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with actual API calls
  const subscriptions = ['Prod-Infra', 'Shared Services', 'DevOps', 'QA-Test'];
  
  const vaultData = [
    {
      name: "vault-east-1",
      resourceGroupName: "rg-backup-east",
      location: "East US",
      subscriptionName: "Prod-Infra"
    },
    {
      name: "vault-west-2", 
      resourceGroupName: "rg-shared",
      location: "West Europe",
      subscriptionName: "Shared Services"
    },
    {
      name: "vault-central-1",
      resourceGroupName: "rg-central",
      location: "Central US",
      subscriptionName: "DevOps"
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

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
            value={vaultData.length}
            description="Recovery Service Vaults"
            icon={Database}
            variant="default"
          />
          <StatCard
            title="Healthy Backups"
            value="89%"
            description="All backup operations"
            icon={Shield}
            variant="success"
            trend="up"
            trendValue="+2.3%"
          />
          <StatCard
            title="Active VMs"
            value="156"
            description="With backup enabled"
            icon={Activity}
            variant="default"
          />
          <StatCard
            title="Alerts"
            value="3"
            description="Requiring attention"
            icon={AlertTriangle}
            variant="warning"
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
            <BackupHealthChart />
          </div>
          
          {/* Recent Activity */}
          <div>
            <RecentActivity />
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
