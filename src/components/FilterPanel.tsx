import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, RefreshCw } from 'lucide-react';

interface FilterPanelProps {
  subscriptions: string[];
  selectedSubscription: string;
  onSubscriptionChange: (subscription: string) => void;
  onSearchChange: (search: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

const FilterPanel = ({ 
  subscriptions, 
  selectedSubscription,
  onSubscriptionChange, 
  onSearchChange, 
  onRefresh,
  isLoading = false 
}: FilterPanelProps) => {
  return (
    <Card className="bg-gradient-card shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary" />
          <span>Filters & Search</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subscription Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Subscription</label>
            <Select value={selectedSubscription} onValueChange={onSubscriptionChange}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="All Subscriptions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subscriptions</SelectItem>
                {subscriptions.map((sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search vaults, VMs..."
                className="pl-10 bg-background"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Refresh Button */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">&nbsp;</label>
            <Button 
              onClick={onRefresh}
              disabled={isLoading}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;