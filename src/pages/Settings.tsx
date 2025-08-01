import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Palette, Monitor, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Theme modes
const themeModes = [
  { name: 'Dark Mode', id: 'dark', description: 'Modern dark theme with glassmorphism' },
  { name: 'Light Mode', id: 'light', description: 'Clean light theme with subtle shadows' }
];

// Predefined color themes
const colorThemes = [
  {
    name: 'Default Blue',
    id: 'default',
    colors: {
      primary: '217 91% 60%',
      primaryGlow: '237 100% 70%',
      success: '142 76% 50%',
      warning: '38 92% 50%',
      destructive: '0 84% 60%',
    }
  },
  {
    name: 'Purple Storm',
    id: 'purple',
    colors: {
      primary: '270 91% 65%',
      primaryGlow: '285 100% 75%',
      success: '142 76% 50%',
      warning: '38 92% 50%',
      destructive: '0 84% 60%',
    }
  },
  {
    name: 'Emerald Dream',
    id: 'emerald',
    colors: {
      primary: '160 84% 39%',
      primaryGlow: '158 64% 52%',
      success: '142 76% 50%',
      warning: '38 92% 50%',
      destructive: '0 84% 60%',
    }
  },
  {
    name: 'Amber Sunset',
    id: 'amber',
    colors: {
      primary: '45 93% 47%',
      primaryGlow: '43 96% 56%',
      success: '142 76% 50%',
      warning: '38 92% 50%',
      destructive: '0 84% 60%',
    }
  },
  {
    name: 'Rose Pink',
    id: 'rose',
    colors: {
      primary: '330 81% 60%',
      primaryGlow: '335 88% 70%',
      success: '142 76% 50%',
      warning: '38 92% 50%',
      destructive: '0 84% 60%',
    }
  },
  {
    name: 'Cyan Electric',
    id: 'cyan',
    colors: {
      primary: '188 94% 43%',
      primaryGlow: '186 100% 56%',
      success: '142 76% 50%',
      warning: '38 92% 50%',
      destructive: '0 84% 60%',
    }
  }
];

const backgroundOptions = {
  dark: [
    { name: 'Dark Glassmorphism', id: 'dark', value: '220 13% 9%' },
    { name: 'Midnight Black', id: 'midnight', value: '220 20% 5%' },
    { name: 'Deep Blue', id: 'deep-blue', value: '220 50% 8%' },
    { name: 'Charcoal', id: 'charcoal', value: '0 0% 10%' }
  ],
  light: [
    { name: 'Pure White', id: 'light', value: '0 0% 100%' },
    { name: 'Soft Gray', id: 'light-gray', value: '220 13% 95%' },
    { name: 'Warm White', id: 'warm', value: '40 10% 98%' },
    { name: 'Cool White', id: 'cool', value: '220 20% 98%' }
  ]
};

const panelBackgroundOptions = {
  dark: [
    { name: 'Glass Effect', id: 'glass', value: '220 13% 12%' },
    { name: 'Semi Transparent', id: 'semi', value: '220 13% 15%' },
    { name: 'Solid Dark', id: 'solid', value: '220 13% 8%' },
    { name: 'Elevated', id: 'elevated', value: '220 13% 18%' }
  ],
  light: [
    { name: 'Clean White', id: 'light-clean', value: '0 0% 100%' },
    { name: 'Soft Gray', id: 'light-soft', value: '220 13% 98%' },
    { name: 'Subtle Tint', id: 'light-tint', value: '220 10% 96%' },
    { name: 'Paper White', id: 'light-paper', value: '40 10% 99%' }
  ]
};

const sidebarColorOptions = [
  { name: 'Default', id: 'default', value: '220 13% 10%' },
  { name: 'Deep Blue', id: 'blue', value: '220 50% 12%' },
  { name: 'Purple Dark', id: 'purple', value: '270 30% 15%' },
  { name: 'Green Dark', id: 'green', value: '160 30% 12%' },
  { name: 'Amber Dark', id: 'amber', value: '45 40% 15%' },
  { name: 'Rose Dark', id: 'rose', value: '330 30% 15%' }
];

