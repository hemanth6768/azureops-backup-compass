const API_BASE_URL = 'http://localhost:33411';

export interface RecoveryVault {
  name: string;
  resourceGroupName: string;
  location: string;
  subscriptionName: string;
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
  async getRecoveryVaults(): Promise<RecoveryVault[]> {
    const response = await fetch(`${API_BASE_URL}/api/monitoring/recoveryvaults`);
    if (!response.ok) {
      throw new Error('Failed to fetch recovery vaults');
    }
    return response.json();
  },

  async getBackupItems(): Promise<BackupItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/monitoring/backupitems`);
    if (!response.ok) {
      throw new Error('Failed to fetch backup items');
    }
    return response.json();
  },

  async getBackupItemsBySubscription(subscriptionName: string): Promise<BackupItem[]> {
    const response = await fetch(`${API_BASE_URL}/api/monitoring/backupitems/by-subscription/${encodeURIComponent(subscriptionName)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch backup items for subscription: ${subscriptionName}`);
    }
    return response.json();
  },

  async getDistinctSubscriptions(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/monitoring/backupitems/subscriptions`);
    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }
    return response.json();
  },
};