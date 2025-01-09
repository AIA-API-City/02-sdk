import { BasePlugin } from '../core/BasePlugin';
import { PluginManifest, PluginContext } from '../types';

const mockManifest: PluginManifest = {
  name: 'Test Plugin',
  version: '1.0.0',
  description: 'A test plugin',
  author: 'Test Author',
  permissions: ['wallet:read', 'ui:render'],
  entryPoints: {
    main: 'index.ts'
  }
};

const mockContext: PluginContext = {
  wallet: {
    getAddress: jest.fn().mockResolvedValue('test-address'),
    signMessage: jest.fn().mockResolvedValue('test-signature'),
    sendTransaction: jest.fn().mockResolvedValue('tx-hash')
  },
  storage: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
    remove: jest.fn().mockResolvedValue(undefined)
  },
  ui: {
    render: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  },
  notifications: {
    show: jest.fn()
  }
};

class TestPlugin extends BasePlugin {
  constructor() {
    super(mockManifest);
  }

  protected async onInitialize(): Promise<void> {
    // Test initialization
  }

  protected async onCleanup(): Promise<void> {
    // Test cleanup
  }
}

describe('BasePlugin', () => {
  let plugin: TestPlugin;

  beforeEach(() => {
    plugin = new TestPlugin();
  });

  it('should initialize with correct manifest', () => {
    expect(plugin['manifest']).toEqual(mockManifest);
  });

  it('should initialize context correctly', async () => {
    await plugin.initialize(mockContext);
    
    expect(plugin['wallet']).toBeDefined();
    expect(plugin['storage']).toBeDefined();
    expect(plugin['ui']).toBeDefined();
    expect(plugin['notifications']).toBeDefined();
  });

  it('should handle wallet operations', async () => {
    await plugin.initialize(mockContext);
    
    const address = await plugin['getWalletAddress']();
    expect(address).toBe('test-address');
    expect(mockContext.wallet.getAddress).toHaveBeenCalled();

    const signature = await plugin['signMessage']('test');
    expect(signature).toBe('test-signature');
    expect(mockContext.wallet.signMessage).toHaveBeenCalledWith('test');
  });

  it('should handle notifications', async () => {
    await plugin.initialize(mockContext);
    
    plugin['showNotification']('test message', 'success');
    expect(mockContext.notifications.show).toHaveBeenCalledWith('test message', 'success');
  });

  it('should handle storage operations', async () => {
    await plugin.initialize(mockContext);
    
    await plugin['setData']('test-key', { value: 'test' });
    expect(mockContext.storage.set).toHaveBeenCalledWith('test-key', { value: 'test' });

    await plugin['getData']('test-key');
    expect(mockContext.storage.get).toHaveBeenCalledWith('test-key');
  });

  it('should cleanup properly', async () => {
    await plugin.initialize(mockContext);
    await plugin.cleanup();
    
    expect(mockContext.ui.remove).toHaveBeenCalled();
  });
}); 