const sidebarLightColorOptions = [
  { name: 'Clean White', id: 'light-white', value: '0 0% 100%' },
  { name: 'Soft Blue', id: 'light-blue', value: '220 50% 98%' },
  { name: 'Lavender', id: 'light-purple', value: '270 30% 97%' },
  { name: 'Mint', id: 'light-green', value: '160 30% 98%' },
  { name: 'Cream', id: 'light-amber', value: '45 40% 98%' },
  { name: 'Blush', id: 'light-rose', value: '330 30% 98%' }
];

const Settings = () => {
  const [activeTheme, setActiveTheme] = useState('default');
  const [themeMode, setThemeMode] = useState('dark');
  const [selectedBackground, setSelectedBackground] = useState('dark');
  const [selectedPanelBg, setSelectedPanelBg] = useState('glass');
  const [selectedSidebarBg, setSelectedSidebarBg] = useState('default');
  const { toast } = useToast();

  // Load saved settings on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    const savedMode = localStorage.getItem('themeMode') || 'dark';
    const savedBackground = localStorage.getItem('background') || 'dark';
    const savedPanelBg = localStorage.getItem('panelBackground') || 'glass';
    const savedSidebarBg = localStorage.getItem('sidebarBackground') || 'default';
    
    setActiveTheme(savedTheme);
    setThemeMode(savedMode);
    setSelectedBackground(savedBackground);
    setSelectedPanelBg(savedPanelBg);
    setSelectedSidebarBg(savedSidebarBg);
    
    // Apply the saved theme immediately
    applyTheme(savedTheme, savedMode, savedBackground, savedPanelBg, savedSidebarBg);
  }, []);

  const applyTheme = (themeId: string, mode: string, backgroundId: string, panelBgId: string, sidebarBgId: string) => {
    const theme = colorThemes.find(t => t.id === themeId);
    const background = backgroundOptions[mode as 'dark' | 'light']?.find(b => b.id === backgroundId);
    const panelBg = panelBackgroundOptions[mode as 'dark' | 'light']?.find(p => p.id === panelBgId);
    const sidebarOptions = mode === 'dark' ? sidebarColorOptions : sidebarLightColorOptions;
    const sidebarBg = sidebarOptions.find(s => s.id === sidebarBgId);
    
    if (theme && background && panelBg && sidebarBg) {
      const root = document.documentElement;
      
      // Apply theme mode
      document.documentElement.classList.toggle('dark', mode === 'dark');
      
      // Apply primary colors
      root.style.setProperty('--primary', theme.colors.primary);
      root.style.setProperty('--primary-hover', theme.colors.primary);
      
      // Apply background
      root.style.setProperty('--background', background.value);
      
      // Apply panel background
      root.style.setProperty('--card', panelBg.value);
      root.style.setProperty('--popover', panelBg.value);
      
      // Apply sidebar background
      root.style.setProperty('--sidebar-background', sidebarBg.value);
      
      // Apply mode-specific colors
      if (mode === 'light') {
        root.style.setProperty('--foreground', '220 13% 15%');
        root.style.setProperty('--card-foreground', '220 13% 15%');
        root.style.setProperty('--popover-foreground', '220 13% 15%');
        root.style.setProperty('--muted-foreground', '220 13% 45%');
        root.style.setProperty('--sidebar-foreground', '220 13% 20%');
        root.style.setProperty('--sidebar-accent', '220 13% 95%');
        root.style.setProperty('--sidebar-accent-foreground', '220 13% 15%');
        root.style.setProperty('--sidebar-border', '220 13% 85%');
        root.style.setProperty('--sidebar-hover', '220 13% 92%');
        root.style.setProperty('--border', '220 13% 85%');
        root.style.setProperty('--input', '220 13% 95%');
      } else {
        root.style.setProperty('--foreground', '220 13% 95%');
        root.style.setProperty('--card-foreground', '220 13% 95%');
        root.style.setProperty('--popover-foreground', '220 13% 95%');
        root.style.setProperty('--muted-foreground', '220 13% 65%');
        root.style.setProperty('--sidebar-foreground', '220 13% 90%');
        root.style.setProperty('--sidebar-accent', '220 13% 18%');
        root.style.setProperty('--sidebar-accent-foreground', '220 13% 95%');
        root.style.setProperty('--sidebar-border', '220 13% 20%');
        root.style.setProperty('--sidebar-hover', '220 13% 15%');
        root.style.setProperty('--border', '220 13% 20%');
        root.style.setProperty('--input', '220 13% 18%');
      }
      
      // Update gradients
      root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${theme.colors.primary} / 0.9), hsl(${theme.colors.primaryGlow} / 0.8))`);
      root.style.setProperty('--gradient-sidebar', `linear-gradient(180deg, hsl(${sidebarBg.value} / 0.95), hsl(${sidebarBg.value} / 0.9))`);
    }
  };

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    applyTheme(themeId, themeMode, selectedBackground, selectedPanelBg, selectedSidebarBg);
  };

  const handleModeChange = (mode: string) => {
    setThemeMode(mode);
    // Reset to defaults when switching modes
    const defaultBg = mode === 'dark' ? 'dark' : 'light';
    const defaultPanel = mode === 'dark' ? 'glass' : 'light-clean';
    const defaultSidebar = mode === 'dark' ? 'default' : 'light-white';
    setSelectedBackground(defaultBg);
    setSelectedPanelBg(defaultPanel);
    setSelectedSidebarBg(defaultSidebar);
    applyTheme(activeTheme, mode, defaultBg, defaultPanel, defaultSidebar);
  };

  const handleBackgroundChange = (backgroundId: string) => {
    setSelectedBackground(backgroundId);
    applyTheme(activeTheme, themeMode, backgroundId, selectedPanelBg, selectedSidebarBg);
  };

  const handlePanelBgChange = (panelBgId: string) => {
    setSelectedPanelBg(panelBgId);
    applyTheme(activeTheme, themeMode, selectedBackground, panelBgId, selectedSidebarBg);
  };

  const handleSidebarBgChange = (sidebarBgId: string) => {
    setSelectedSidebarBg(sidebarBgId);
    applyTheme(activeTheme, themeMode, selectedBackground, selectedPanelBg, sidebarBgId);
  };

  const saveSettings = () => {
    localStorage.setItem('theme', activeTheme);
    localStorage.setItem('themeMode', themeMode);
    localStorage.setItem('background', selectedBackground);
    localStorage.setItem('panelBackground', selectedPanelBg);
    localStorage.setItem('sidebarBackground', selectedSidebarBg);
    
    toast({
      title: "Settings Saved",
      description: "Your theme preferences have been saved successfully.",
    });
  };

  const resetToDefault = () => {
    setActiveTheme('default');
    setThemeMode('dark');
    setSelectedBackground('dark');
    setSelectedPanelBg('glass');
    setSelectedSidebarBg('default');
    applyTheme('default', 'dark', 'dark', 'glass', 'default');
    
    toast({
      title: "Reset to Default",
      description: "Theme settings have been reset to default values.",
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
                    Personalize your dashboard with custom colors and backgrounds
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="mode" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="mode">
                  <Monitor className="w-4 h-4 mr-2" />
                  Theme Mode
                </TabsTrigger>
                <TabsTrigger value="appearance">
                  <Palette className="w-4 h-4 mr-2" />
                  Colors
                </TabsTrigger>
                <TabsTrigger value="background">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Background
                </TabsTrigger>
                <TabsTrigger value="panels">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Panels
                </TabsTrigger>
                <TabsTrigger value="sidebar">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Sidebar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mode" className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Theme Mode</CardTitle>
                    <CardDescription>
                      Choose between light and dark theme modes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {themeModes.map((mode) => (
                        <div
                          key={mode.id}
                          className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            themeMode === mode.id
                              ? 'border-primary shadow-lg shadow-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleModeChange(mode.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg border shadow-inner ${
                              mode.id === 'dark' ? 'bg-slate-900' : 'bg-white'
                            }`} />
                            <div>
                              <Label className="font-medium text-base">{mode.name}</Label>
                              <p className="text-sm text-muted-foreground">{mode.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Color Themes</CardTitle>
                    <CardDescription>
                      Choose from predefined color schemes for your dashboard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {colorThemes.map((theme) => (
                        <div
                          key={theme.id}
                          className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            activeTheme === theme.id
                              ? 'border-primary shadow-lg shadow-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleThemeChange(theme.id)}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="w-6 h-6 rounded-full shadow-md"
                              style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                            />
                            <Label className="font-medium">{theme.name}</Label>
                          </div>
                          <div className="flex gap-1">
                            <div 
                              className="w-3 h-8 rounded-sm"
                              style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                            />
                            <div 
                              className="w-3 h-8 rounded-sm"
                              style={{ backgroundColor: `hsl(${theme.colors.primaryGlow})` }}
                            />
                            <div 
                              className="w-3 h-8 rounded-sm"
                              style={{ backgroundColor: `hsl(${theme.colors.success})` }}
                            />
                            <div 
                              className="w-3 h-8 rounded-sm"
                              style={{ backgroundColor: `hsl(${theme.colors.warning})` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="background" className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Background Colors</CardTitle>
                    <CardDescription>
                      Select the main background color for your {themeMode} theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {backgroundOptions[themeMode as 'dark' | 'light'].map((bg) => (
                        <div
                          key={bg.id}
                          className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            selectedBackground === bg.id
                              ? 'border-primary shadow-lg shadow-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleBackgroundChange(bg.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-lg border shadow-inner"
                              style={{ backgroundColor: `hsl(${bg.value})` }}
                            />
                            <div>
                              <Label className="font-medium text-base">{bg.name}</Label>
                              <p className="text-sm text-muted-foreground">HSL: {bg.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="panels" className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Panel Background</CardTitle>
                    <CardDescription>
                      Customize the background of cards, modals, and other panels for {themeMode} theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {panelBackgroundOptions[themeMode as 'dark' | 'light'].map((panel) => (
                        <div
                          key={panel.id}
                          className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            selectedPanelBg === panel.id
                              ? 'border-primary shadow-lg shadow-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handlePanelBgChange(panel.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-lg border shadow-inner"
                              style={{ backgroundColor: `hsl(${panel.value})` }}
                            />
                            <div>
                              <Label className="font-medium text-base">{panel.name}</Label>
                              <p className="text-sm text-muted-foreground">HSL: {panel.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sidebar" className="space-y-6">
                <Card className="card-enhanced">
                  <CardHeader>
                    <CardTitle>Sidebar Background</CardTitle>
                    <CardDescription>
                      Customize the sidebar color for {themeMode} theme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(themeMode === 'dark' ? sidebarColorOptions : sidebarLightColorOptions).map((sidebar) => (
                        <div
                          key={sidebar.id}
                          className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                            selectedSidebarBg === sidebar.id
                              ? 'border-primary shadow-lg shadow-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleSidebarBgChange(sidebar.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div 
                              className="w-12 h-12 rounded-lg border shadow-inner"
                              style={{ backgroundColor: `hsl(${sidebar.value})` }}
                            />
                            <div>
                              <Label className="font-medium text-base">{sidebar.name}</Label>
                              <p className="text-sm text-muted-foreground">HSL: {sidebar.value}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

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