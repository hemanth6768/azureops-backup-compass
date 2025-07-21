import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, TrendingDown, Plus } from 'lucide-react';

const FuturePanels = () => {
  const futurePanels = [
    {
      title: 'Backup Job Failures',
      description: 'Monitor and track failed backup operations',
      icon: AlertTriangle,
      color: 'bg-gradient-error'
    },
    {
      title: 'Inactive VM Backups',
      description: 'Identify VMs without recent backup activity',
      icon: TrendingDown,
      color: 'bg-gradient-warning'
    },
    {
      title: 'Scheduled Alerts',
      description: 'Configure and manage backup health alerts',
      icon: Calendar,
      color: 'bg-gradient-primary'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Coming Soon</h2>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Request Feature
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {futurePanels.map((panel, index) => (
          <Card 
            key={panel.title} 
            className="bg-gradient-card shadow-card opacity-75 hover:opacity-90 transition-all duration-300 animate-fade-in border-dashed"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="text-center pb-3">
              <div className={`w-12 h-12 ${panel.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                <panel.icon className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-lg">{panel.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                {panel.description}
              </p>
              <Button variant="outline" size="sm" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FuturePanels;