import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue,
  variant = 'default'
}: StatCardProps) => {
  const getGradient = () => {
    switch (variant) {
      case 'success': return 'bg-gradient-success';
      case 'warning': return 'bg-gradient-warning';
      case 'error': return 'bg-gradient-error';
      default: return 'bg-gradient-primary';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className={`p-2 rounded-lg ${getGradient()}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            </div>
            
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground">{value}</p>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
              {trend && trendValue && (
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className={getTrendColor()}>
                    {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;