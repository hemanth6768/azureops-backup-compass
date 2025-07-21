import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'backup' | 'restore' | 'alert';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  source: string;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

const RecentActivity = ({ activities }: RecentActivityProps) => {
  const defaultActivities: ActivityItem[] = [
    {
      id: '1',
      type: 'backup',
      message: 'Backup completed for vm-web-01',
      timestamp: '2 minutes ago',
      status: 'success',
      source: 'vault-west-2'
    },
    {
      id: '2',
      type: 'alert',
      message: 'Backup warning for vm-db-03 - policy mismatch',
      timestamp: '15 minutes ago',
      status: 'warning',
      source: 'vault-east-1'
    },
    {
      id: '3',
      type: 'backup',
      message: 'Backup failed for vm-app-05 - insufficient storage',
      timestamp: '1 hour ago',
      status: 'error',
      source: 'vault-central-1'
    },
    {
      id: '4',
      type: 'restore',
      message: 'Restore operation initiated for vm-web-01',
      timestamp: '2 hours ago',
      status: 'info',
      source: 'vault-west-2'
    },
    {
      id: '5',
      type: 'backup',
      message: 'Daily backup policy updated',
      timestamp: '3 hours ago',
      status: 'info',
      source: 'System'
    }
  ];

  const activityData = activities || defaultActivities;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {activityData.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg bg-background/50 hover:bg-background transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                {getStatusIcon(activity.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                    {activity.source}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;