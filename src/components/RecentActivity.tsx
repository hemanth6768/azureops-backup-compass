import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { BackupItem } from '@/lib/api';

interface ActivityItem {
  id: string;
  type: 'backup' | 'restore' | 'alert';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  source: string;
}

interface RecentActivityProps {
  backupItems: BackupItem[];
}

const RecentActivity = ({ backupItems }: RecentActivityProps) => {
  // Convert backup items to activity format
  const activityData: ActivityItem[] = backupItems
    .sort((a, b) => new Date(b.latestRestorePoint).getTime() - new Date(a.latestRestorePoint).getTime())
    .slice(0, 6)
    .map((item, index) => ({
      id: `${index + 1}`,
      type: 'backup' as const,
      message: `Backup ${item.lastBackupStatus.toLowerCase()} for ${item.vmName}`,
      timestamp: new Date(item.latestRestorePoint).toLocaleString(),
      status: item.lastBackupStatus === 'Completed' ? 'success' as const : 
              item.lastBackupStatus === 'Failed' ? 'error' as const : 'warning' as const,
      source: item.vaultName
    }));

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