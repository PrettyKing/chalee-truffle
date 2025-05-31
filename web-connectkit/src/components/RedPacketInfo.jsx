import React, { useState } from 'react';
import { formatEther } from 'viem';

export default function RedPacketInfo({ redPacketData }) {
  const [packetId, setPacketId] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  const handleCheckPacket = () => {
    if (!packetId || isNaN(packetId)) {
      alert('请输入有效的红包ID');
      return;
    }
    
    const id = parseInt(packetId);
    if (id >= redPacketData.packetId) {
      alert('红包ID不存在');
      return;
    }
    
    redPacketData.setCurrentPacketId(id);
    setShowInfo(true);
  };

  const handleClaimPacket = () => {
    if (packetId) {
      redPacketData.grabRedPacket(parseInt(packetId));
    }
  };

  const packetInfo = redPacketData.packetInfo;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">领红包</h2>
        <p className="text-white opacity-75">
          输入红包ID领取你的红包奖励
        </p>
      </div>

      {/* 输入红包ID */}
      <div className="bg-white bg-opacity-20 rounded-xl p-6">
        <label className="block text-white text-sm font-medium mb-3">
          红包ID (0 - {redPacketData.packetId - 1})
        </label>
        <div className="flex space-x-3">
          <input
            type="number"
            min="0"
            max={redPacketData.packetId - 1}
            value={packetId}
            onChange={(e) => setPacketId(e.target.value)}
            placeholder="输入红包ID"
            className="flex-1 px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-yellow-400"
          />
          <button
            onClick={handleCheckPacket}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            查看
          </button>
        </div>
        {redPacketData.packetId === 0 && (
          <p className="text-white opacity-75 text-sm mt-2">
            暂无可用的红包
          </p>
        )}
      </div>

      {/* 红包信息展示 */}
      {showInfo && packetInfo && (
        <div className="bg-gradient-to-br from-red-500 to-yellow-500 rounded-xl p-6 text-white">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">🧧</div>
            <h3 className="text-xl font-bold">红包 #{packetId}</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {packetInfo[0] ? '💰' : '🎲'}
              </div>
              <div className="text-sm opacity-90">
                {packetInfo[0] ? '等额红包' : '随机红包'}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                {Number(packetInfo[2])}/{Number(packetInfo[1])}
              </div>
              <div className="text-sm opacity-90">剩余/总数</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatEther(packetInfo[3])} ETH
              </div>
              <div className="text-sm opacity-90">总金额</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatEther(packetInfo[4])} ETH
              </div>
              <div className="text-sm opacity-90">剩余金额</div>
            </div>
          </div>

          {/* 领取状态 */}
          <div className="text-center mb-4">
            {packetInfo[5] ? (
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-lg">✅ 您已领取过此红包</div>
              </div>
            ) : Number(packetInfo[2]) === 0 ? (
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <div className="text-lg">😔 红包已被抢完</div>
              </div>
            ) : (
              <button
                onClick={handleClaimPacket}
                disabled={redPacketData.isClaiming}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {redPacketData.isClaiming ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    领取中...
                  </div>
                ) : (
                  '🎁 领取红包'
                )}
              </button>
            )}
          </div>

          {/* 预期金额提示 */}
          {!packetInfo[5] && Number(packetInfo[2]) > 0 && (
            <div className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
              <div className="text-sm opacity-90">
                {packetInfo[0] ? (
                  `每个红包金额: ${formatEther(packetInfo[3] / packetInfo[1])} ETH`
                ) : (
                  `随机金额范围: 0.000001 - ${formatEther(packetInfo[4] * BigInt(2) / BigInt(Number(packetInfo[2]) + 1))} ETH`
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 快速领取区域 */}
      {redPacketData.packetId > 0 && (
        <div className="bg-white bg-opacity-20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">🚀 快速领取</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: Math.min(8, redPacketData.packetId) }, (_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPacketId(i.toString());
                  redPacketData.setCurrentPacketId(i);
                  setShowInfo(true);
                }}
                className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-all"
              >
                红包 #{i}
              </button>
            ))}
          </div>
          {redPacketData.packetId > 8 && (
            <p className="text-white opacity-75 text-sm mt-3 text-center">
              还有 {redPacketData.packetId - 8} 个红包...
            </p>
          )}
        </div>
      )}

      {/* 提示信息 */}
      <div className="bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4">
        <div className="text-green-200 text-sm space-y-1">
          <div>💡 <strong>使用说明:</strong></div>
          <div>• 输入红包ID查看详细信息</div>
          <div>• 每个地址只能领取一次相同的红包</div>
          <div>• 等额红包：固定金额分配</div>
          <div>• 随机红包：使用公平算法随机分配金额</div>
          <div>• 领取的ETH会直接转入您的钱包</div>
        </div>
      </div>
    </div>
  );
}
