import { BarChart3, Database, Cloud, Cpu } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';

const items = [
  { title: 'Dashboard', url: '/', icon: BarChart3 },
  { title: 'Recovery Vaults', url: '/recovery-vaults', icon: Database },
  { title: 'Backup Items', url: '/backup-items', icon: Cloud },
  { title: 'Azure VM CPU Usage', url: '/vm-cpu-usage', icon: Cpu },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = items.some((i) => isActive(i.url));

  return (
    <Sidebar 
      className={`sidebar-enhanced transition-all duration-300 ${
        state === 'collapsed' ? 'w-16' : 'w-64'
      }`} 
      collapsible="icon"
    >
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 text-sm font-semibold text-sidebar-foreground/80 tracking-wider uppercase">
            {state === 'collapsed' ? 'AOM' : 'AzureOps Monitor'}
          </SidebarGroupLabel>
          <SidebarGroupContent className="mt-2">
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    className={`sidebar-nav-item ${
                      isActive(item.url) ? 'active' : ''
                    } group px-4 py-3 text-sm font-medium`}
                  >
                    <NavLink 
                      to={item.url} 
                      end
                      className="flex items-center gap-3 w-full transition-colors duration-200"
                    >
                      <item.icon className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                        isActive(item.url) 
                          ? 'text-primary-foreground' 
                          : 'text-sidebar-foreground group-hover:text-primary'
                      }`} />
                      {state !== 'collapsed' && (
                        <span className={`transition-colors duration-200 ${
                          isActive(item.url) 
                            ? 'text-primary-foreground font-semibold' 
                            : 'text-sidebar-foreground group-hover:text-primary'
                        }`}>
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Modern footer branding */}
        {state !== 'collapsed' && (
          <div className="mt-auto p-4 border-t border-sidebar-border/50">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>Azure Operations Center</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}