import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, MapPin, Users, Activity } from 'lucide-react';

interface VaultData {
  vaultName: string;
  resourceGroupName: string;
  location: string;
  subscriptionName: string;
}

interface VaultSummaryData {
  totalResourceGroups: number;
  locationStats: Array<{
    location: string;
    vaultCount: number;
  }>;
}

interface VaultSummaryCardsProps {
  vaults: VaultData[];
  vaultSummary?: VaultSummaryData;
}

const VaultSummaryCards = ({ vaults, vaultSummary }: VaultSummaryCardsProps) => {
  // Use API data if available, otherwise fallback to calculated values
  const locationStats = vaultSummary?.locationStats || 
    Object.entries(vaults.reduce((acc, vault) => {
      acc[vault.location] = (acc[vault.location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).map(([location, vaultCount]) => ({ location, vaultCount }));

  // Get unique subscriptions
  const uniqueSubscriptions = new Set(vaults.map(v => v.subscriptionName)).size;
  
  // Get unique resource groups - use API data if available
  const uniqueResourceGroups = vaultSummary?.totalResourceGroups || 
    new Set(vaults.map(v => v.resourceGroupName)).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Vaults */}
      <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Vaults</p>
              <p className="text-3xl font-bold text-primary">{vaults.length}</p>
            </div>
            <div className="p-3 bg-gradient-primary rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions */}
      <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Subscriptions</p>
              <p className="text-3xl font-bold text-success">{uniqueSubscriptions}</p>
            </div>
            <div className="p-3 bg-gradient-success rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Groups */}
      <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Resource Groups</p>
              <p className="text-3xl font-bold text-warning">{uniqueResourceGroups}</p>
            </div>
            <div className="p-3 bg-gradient-warning rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2 max-h-20 overflow-y-auto">
            {locationStats.map(({ location, vaultCount }) => (
              <div key={location} className="flex items-center justify-between">
                <span className="text-sm text-foreground truncate">{location}</span>
                <Badge variant="secondary" className="text-xs">
                  {vaultCount}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VaultSummaryCards;