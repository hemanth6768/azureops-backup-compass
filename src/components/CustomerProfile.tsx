import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Users, Database, Server, HardDrive, Clock } from "lucide-react";

const CustomerProfile: React.FC = () => {
  // Dummy data based on user requirements
  const customerData = {
    clientId: 154,
    clientName: "Finmark",
    userCount: 5,
    timestamp: "2025-09-17T14:00:26",
    users: ["frank", "mike", "sarah", "john", "alice"],
    services: [
      { name: "RFMS-B2B-154", status: "running" },
      { name: "RFMS-DATAendpoint-154", status: "running" },
      { name: "rfms-gateway-service-154", status: "running" }
    ],
    folderSize: "10GB",
    rdServer: "rfms-host-rd-10",
    sqlServer: "rfms-host-sql-10",
    database: "154",
    databaseSize: "2.5GB"
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client ID</p>
              <p className="text-lg font-semibold">{customerData.clientId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client Name</p>
              <p className="text-lg font-semibold">{customerData.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">User Count</p>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <p className="text-lg font-semibold cursor-pointer hover:text-primary">
                    {customerData.userCount} users
                  </p>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Active Users</h4>
                    <div className="flex flex-wrap gap-1">
                      {customerData.users.map((user, index) => (
                        <Badge key={index} variant="secondary">
                          {user}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Last Updated
              </p>
              <p className="text-sm">{new Date(customerData.timestamp).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customerData.services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{service.name}</span>
                <Badge variant={service.status === "running" ? "default" : "destructive"}>
                  {service.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Infrastructure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">RD Server</span>
                <span className="font-semibold">{customerData.rdServer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">SQL Server</span>
                <span className="font-semibold">{customerData.sqlServer}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Database</span>
                <span className="font-semibold">{customerData.database}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <HardDrive className="h-4 w-4" />
                  Folder Size
                </span>
                <span className="font-semibold">{customerData.folderSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Database className="h-4 w-4" />
                  Database Size
                </span>
                <span className="font-semibold">{customerData.databaseSize}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerProfile;