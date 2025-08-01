import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Predefined complete themes
const themes = [
  {
    name: 'Dark Theme',
    id: 'dark',
    description: 'Modern dark theme with glassmorphism effects',
    preview: '220 13% 9%',
    colors: {
      mode: 'dark',
      primary: '217 91% 60%',
      primaryGlow: '237 100% 70%',
      background: '220 13% 9%',
      foreground: '220 13% 95%',
      card: '220 13% 12%',
      cardForeground: '220 13% 95%',
      sidebar: '220 13% 10%',
      sidebarForeground: '220 13% 90%',
      border: '220 13% 20%',
      input: '220 13% 18%',
      muted: '220 13% 15%',
      mutedForeground: '220 13% 65%'
    }
  },
  {
    name: 'Light Theme',
    id: 'light',
    description: 'Clean light theme with subtle shadows',
    preview: '0 0% 100%',
    colors: {
      mode: 'light',
      primary: '217 91% 60%',
      primaryGlow: '237 100% 70%',
      background: '0 0% 100%',
      foreground: '220 13% 15%',
      card: '0 0% 100%',
      cardForeground: '220 13% 15%',
      sidebar: '0 0% 100%',
      sidebarForeground: '220 13% 20%',
      border: '220 13% 85%',
      input: '220 13% 95%',
      muted: '220 13% 95%',
      mutedForeground: '220 13% 45%'
    }
  },
  {
    name: 'Light Blue',
    id: 'light-blue',
    description: 'Soft blue theme with cool undertones',
    preview: '220 50% 98%',
    colors: {
      mode: 'light',
      primary: '210 100% 50%',
      primaryGlow: '220 100% 60%',
      background: '220 50% 98%',
      foreground: '220 30% 15%',
      card: '220 50% 99%',
      cardForeground: '220 30% 15%',
      sidebar: '220 50% 96%',
      sidebarForeground: '220 30% 20%',
      border: '220 30% 85%',
      input: '220 30% 95%',
      muted: '220 30% 93%',
      mutedForeground: '220 30% 45%'
    }
  },
  {
    name: 'Saffron',
    id: 'saffron',
    description: 'Warm saffron theme with golden accents',
    preview: '45 100% 96%',
    colors: {
      mode: 'light',
      primary: '45 93% 47%',
      primaryGlow: '43 96% 56%',
      background: '45 100% 96%',
      foreground: '45 30% 15%',
      card: '45 80% 98%',
      cardForeground: '45 30% 15%',
      sidebar: '45 60% 94%',
      sidebarForeground: '45 30% 20%',
      border: '45 30% 82%',
      input: '45 30% 92%',
      muted: '45 30% 90%',
      mutedForeground: '45 30% 40%'
    }
  },
  {
    name: 'Purple Night',
    id: 'purple-night',
    description: 'Deep purple theme with mystical vibes',
    preview: '270 30% 8%',
    colors: {
      mode: 'dark',
      primary: '270 91% 65%',
      primaryGlow: '285 100% 75%',
      background: '270 30% 8%',
      foreground: '270 10% 95%',
      card: '270 30% 12%',
      cardForeground: '270 10% 95%',
      sidebar: '270 30% 10%',
      sidebarForeground: '270 10% 90%',
      border: '270 20% 20%',
      input: '270 20% 18%',
      muted: '270 20% 15%',
      mutedForeground: '270 10% 65%'
    }
  },
  {
    name: 'Forest Green',
    id: 'forest-green',
    description: 'Natural green theme inspired by forests',
    preview: '160 30% 10%',
    colors: {
      mode: 'dark',
      primary: '160 84% 39%',
      primaryGlow: '158 64% 52%',
      background: '160 30% 10%',
      foreground: '160 10% 95%',
      card: '160 30% 13%',
      cardForeground: '160 10% 95%',
      sidebar: '160 30% 11%',
      sidebarForeground: '160 10% 90%',
      border: '160 20% 22%',
      input: '160 20% 20%',
      muted: '160 20% 17%',
      mutedForeground: '160 10% 65%'
    }
  }
];

