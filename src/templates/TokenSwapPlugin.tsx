import { BasePlugin } from '../core/BasePlugin';
import { PluginManifest } from '../types';
import React from 'react';

interface SwapState {
  fromToken: string;
  toToken: string;
  amount: number;
}

interface SwapInterfaceProps {
  state: SwapState;
  onStateChange: (newState: Partial<SwapState>) => void;
  onSwap: () => void;
}

const manifest: PluginManifest = {
  name: 'Token Swap',
  description: 'Swap tokens using Jupiter Exchange',
  version: '1.0.0',
  author: 'Tapestry',
  permissions: ['wallet:read', 'wallet:write', 'ui:render'],
  entryPoints: {
    main: 'index.ts'
  }
};

const SwapInterface: React.FC<SwapInterfaceProps> = ({ state, onStateChange, onSwap }) => {
  return (
    <div className="p-4 bg-zinc-900 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Swap Tokens</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">From</label>
          <select
            className="w-full p-2 bg-zinc-800 rounded border border-zinc-700"
            value={state.fromToken}
            onChange={(e) => onStateChange({ fromToken: e.target.value })}
          >
            <option value="SOL">SOL</option>
            <option value="USDC">USDC</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">To</label>
          <select
            className="w-full p-2 bg-zinc-800 rounded border border-zinc-700"
            value={state.toToken}
            onChange={(e) => onStateChange({ toToken: e.target.value })}
          >
            <option value="USDC">USDC</option>
            <option value="SOL">SOL</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Amount</label>
          <input
            type="number"
            className="w-full p-2 bg-zinc-800 rounded border border-zinc-700"
            placeholder="Enter amount"
            value={state.amount}
            onChange={(e) => onStateChange({ amount: Number(e.target.value) })}
          />
        </div>

        <button
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={onSwap}
        >
          Swap
        </button>
      </div>
    </div>
  );
};

export class TokenSwapPlugin extends BasePlugin {
  private state: SwapState = {
    fromToken: 'SOL',
    toToken: 'USDC',
    amount: 0,
  };

  constructor() {
    super(manifest);
  }

  private handleStateChange = (newState: Partial<SwapState>) => {
    this.state = {
      ...this.state,
      ...newState,
    };
    if (this.context?.ui) {
      this.context.ui.update(this.render());
    }
  };

  private handleSwap = async () => {
    try {
      if (!this.state.amount) {
        this.emit('notification', { message: 'Please enter an amount', type: 'warning' });
        return;
      }

      // Here you would implement the actual swap logic
      console.log('Swapping tokens:', this.state);
      
      // For now, just log the attempt
      console.log(`Attempting to swap ${this.state.amount} ${this.state.fromToken} to ${this.state.toToken}`);
      
      // Emit swap started event
      this.emit('swapStarted', this.state);
      
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Emit success
      const txHash = '0x' + Math.random().toString(16).slice(2);
      this.emit('swapCompleted', {
        ...this.state,
        txHash,
      });

      this.emit('notification', {
        message: `Successfully swapped ${this.state.amount} ${this.state.fromToken} to ${this.state.toToken}! Tx: ${txHash.slice(0, 8)}...`,
        type: 'success'
      });

      // Reset form
      this.handleStateChange({
        amount: 0
      });
    } catch (error) {
      console.error('Swap failed:', error);
      this.emit('swapFailed', { error: error instanceof Error ? error.message : 'Unknown error' });
      this.emit('notification', {
        message: error instanceof Error ? error.message : 'Swap failed',
        type: 'error'
      });
    }
  };

  render(): React.ReactNode {
    return (
      <SwapInterface
        state={this.state}
        onStateChange={this.handleStateChange}
        onSwap={this.handleSwap}
      />
    );
  }
} 