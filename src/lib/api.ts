const API_BASE_URL = 'http://localhost:33411';

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

export const api = {
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

  async getVaultCount(subscriptionName?: string): Promise<{ TotalVaults: number }> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/vaultcount?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/vaultcount`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch vault count');
    }
    return response.json();
  },

  async getActiveVMsCount(subscriptionName?: string): Promise<{ ActiveVMs: number }> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/activevms?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/activevms`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch active VMs count');
    }
    return response.json();
  },

  async getHealthyBackupPercentage(subscriptionName?: string): Promise<{ HealthyBackupPercentage: string }> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/healthybackups?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/healthybackups`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch healthy backup percentage');
    }
    return response.json();
  },

  async getInactiveVMsCount(subscriptionName?: string): Promise<{ InactiveVMs: number }> {
    const url = subscriptionName 
      ? `${API_BASE_URL}/api/monitoring/inactivevms?subscriptionName=${encodeURIComponent(subscriptionName)}`
      : `${API_BASE_URL}/api/monitoring/inactivevms`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch inactive VMs count');
    }
    return response.json();
  },

  async getInactiveVMDetails(): Promise<BackupItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/Monitoring/inactivevm/details`);
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
};