const Settings = () => {
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const { toast } = useToast();

  // Load saved settings on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
    setSelectedTheme(savedTheme);
    
    // Apply the saved theme immediately
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    
    if (theme) {
      const root = document.documentElement;
      
      // Apply theme mode class
      document.documentElement.classList.toggle('dark', theme.colors.mode === 'dark');
      
      // Apply all theme colors
      root.style.setProperty('--primary', theme.colors.primary);
      root.style.setProperty('--primary-hover', theme.colors.primary);
      root.style.setProperty('--background', theme.colors.background);
      root.style.setProperty('--foreground', theme.colors.foreground);
      root.style.setProperty('--card', theme.colors.card);
      root.style.setProperty('--card-foreground', theme.colors.cardForeground);
      root.style.setProperty('--popover', theme.colors.card);
      root.style.setProperty('--popover-foreground', theme.colors.cardForeground);
      root.style.setProperty('--sidebar-background', theme.colors.sidebar);
      root.style.setProperty('--sidebar-foreground', theme.colors.sidebarForeground);
      root.style.setProperty('--sidebar-accent', theme.colors.mode === 'dark' ? '220 13% 18%' : '220 13% 95%');
      root.style.setProperty('--sidebar-accent-foreground', theme.colors.sidebarForeground);
      root.style.setProperty('--sidebar-border', theme.colors.border);
      root.style.setProperty('--sidebar-hover', theme.colors.mode === 'dark' ? '220 13% 15%' : '220 13% 92%');
      root.style.setProperty('--border', theme.colors.border);
      root.style.setProperty('--input', theme.colors.input);
      root.style.setProperty('--muted', theme.colors.muted);
      root.style.setProperty('--muted-foreground', theme.colors.mutedForeground);
      
      // Update gradients
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${theme.colors.primary} / 0.9), hsl(${theme.colors.primaryGlow} / 0.8))`);
      root.style.setProperty('--gradient-sidebar', `linear-gradient(180deg, hsl(${theme.colors.sidebar} / 0.95), hsl(${theme.colors.sidebar} / 0.9))`);
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
  };

  const saveSettings = () => {
    localStorage.setItem('selectedTheme', selectedTheme);
    
    toast({
      title: "Theme Saved",
      description: "Your theme preference has been saved successfully.",
    });
  };

  const resetToDefault = () => {
    setSelectedTheme('dark');
    applyTheme('dark');
    
    toast({
      title: "Reset to Default",
      description: "Theme has been reset to default dark theme.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Header with sidebar trigger */}
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Settings</h1>
                <p className="text-xs text-muted-foreground">Customize your theme and appearance</p>
              </div>
            </div>
          </header>

          <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
            {/* Hero Section */}
            <div className="mb-8">
              <div className="relative rounded-xl overflow-hidden bg-gradient-primary p-8 text-white">
                <div className="relative z-10">
                  <h1 className="text-4xl font-bold mb-2">Theme Settings</h1>
                  <p className="text-xl text-white/90">
                    Choose from our carefully crafted theme presets
                  </p>
                </div>
              </div>
            </div>

            {/* Theme Selection */}
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle>Choose Your Theme</CardTitle>
                <CardDescription>
                  Select from our carefully crafted theme presets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {themes.map((theme) => (
                    <div
                      key={theme.id}
                      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                        selectedTheme === theme.id
                          ? 'border-primary shadow-xl shadow-primary/25 ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50 hover:shadow-lg'
                      }`}
                      onClick={() => handleThemeChange(theme.id)}
                    >
                      {/* Theme Preview */}
                      <div className="flex items-center gap-4 mb-4">
                        <div 
                          className="w-16 h-16 rounded-lg border-2 shadow-inner relative overflow-hidden"
                          style={{ backgroundColor: `hsl(${theme.preview})` }}
                        >
                          <div 
                            className="absolute top-2 left-2 w-3 h-3 rounded-full"
                            style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                          />
                          <div 
                            className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
                            style={{ backgroundColor: `hsl(${theme.colors.primaryGlow})` }}
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="font-semibold text-lg">{theme.name}</Label>
                          <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
                        </div>
                      </div>
                      
                      {/* Selection Indicator */}
                      {selectedTheme === theme.id && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button onClick={saveSettings} className="btn-enhanced btn-primary">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
              <Button variant="outline" onClick={resetToDefault} className="btn-enhanced">
                Reset to Default
              </Button>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Settings;