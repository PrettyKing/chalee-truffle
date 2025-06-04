import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
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
  const [activeTab, setActiveTab] = useState('redpacket');
  
  const {
    redPacketInfo,
    contractBalance,
    userInfo,
    isOwner,
    packetId,
    
    // 红包功能
    createRedPacket,
    grabRedPacket,
    queryRedPacket,
    isCreating,
    isGrabbing,
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
    isTransferring,
    transferError,
    
    // 其他
    refreshData,
  } = useRedPacket();

  const tabs = [
    { id: 'redpacket', name: '🎁 红包', icon: '🎁' },
    { id: 'balance', name: '💰 余额', icon: '💰' },
    { id: 'userinfo', name: '👤 信息', icon: '👤' },
    { id: 'history', name: '📜 历史', icon: '📜' },
  ];

  if (isOwner) {
    tabs.push({ id: 'owner', name: '🏆 管理', icon: '🏆' });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500">
      <div className="container mx-auto px-4 py-8">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🧧 Chalee DApp
          </h1>
          <p className="text-white text-xl opacity-90 mb-6">
            基于以太坊的去中心化红包应用
          </p>
          
          {/* 连接按钮 */}
          <div className="flex justify-center mb-6">
            <ConnectButton />
          </div>

          {/* 连接状态信息 */}
          {isConnected && (
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 inline-block">
              <div className="flex items-center space-x-4 text-white">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span>已连接: {formatAddress(address)}</span>
                </div>
                <div className="border-l border-white border-opacity-30 pl-4">
                  <span>合约余额: {contractBalance} ETH</span>
                </div>
                <div className="border-l border-white border-opacity-30 pl-4">
                  <span>红包总数: {packetId}</span>
                </div>
                {isOwner && (
                  <div className="border-l border-white border-opacity-30 pl-4">
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold">
                      所有者
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {isConnected ? (
          <>
            {/* 导航标签 */}
            <div className="flex justify-center mb-8">
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-2">
                <div className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-purple-600 shadow-lg transform scale-105'
                          : 'text-white hover:bg-white hover:bg-opacity-20'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="max-w-6xl mx-auto">
              {activeTab === 'redpacket' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <CreateRedPacket
                    onCreateRedPacket={createRedPacket}
                    isLoading={isCreating}
                    error={createError}
                  />
                  <RedPacketInfo
                    info={redPacketInfo}
                    onGrabRedPacket={grabRedPacket}
                    onQueryRedPacket={queryRedPacket}
                    isLoading={isGrabbing}
                    error={grabError}
                    packetId={packetId}
                  />
                </div>
              )}

              {activeTab === 'balance' && (
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
              )}

              {activeTab === 'userinfo' && (
                <UserInfoManager
                  userInfo={userInfo}
                  onSetUserInfo={setUserInfo}
                  isLoading={isSettingInfo}
                  error={setInfoError}
                />
              )}

              {activeTab === 'history' && (
                <PacketHistory />
              )}

              {activeTab === 'owner' && isOwner && (
                <OwnerPanel
                  onTransferToOwner={transferToOwner}
                  isTransferring={isTransferring}
                  transferError={transferError}
                  contractBalance={contractBalance}
                  onRefresh={refreshData}
                />
              )}
            </div>
          </>
        ) : (
          /* 未连接状态 */
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-12 inline-block">
              <div className="text-8xl mb-6">🔗</div>
              <h2 className="text-white text-2xl font-bold mb-4">
                连接钱包开始使用
              </h2>
              <p className="text-white text-lg opacity-80 mb-6">
                请连接您的 Web3 钱包来使用红包功能
              </p>
              <div className="space-y-2 text-white text-sm opacity-70">
                <p>✨ 创建和领取红包</p>
                <p>💰 管理您的ETH余额</p>
                <p>👤 设置个人信息</p>
                <p>📜 查看红包历史</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}