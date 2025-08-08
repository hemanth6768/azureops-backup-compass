import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogManagementOverview from "@/components/LogManagementOverview";
import LogManagementFilesTable from "@/components/LogManagementFilesTable";

const LogManagementTabs: React.FC = () => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <LogManagementOverview />
      </TabsContent>

      <TabsContent value="files">
        <LogManagementFilesTable />
      </TabsContent>
    </Tabs>
  );
};

export default LogManagementTabs;
