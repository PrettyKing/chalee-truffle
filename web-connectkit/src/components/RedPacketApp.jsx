import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import WalletConnect from './WalletConnect';
import CreateRedPacket from './CreateRedPacket';
import RedPacketInfo from './RedPacketInfo';
import RedPacketList from './RedPacketList';
import ContractInfo from './ContractInfo';
import { useRedPacket } from '../hooks/useRedPacket';

export default function RedPacketApp() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('create');
  const redPacketData = useRedPacket();

  const tabs = [
    { id: 'create', label: '发红包', icon: '🧧' },
    { id: 'claim', label: '领红包', icon: '🎁' },
    { id: 'list', label: '红包列表', icon: '📝' },
    { id: 'contract', label: '合约信息', icon: '⚙️' },
  ];

  return (
    <div className="gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 animate-float">
            🧧 区块链红包 DApp
          </h1>
          <p className="text-white text-lg opacity-90">
            基于以太坊的去中心化红包应用
          </p>
          {redPacketData.greeting && (
            <div className="mt-4 text-white text-sm opacity-75">
              合约状态: {redPacketData.greeting}
            </div>
          )}
        </div>

        {/* 钱包连接 */}
        <WalletConnect />

        {isConnected ? (
          <div className="max-w-6xl mx-auto">
            {/* Tab 导航 */}
            <div className="flex justify-center mb-8">
              <div className="glass-card p-2">
                <div className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
                        activeTab === tab.id
                          ? 'bg-white bg-opacity-20 text-white shadow-lg'
                          : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="glass-card p-6 mb-8">
              {activeTab === 'create' && (
                <CreateRedPacket redPacketData={redPacketData} />
              )}
              
              {activeTab === 'claim' && (
                <RedPacketInfo redPacketData={redPacketData} />
              )}
              
              {activeTab === 'list' && (
                <RedPacketList redPacketData={redPacketData} />
              )}
              
              {activeTab === 'contract' && (
                <ContractInfo redPacketData={redPacketData} />
              )}
            </div>

            {/* 快速统计 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {redPacketData.packetId}
                </div>
                <div className="text-white opacity-75">总红包数</div>
              </div>
              
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {redPacketData.currentPacketCount}/10
                </div>
                <div className="text-white opacity-75">我的红包数</div>
              </div>
              
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {Number(redPacketData.contractBalance).toFixed(4)} ETH
                </div>
                <div className="text-white opacity-75">合约余额</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="glass-card p-8 inline-block">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-white text-lg">请先连接钱包开始使用</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
