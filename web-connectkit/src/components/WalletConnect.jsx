import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function WalletConnect() {
  return (
    <div className="flex justify-center mb-8">
      <div className="glass-card p-4">
        <ConnectButton />
      </div>
    </div>
  );
}
