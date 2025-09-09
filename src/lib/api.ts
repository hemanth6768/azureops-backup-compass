const API_BASE_URL = 'http://localhost:33411';

// Stats interfaces
interface VaultCountResponse {
  totalVaults?: number;
  vaultCount?: number;
  TotalVaults?: number;
}

interface ActiveVMsResponse {
  activeVMs?: number;
  activeVms?: number;
  ActiveVMs?: number;
}

interface HealthyBackupResponse {
  healthyBackupPercentage?: string;
  healthyBackups?: string;
  HealthyBackupPercentage?: string;
}

interface InactiveVMsResponse {
  inactiveVMs?: number;
  inactiveVms?: number;
  InactiveVMs?: number;
}

export interface RecoveryVault {
  vaultName: string;
  resourceGroupName: string;
  location: string;
  subscriptionName: string;
}

export interface DashboardStats {
  totalVaults: number;
  activeVMs: number;
  healthyBackupPercentage: string;
  inactiveVMs: number;
}

export interface BackupItem {
  subscriptionName: string;
  vaultName: string;
  resourceGroup: string;
  vmName: string;
  backupPreCheck: string;
  lastBackupStatus: string;
  latestRestorePoint: string;
  policyName: string;
  policySubType: string;
}

export interface VMUsage {
  computer: string;
  maxCPUUsage: number;
  subscriptionName: string;
  timeGenerated: string;
}

export interface LargeLogFile {
  serverName: string;
  databaseName: string;
  fileName: string;
  physicalPath: string;
  fileType: string;
  totalSize: string;
  usedSpace: string;
  freeSpace: string;
  collectedAt: string;
}

export interface SqlServerHost {
  serverName: string;
  ip: string;
  tag: string;
}

export interface DatabaseSize {
  databaseName: string;
  size: string;
}

export interface QueryAnalysisRecord {
  "dd hh:mm:ss.mss": string;
  session_id: number;
  sql_text: string;
  sql_command: any;
  login_name: string;
  wait_info: any;
  tran_log_writes: any;
  CPU: any;
  tempdb_allocations: string;
  tempdb_current: string;
  blocking_session_id: any;
  reads: any;
  writes: any;
  physical_reads: any;
  query_plan: any;
  used_memory: string;
  status: string;
  tran_start_time: any;
  implicit_tran: any;
  open_tran_count: string;
  percent_complete: any;
  host_name: string;
  database_name: string;
  program_name: string;
  start_time: string;
  login_time: string;
  request_id: number;
  collection_time: string;
}

export interface QueryAnalysisResponse {
  server: string;
  records: QueryAnalysisRecord[];
}

export interface BackupRecord {
  serverName: string;
  databaseName: string;
  backupType: string;
  backupStartDate: string;
  backupFinishDate: string;
  durationMinutes: number;
  backupLocation: string;
  storageAccount: string;
  container: string;
  notes: string;
}

export interface BackupCollectionResponse {
  backups: BackupRecord[];
}

interface VaultSummaryResponse {
  totalResourceGroups: number;
  locationStats: Array<{
    location: string;
    vaultCount: number;
  }>;
}

export interface CostParallelismSetting {
  serverName: string;
  settingName: string;
  configuredValue: number;
  runningValue: number;
}

export const api = {
  async getVaultSummary(subscriptionName?: string): Promise<VaultSummaryResponse> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/Monitoring/vaultsummary?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/Monitoring/vaultsummary`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch vault summary');
    }
    return response.json();
  },

  async getRecoveryVaults(subscriptionName?: string): Promise<RecoveryVault[]> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/recoveryvaults?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/recoveryvaults`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recovery vaults');
    }
    return response.json();
  },

  async getVaultCount(subscriptionName?: string): Promise<VaultCountResponse> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/vaultcount?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/vaultcount`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch vault count');
    }
    return response.json();
  },

  async getActiveVMsCount(subscriptionName?: string): Promise<ActiveVMsResponse> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/activevms?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/activevms`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch active VMs count');
    }
    return response.json();
  },

  async getHealthyBackupPercentage(subscriptionName?: string): Promise<HealthyBackupResponse> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/healthybackups?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/healthybackups`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch healthy backup percentage');
    }
    return response.json();
  },

  async getInactiveVMsCount(subscriptionName?: string): Promise<InactiveVMsResponse> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/inactivevms?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/inactivevms`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch inactive VMs count');
    }
    return response.json();
  },

  async getInactiveVMDetails(subscriptionName?: string): Promise<BackupItem[]> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/Monitoring/inactivevm/details?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/Monitoring/inactivevm/details`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch inactive VM details');
    }
    return response.json();
  },

  async getBackupItems(): Promise<BackupItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/backup-items`);
    if (!response.ok) {
      throw new Error('Failed to fetch backup items');
    }
    return response.json();
  },

  async getBackupItemsBySubscription(subscriptionName: string): Promise<BackupItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/backup-items/subscription/${encodeURIComponent(subscriptionName)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch backup items for subscription: ${subscriptionName}`);
    }
    return response.json();
  },

  async getDistinctSubscriptions(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/backup-items/subscriptions`);
    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }
    return response.json();
  },

  async getVMUsages(): Promise<VMUsage[]> {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/VMusages`);
    if (!response.ok) {
      throw new Error('Failed to fetch VM usages');
    }
    return response.json();
  },

  async getVMUsagesBySubscription(subscriptionName: string): Promise<VMUsage[]> {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/VMusages/${encodeURIComponent(subscriptionName)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch VM usages for subscription: ${subscriptionName}`);
    }
    return response.json();
  },

  async getInactiveVMsBySubscription(subscriptionName: string) {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/inactivevm/details?subscriptionName=${encodeURIComponent(subscriptionName)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch inactive VMs for subscription: ${subscriptionName}`);
    }
    return response.json();
  },

  async getLargeLogFiles(): Promise<LargeLogFile[]> {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/large-log-files`);
    if (!response.ok) {
      throw new Error('Failed to fetch large log files');
    }
    return response.json();
  },

  async getSqlServers(): Promise<SqlServerHost[]> {
    const response = await fetch(`${API_BASE_URL}/api/Database/getallips`);
    if (!response.ok) {
      throw new Error('Failed to fetch SQL servers');
    }
    return response.json();
  },

  async getDatabaseSizes(serverName: string): Promise<DatabaseSize[]> {
    const response = await fetch(`${API_BASE_URL}/api/SQLServer/databasesizes/${encodeURIComponent(serverName)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch database sizes for server: ${serverName}`);
    }
    return response.json();
  },

  async getServerFiles(serverName: string, fileType: "log" | "row"): Promise<LargeLogFile[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/Monitoring/server/${encodeURIComponent(serverName)}?fileType=${encodeURIComponent(fileType)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch ${fileType} files for server: ${serverName}`);
    }
    return response.json();
  },

  async getQueryAnalysis(serverName: string): Promise<QueryAnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/api/Database/${encodeURIComponent(serverName)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch query analysis for server: ${serverName}`);
    }
    return response.json();
  },

  async getBackupCollection(): Promise<BackupCollectionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/BackupUpload/collect`);
    if (!response.ok) {
      throw new Error('Failed to fetch backup collection data');
    }
    return response.json();
  },

  async getCostParallelism(): Promise<CostParallelismSetting[]> {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/costParallelism`);
    if (!response.ok) {
      throw new Error('Failed to fetch cost parallelism settings');
    }
     return response.json();
  },
};