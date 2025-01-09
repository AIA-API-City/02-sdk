import { ReactNode } from 'react';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  author: string;
  permissions: PluginPermission[];
  entryPoints: {
    main: string;
    settings?: string;
    styles?: string;
  };
}

export type PluginPermission = 
  | 'wallet:read'
  | 'wallet:write'
  | 'storage:read'
  | 'storage:write'
  | 'ui:render'
  | 'notifications:create';

export interface PluginMetadata {
  id: string;
  manifest: PluginManifest;
  installDate: Date;
  enabled: boolean;
}

export interface PluginContext {
  wallet: WalletAPI;
  storage: StorageAPI;
  ui: UIAPI;
  notifications: NotificationAPI;
}

export interface WalletAPI {
  publicKey: PublicKey | null;
  connected: boolean;
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  signTransaction?: (transaction: Transaction | VersionedTransaction) => Promise<Transaction | VersionedTransaction>;
  signAllTransactions?: (transactions: (Transaction | VersionedTransaction)[]) => Promise<(Transaction | VersionedTransaction)[]>;
  sendTransaction?: (transaction: Transaction | VersionedTransaction) => Promise<string>;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  connecting: boolean;
  disconnecting: boolean;
}

export interface StorageAPI {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface UIAPI {
  render(component: ReactNode): void;
  update(component: ReactNode): void;
  remove(): void;
}

export interface NotificationAPI {
  show(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void;
}

export interface TapestryPlugin {
  initialize(context: PluginContext): Promise<void>;
  cleanup(): Promise<void>;
  onMessage?(message: string): Promise<string>;
  onSettingsChange?(settings: any): void;
} 