import { EventEmitter } from 'eventemitter3';
import React from 'react';
import { PluginManifest, PluginContext } from '../types';

export abstract class BasePlugin extends EventEmitter {
  protected context!: PluginContext;
  private manifest: PluginManifest;

  protected constructor(manifest: PluginManifest) {
    super();
    this.manifest = manifest;
  }

  getManifest(): PluginManifest {
    return this.manifest;
  }
  
  abstract render(): React.ReactNode;

  async initialize(context: PluginContext): Promise<void> {
    this.context = context;
    await this.onInitialize();
  }

  async cleanup(): Promise<void> {
    await this.onCleanup();
  }

  protected async onInitialize(): Promise<void> {
    // Override this method to add initialization logic
  }

  protected async onCleanup(): Promise<void> {
    // Override this method to add cleanup logic
  }

  protected showNotification(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
    if (this.context?.notifications) {
      this.context.notifications.show(message, type);
    }
  }
} 