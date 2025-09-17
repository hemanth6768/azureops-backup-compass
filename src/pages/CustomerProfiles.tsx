import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import CustomerProfile from "@/components/CustomerProfile";
import { Database, Users } from "lucide-react";
import { useEffect } from "react";

const CustomerProfiles = () => {
  useEffect(() => {
    document.title = "Customer Profiles | AzureOps";
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with sidebar trigger */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Customer Profiles</h1>
              <p className="text-xs text-muted-foreground">Manage customer information</p>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">
              Customer Profiles
            </h1>
            <p className="text-muted-foreground mt-2">
              View and manage customer profile information and services
            </p>
          </div>

          <CustomerProfile />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CustomerProfiles;