import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import { useRedPacket } from '../hooks/useRedPacket';
import CreateRedPacket from './CreateRedPacket';
import RedPacketInfo from './RedPacketInfo';
import UserInfoManager from './UserInfoManager';
import BalanceManager from './BalanceManager';
import OwnerPanel from './OwnerPanel';
import PacketHistory from './PacketHistory';
import { formatAddress } from '../utils/helpers';

export default function RedPacketApp() {
  const { address, isConnected } = useAccount();
  const [connectionStatus, setConnectionStatus] = useState('未连接');
  
  const {
    redPacketInfo,
    contractBalance,
    userInfo,
    isOwner,
    packetId,
    queryError,
    
    // 红包功能
    createRedPacket,
    grabRedPacket,
    queryRedPacket,
    isCreating,
    isGrabbing,
    isQueryingPacket,
    createError,
    grabError,
    
    // 余额管理
    deposit,
    withdraw,
    isDepositing,
    isWithdrawing,
    depositError,
    withdrawError,
    
    // 用户信息
    setUserInfo,
    isSettingInfo,
    setInfoError,
    
    // 所有者功能
    transferToOwner,
    resetPacketCount,
    isTransferring,
    transferError,
    
    // 其他
    refreshData,
    autoQueryLatestPacket,
  } = useRedPacket();

  // 更新连接状态
  useEffect(() => {
    if (isConnected && address) {
      setConnectionStatus('已连接');
    } else {
      setConnectionStatus('未连接');
    }
  }, [isConnected, address]);

  // 自动查询最新红包
  useEffect(() => {
    if (isConnected && packetId > 0) {
      autoQueryLatestPacket?.();
    }
  }, [isConnected, packetId, autoQueryLatestPacket]);

  return (
    <div className="container">
      {/* 头部区域 */}
      <div className="header">
        <h1>Chalee DApp</h1>
        <p className="subtitle">现代化的以太坊智能合约交互平台</p>
      </div>

      {/* 连接状态指示器 */}
      <div className="connection-status">
        <div className={`status-dot ${isConnected ? 'connected' : ''}`}></div>
        <span>{connectionStatus}</span>
      </div>

      {/* 所有者信息 */}
      {isConnected && isOwner && (
        <div className="owner-info owner-badge">
          <span>您拥有合约的完全控制权</span>
        </div>
      )}

      {/* 钱包连接卡片 */}
      <div className="card glass" style={{ marginBottom: '20px' }}>
        <h3><span className="card-icon">🔗</span>钱包连接</h3>
        <div className="input-group">
          <div className="input-row">
            <ConnectKitButton 
              theme="retro"
              showBalance={true}
              showAvatar={true}
            />
          </div>
        </div>
        
        {/* 账户信息 */}
        {isConnected && (
          <div className="account-info">
            <div>已连接账户: {formatAddress(address)}</div>
            <div className="account-address">{address}</div>
          </div>
        )}

        {/* 余额显示 */}
        {isConnected && (
          <div className="balance-display">
            <div className="balance-amount">Ξ {contractBalance}</div>
            <div className="balance-label">合约当前余额</div>
          </div>
        )}
      </div>

      {/* 功能卡片网格 */}
      {isConnected && (
        <div className="grid">
          {/* 信息管理卡片 */}
          <UserInfoManager
            userInfo={userInfo}
            onSetUserInfo={setUserInfo}
            isLoading={isSettingInfo}
            error={setInfoError}
          />

          {/* 存取款管理卡片 */}
          <BalanceManager
            balance={contractBalance}
            onDeposit={deposit}
            onWithdraw={withdraw}
            isDepositing={isDepositing}
            isWithdrawing={isWithdrawing}
            depositError={depositError}
            withdrawError={withdrawError}
            onRefresh={refreshData}
          />

          {/* 创建红包卡片 */}
          <CreateRedPacket
            onCreateRedPacket={createRedPacket}
            isLoading={isCreating}
            error={createError}
          />

          {/* 红包状态和抢红包卡片 */}
          <RedPacketInfo
            info={redPacketInfo}
            onGrabRedPacket={grabRedPacket}
            onQueryRedPacket={queryRedPacket}
            isLoading={isGrabbing || isQueryingPacket}
            error={grabError || queryError}
            packetId={packetId}
          />

          {/* 红包历史记录卡片 */}
          <PacketHistory 
            onQueryRedPacket={queryRedPacket}
            onGrabRedPacket={grabRedPacket}
          />

          {/* 所有者操作卡片 */}
          {isOwner && (
            <OwnerPanel
              onTransferToOwner={transferToOwner}
              onResetPacketCount={resetPacketCount}
              isTransferring={isTransferring}
              transferError={transferError}
              contractBalance={contractBalance}
              onRefresh={refreshData}
            />
          )}
        </div>
      )}

      {/* 未连接状态 */}
      {!isConnected && (
        <div className="grid">
          <div className="card glass">
            <h3><span className="card-icon">🔗</span>开始使用</h3>
            <div className="input-group">
              <p style={{ marginBottom: '20px', opacity: '0.9' }}>
                请先连接您的 Web3 钱包来使用红包功能
              </p>
              <div style={{ textAlign: 'center' }}>
                <ConnectKitButton 
                  theme="retro"
                  showBalance={false}
                  showAvatar={false}
                />
              </div>
            </div>
            <div style={{ marginTop: '20px', fontSize: '0.9rem', opacity: '0.8' }}>
              <div style={{ marginBottom: '10px' }}>✨ 创建和领取红包</div>
              <div style={{ marginBottom: '10px' }}>💰 管理您的ETH余额</div>
              <div style={{ marginBottom: '10px' }}>👤 设置个人信息</div>
              <div style={{ marginBottom: '10px' }}>📜 查看红包历史</div>
              <div>🔍 使用 ConnectKit 的现代化UI</div>
            </div>
          </div>
        </div>
      )}

      <div className="footer-space"></div>
    </div>
  );
}