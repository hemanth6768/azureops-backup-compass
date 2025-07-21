import { Cloud, BarChart3, Database, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: BarChart3, href: '/', active: true },
    { name: 'Recovery Vaults', icon: Database, href: '/vaults', active: false },
    { name: 'Backup Items', icon: Cloud, href: '/backup-items', active: false },
    { name: 'Settings', icon: Settings, href: '/settings', active: false },
  ];

  return (
    <nav className="bg-gradient-primary shadow-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">AzureOps Monitor</h1>
              <p className="text-xs text-white/80">Centralized view for Azure Backup & Vault health</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <a key={item.name} href={item.href}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={`text-white hover:bg-white/10 ${
                    item.active ? 'bg-white/20 text-white' : 'text-white/90'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a key={item.name} href={item.href}>
                  <Button
                    variant={item.active ? "secondary" : "ghost"}
                    className={`justify-start text-white hover:bg-white/10 w-full ${
                      item.active ? 'bg-white/20 text-white' : 'text-white/90'
                    }`}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;