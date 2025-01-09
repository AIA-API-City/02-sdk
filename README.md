# Tapestry Plugin SDK

A powerful SDK for building plugins for the Tapestry Chat platform. Create interactive plugins that can integrate with Solana wallets, manage state, and provide rich user interfaces.

## Features

- 🔒 Secure wallet integration
- 💾 Persistent storage
- 🎨 React-based UI components
- 📨 Message handling
- 🔔 Notification system
- ⚙️ Settings management

## Installation

```bash
npm install @tapestry/plugin-sdk
# or
pnpm add @tapestry/plugin-sdk
```

## Quick Start

1. Create a new plugin by extending the BasePlugin class:

```typescript
import { BasePlugin, PluginManifest } from '@tapestry/plugin-sdk';

const manifest: PluginManifest = {
  name: 'My Plugin',
  version: '1.0.0',
  description: 'A simple plugin',
  author: 'Your Name',
  permissions: ['wallet:read', 'ui:render'],
  entryPoints: {
    main: 'index.ts'
  }
};

export class MyPlugin extends BasePlugin {
  constructor() {
    super(manifest);
  }

  protected async onInitialize(): Promise<void> {
    // Initialize your plugin
    this.showNotification('Plugin initialized!');
  }

  protected async onCleanup(): Promise<void> {
    // Cleanup when plugin is disabled
  }
}
```

2. Use the provided APIs:

```typescript
// Wallet operations
const address = await this.wallet.getAddress();
const signature = await this.wallet.signMessage('Hello');

// Storage operations
await this.storage.set('myKey', { value: 123 });
const data = await this.storage.get('myKey');

// UI rendering
this.ui.render(
  <div className="p-4">
    <h1>My Plugin UI</h1>
    <button onClick={() => this.showNotification('Clicked!')}>
      Click me
    </button>
  </div>
);

// Notifications
this.showNotification('Operation successful!', 'success');
```

## Plugin Manifest

The manifest defines your plugin's metadata and required permissions:

```typescript
interface PluginManifest {
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
```

Available permissions:
- `wallet:read` - Read wallet address and public data
- `wallet:write` - Sign messages and send transactions
- `storage:read` - Read from plugin storage
- `storage:write` - Write to plugin storage
- `ui:render` - Render UI components
- `notifications:create` - Show notifications

## Best Practices

1. **Error Handling**
```typescript
try {
  await this.wallet.sendTransaction(tx);
  this.showNotification('Success!', 'success');
} catch (error) {
  this.showNotification(error.message, 'error');
}
```

2. **State Management**
```typescript
// Save state on changes
private async saveState(): Promise<void> {
  await this.storage.set('pluginState', this.state);
}

// Load state on initialization
protected async onInitialize(): Promise<void> {
  this.state = await this.storage.get('pluginState') || defaultState;
}
```

3. **UI Updates**
```typescript
// Update UI when state changes
private updateUI(): void {
  this.ui.update(
    <MyComponent 
      data={this.state}
      onAction={this.handleAction}
    />
  );
}
```

## Examples

Check out our example plugins:
- [Token Swap Plugin](./src/templates/TokenSwapPlugin.ts)
- More examples coming soon...

## Development

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Build the SDK:
```bash
pnpm build
```

4. Run tests:
```bash
pnpm test
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details 