import { useState, useEffect } from 'react';
import { useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/ChaleeDApp';
import { formatEth, calculateProgress, formatPacketStatus, debugLog } from '../utils/helpers';

export default function PacketHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPacket, setSelectedPacket] = useState(null);

  // 获取最新红包ID
  const { data: packetId } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'packetId',
  });

  const loadHistory = async () => {
    if (!packetId || Number(packetId) === 0) {
      setHistoryData([]);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const history = [];
      const latestId = Number(packetId);
      const maxHistory = Math.min(latestId, 10); // 最多显示10个红包

      debugLog('加载红包历史', { latestId, maxHistory });

      // 模拟加载历史数据
      // 在实际应用中，这里应该调用合约的 getPacketInfo 方法
      for (let i = latestId - 1; i >= Math.max(0, latestId - maxHistory); i--) {
        // 这里应该是实际的合约调用
        // const packetInfo = await contract.getPacketInfo(i);
        
        // 模拟数据 - 在实际应用中替换为真实合约调用
        const totalCount = Math.floor(Math.random() * 10) + 1;
        const remainingCount = Math.floor(Math.random() * totalCount);
        const totalAmount = Math.random() * 0.1 + 0.01;
        const remainingAmount = (remainingCount / totalCount) * totalAmount;
        
        const mockData = {
          id: i,
          isEqual: Math.random() > 0.5,
          count: totalCount,
          remainingCount: remainingCount,
          amount: formatEth(BigInt(Math.floor(totalAmount * 1e18))),
          remainingAmount: formatEth(BigInt(Math.floor(remainingAmount * 1e18))),
          hasClaimed: Math.random() > 0.7,
          timestamp: Date.now() - (latestId - i) * 3600000, // 模拟时间戳
        };

        history.push(mockData);
      }

      setHistoryData(history);
      debugLog('红包历史加载完成', { count: history.length });
    } catch (err) {
      const errorMsg = '加载历史记录失败: ' + err.message;
      setError(errorMsg);
      debugLog('加载历史记录失败', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (packetId) {
      loadHistory();
    }
  }, [packetId]);

  const handlePacketClick = (packet) => {
    setSelectedPacket(packet);
    debugLog('查看红包详情', packet);
  };

  const handleClaimPacket = (packetId) => {
    debugLog('尝试抢红包', { packetId });
    // 这里应该调用父组件的抢红包函数
    console.log('抢红包功能需要在父组件中实现', packetId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">📜</div>
        <h2 className="text-3xl font-bold text-white mb-2">红包历史</h2>
        <p className="text-white opacity-80">查看最近的红包记录</p>
      </div>

      {/* 刷新按钮 */}
      <div className="text-center mb-6">
        <button
          onClick={loadHistory}
          disabled={isLoading}
          className="btn-enhanced btn-primary"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="loading-spinner"></div>
              <span>加载中...</span>
            </div>
          ) : (
            <>
              🔄 刷新历史记录
            </>
          )}
        </button>
      </div>

      {/* 历史记录列表 */}
      {error ? (
        <div className="status-message status-error text-center p-6">
          <div className="text-red-200 mb-2">❌ {error}</div>
          <button
            onClick={loadHistory}
            className="btn-enhanced btn-danger mt-2"
          >
            重试
          </button>
        </div>
      ) : historyData.length > 0 ? (
        <div className="history-container">
          <div className="history-list">
            {historyData.map((packet) => {
              const packetStatus = formatPacketStatus(packet.remainingCount, packet.hasClaimed);
              const progressPercent = calculateProgress(
                packet.count - packet.remainingCount,
                packet.count
              );
              const claimedCount = packet.count - packet.remainingCount;

              return (
                <div
                  key={packet.id}
                  className={`history-item ${packetStatus.class}`}
                  onClick={() => handlePacketClick(packet)}
                >
                  <div className="history-header">
                    <span className="packet-id">红包 #{packet.id}</span>
                    <span className={`packet-status ${packetStatus.class}`}>
                      {packetStatus.text}
                    </span>
                  </div>

                  <div className="history-details">
                    <div className="detail-item">
                      <span>类型: {packet.isEqual ? '等额' : '随机'}</span>
                      <span>总额: {packet.amount} ETH</span>
                    </div>
                    <div className="detail-item">
                      <span>进度: {claimedCount}/{packet.count}</span>
                      <span>剩余: {packet.remainingAmount} ETH</span>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill-small"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex space-x-3 mt-3">
                    <button 
                      className="flex-1 btn-enhanced bg-white bg-opacity-20 text-white text-sm py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePacketClick(packet);
                      }}
                    >
                      📋 查看详情
                    </button>
                    {packet.remainingCount > 0 && !packet.hasClaimed && (
                      <button 
                        className="flex-1 claim-btn text-sm py-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaimPacket(packet.id);
                        }}
                      >
                        🎁 立即抢红包
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 空状态 */
        <div className="enhanced-card text-center p-12">
          <div className="text-6xl mb-4 opacity-50">📜</div>
          <h3 className="text-white text-xl font-bold mb-2">暂无红包历史</h3>
          <p className="text-white opacity-70 mb-6">
            {Number(packetId) === 0 ? '还没有人创建过红包' : '正在加载历史记录...'}
          </p>
          <div className="space-y-2 text-white text-sm opacity-60">
            <p>💡 创建第一个红包来开始使用</p>
            <p>🎁 红包历史会自动显示在这里</p>
            <p>📊 支持查看最近10个红包的状态</p>
          </div>
        </div>
      )}

      {/* 详情弹窗 */}
      {selectedPacket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="enhanced-card max-w-md w-full">
            <div className="red-packet-details">
              <div className="packet-info-card">
                <div className="packet-header">
                  <h4>红包 #{selectedPacket.id}</h4>
                  <span className="packet-type-badge">
                    {selectedPacket.isEqual ? '等额红包' : '随机红包'}
                  </span>
                </div>

                <div className="packet-stats">
                  <div className="stat-item">
                    <span className="stat-label">总金额:</span>
                    <span className="stat-value">{selectedPacket.amount} ETH</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">剩余金额:</span>
                    <span className="stat-value">{selectedPacket.remainingAmount} ETH</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">总个数:</span>
                    <span className="stat-value">{selectedPacket.count}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">剩余个数:</span>
                    <span className="stat-value">{selectedPacket.remainingCount}</span>
                  </div>
                </div>

                <div className="progress-container">
                  <div className="progress-label">抢红包进度</div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${calculateProgress(
                          selectedPacket.count - selectedPacket.remainingCount,
                          selectedPacket.count
                        )}%` 
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {selectedPacket.count - selectedPacket.remainingCount} / {selectedPacket.count}
                  </div>
                </div>

                <div className="action-buttons">
                  {selectedPacket.remainingCount > 0 && !selectedPacket.hasClaimed && (
                    <button
                      onClick={() => handleClaimPacket(selectedPacket.id)}
                      className="claim-btn"
                    >
                      🎁 抢红包
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedPacket(null)}
                    className="refresh-btn"
                  >
                    ❌ 关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 说明信息 */}
      <div className="mt-8 enhanced-card">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <span className="mr-2">💡</span>
          使用说明
        </h4>
        <div className="grid md:grid-cols-2 gap-6 text-white text-sm opacity-80">
          <div>
            <h5 className="font-medium mb-2">状态说明:</h5>
            <ul className="space-y-1">
              <li>• <span className="text-red-300">🎁 可抢:</span> 红包还有剩余，您未参与</li>
              <li>• <span className="text-green-300">✅ 已参与:</span> 您已经抢过这个红包</li>
              <li>• <span className="text-gray-300">💸 已抢完:</span> 红包已被全部领取</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">功能说明:</h5>
            <ul className="space-y-1">
              <li>• 显示最近10个红包的详细信息</li>
              <li>• 实时更新红包状态和进度</li>
              <li>• 支持快速查看和参与红包</li>
              <li>• 自动刷新确保数据最新</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}