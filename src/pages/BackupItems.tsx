import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useState, useEffect } from "react";
import { api, BackupItem } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Search, Database, Download, Cloud } from "lucide-react";
import { format } from "date-fns";
import BackButton from "@/components/BackButton";

const BackupItems = () => {
  const [backupItems, setBackupItems] = useState<BackupItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<BackupItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterData();
  }, [backupItems, selectedSubscription, searchTerm]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subscriptionsData, backupItemsData] = await Promise.all([
        api.getDistinctSubscriptions(),
        api.getBackupItems(),
      ]);

      setSubscriptions(subscriptionsData);
      setBackupItems(backupItemsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load data";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadBackupItemsBySubscription = async (subscription: string) => {
    if (subscription === "all") {
      const data = await api.getBackupItems();
      setBackupItems(data);
    } else {
      const data = await api.getBackupItemsBySubscription(subscription);
      setBackupItems(data);
    }
  };

  const handleSubscriptionChange = async (subscription: string) => {
    setSelectedSubscription(subscription);
    setIsLoading(true);
    try {
      await loadBackupItemsBySubscription(subscription);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load backup items";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...backupItems];

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.vmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.vaultName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.resourceGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.policyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "inprogress":
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health.toLowerCase()) {
      case "healthy":
      case "passed":
        return <Badge variant="success">Healthy</Badge>;
      case "warning":
        return <Badge variant="secondary">Warning</Badge>;
      case "critical":
      case "failed":
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">{health}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  const exportToCSV = () => {
    const headers = [
      "VM Name",
      "Vault Name",
      "Resource Group",
      "Subscription",
      "Backup Pre-Check",
      "Last Backup Status",
      "Latest Restore Point",
      "Policy Name",
      "Policy Sub Type",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredItems.map((item) =>
        [
          item.vmName,
          item.vaultName,
          item.resourceGroup,
          item.subscriptionName,
          item.backupPreCheck,
          item.lastBackupStatus,
          item.latestRestorePoint,
          item.policyName,
          item.policySubType,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup-items.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <>
      {" "}
      {/* Header with sidebar trigger */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Backup Items</h1>
            <p className="text-xs text-muted-foreground">
              Azure VM backup items management
            </p>
          </div>
        </div>
        <div className="ml-auto">
          <BackButton to="/" label="Back to Dashboard" />
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Backup Items</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Monitor all Azure VM backup items across subscriptions
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
            <CardDescription>
              Filter backup items by subscription and search
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Subscription
                </label>
                <Select
                  value={selectedSubscription}
                  onValueChange={handleSubscriptionChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscriptions</SelectItem>
                    {subscriptions.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by VM name, vault, resource group..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <Button
                  onClick={loadData}
                  disabled={isLoading}
                  variant="outline"
                  className="h-10"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${
                      isLoading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>

                <Button
                  onClick={exportToCSV}
                  disabled={filteredItems.length === 0}
                  variant="outline"
                  className="h-10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Items ({filteredItems.length})</CardTitle>
            <CardDescription>
              {selectedSubscription === "all"
                ? "Showing all backup items across subscriptions"
                : `Showing backup items for ${selectedSubscription}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading backup items...</span>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No backup items found matching your criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>VM Name</TableHead>
                      <TableHead>Vault Name</TableHead>
                      <TableHead>Resource Group</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Backup Health</TableHead>
                      <TableHead>Last Backup Status</TableHead>
                      <TableHead>Latest Restore Point</TableHead>
                      <TableHead>Policy Name</TableHead>
                      <TableHead>Policy Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-muted-foreground font-bold">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.vmName}
                        </TableCell>
                        <TableCell>{item.vaultName}</TableCell>
                        <TableCell>{item.resourceGroup}</TableCell>
                        <TableCell>{item.subscriptionName}</TableCell>
                        <TableCell>
                          {getHealthBadge(item.backupPreCheck)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(item.lastBackupStatus)}
                        </TableCell>
                        <TableCell>
                          {formatDate(item.latestRestorePoint)}
                        </TableCell>
                        <TableCell>{item.policyName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.policySubType}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
};

export default BackupItems;
