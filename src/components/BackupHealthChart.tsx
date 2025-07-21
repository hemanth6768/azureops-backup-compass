import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Shield } from 'lucide-react';
import { BackupItem } from '@/lib/api';

interface HealthData {
  name: string;
  value: number;
  color: string;
}

interface BackupHealthChartProps {
  backupItems: BackupItem[];
}

const BackupHealthChart = ({ backupItems }: BackupHealthChartProps) => {
  const healthyCount = backupItems.filter(item => 
    item.lastBackupStatus === 'Completed' && item.backupPreCheck === 'Healthy'
  ).length;
  
  const warningCount = backupItems.filter(item => 
    item.lastBackupStatus === 'Completed' && item.backupPreCheck !== 'Healthy'
  ).length;
  
  const failedCount = backupItems.filter(item => 
    item.lastBackupStatus === 'Failed'
  ).length;

  const chartData: HealthData[] = [
    { name: 'Healthy', value: healthyCount, color: 'hsl(var(--success))' },
    { name: 'Warning', value: warningCount, color: 'hsl(var(--warning))' },
    { name: 'Failed', value: failedCount, color: 'hsl(var(--destructive))' }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} items ({((data.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-gradient-card shadow-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span>Backup Health Overview</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span className="text-sm text-foreground">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackupHealthChart;