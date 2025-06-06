import { useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { formatAddress } from '../utils/helpers';

export default function WalletConnect() {
  const [walletMode, setWalletMode] = useState('connectkit'); // 'connectkit' or 'rainbowkit'
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleModeSwitch = () => {
    // 如果当前已连接，先断开连接
    if (isConnected) {
      disconnect();
    }
    setWalletMode(prev => prev === 'connectkit' ? 'rainbowkit' : 'connectkit');
  };

  return (
    <div className="wallet-connect-container">
      {/* 钱包模式切换 */}
      <div className="wallet-mode-switcher">
        <div className="mode-selector">
          <button
            className={`mode-btn ${walletMode === 'connectkit' ? 'active' : ''}`}
            onClick={() => walletMode !== 'connectkit' && handleModeSwitch()}
          >
            <span className="mode-icon">🔗</span>
            ConnectKit
          </button>
          <button
            className={`mode-btn ${walletMode === 'rainbowkit' ? 'active' : ''}`}
            onClick={() => walletMode !== 'rainbowkit' && handleModeSwitch()}
          >
            <span className="mode-icon">🌈</span>
            RainbowKit
          </button>
        </div>
        <div className="mode-indicator">
          <span className="indicator-text">
            当前使用: {walletMode === 'connectkit' ? 'ConnectKit' : 'RainbowKit'}
          </span>
        </div>
      </div>

      {/* 钱包连接按钮区域 */}
      <div className="wallet-buttons-area">
        {walletMode === 'connectkit' ? (
          <div className="connectkit-section">
            <div className="wallet-provider-label">
              <span className="provider-icon">🔗</span>
              <span>ConnectKit 钱包连接</span>
            </div>
            <ConnectKitButton 
              theme="auto"
              showBalance={true}
              showAvatar={true}
              mode="light"
            />
            {isConnected && (
              <div className="connection-details">
                <div className="connection-info">
                  <span className="status-indicator connected"></span>
                  <span>已通过 ConnectKit 连接</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rainbowkit-section">
            <div className="wallet-provider-label">
              <span className="provider-icon">🌈</span>
              <span>RainbowKit 钱包连接</span>
            </div>
            <ConnectButton 
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              chainStatus="full"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
            {isConnected && (
              <div className="connection-details">
                <div className="connection-info">
                  <span className="status-indicator connected"></span>
                  <span>已通过 RainbowKit 连接</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 连接状态详情 */}
      {isConnected && (
        <div className="wallet-status-details">
          <div className="status-card glass">
            <div className="status-header">
              <span className="status-title">钱包状态</span>
              <span className="status-badge connected">已连接</span>
            </div>
            <div className="status-info">
              <div className="info-row">
                <span className="info-label">钱包地址:</span>
                <span className="info-value">
                  <span className="address-short">{formatAddress(address)}</span>
                  <span className="address-full">{address}</span>
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">连接方式:</span>
                <span className="info-value">
                  {walletMode === 'connectkit' ? 'ConnectKit' : 'RainbowKit'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 功能介绍 */}
      {!isConnected && (
        <div className="wallet-features">
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🔗</span>
              <div className="feature-content">
                <h4>ConnectKit</h4>
                <p>简洁现代的钱包连接体验</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌈</span>
              <div className="feature-content">
                <h4>RainbowKit</h4>
                <p>丰富多彩的钱包选择界面</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <div className="feature-content">
                <h4>快速切换</h4>
                <p>在两种UI风格间自由切换</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔐</span>
              <div className="feature-content">
                <h4>安全可靠</h4>
                <p>支持主流钱包，安全连接</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}