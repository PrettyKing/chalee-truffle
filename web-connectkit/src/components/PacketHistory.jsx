import { useState, useEffect } from 'react';
import { useContractRead } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/ChaleeDApp';

export default function PacketHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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

      // 模拟加载历史数据
      // 在实际应用中，这里应该调用合约的 getPacketInfo 方法
      for (let i = latestId - 1; i >= Math.max(0, latestId - maxHistory); i--) {
        // 这里应该是实际的合约调用
        // const packetInfo = await contract.getPacketInfo(i);
        
        // 模拟数据
        const mockData = {
          id: i,
          isEqual: Math.random() > 0.5,
          count: Math.floor(Math.random() * 10) + 1,
          remainingCount: Math.floor(Math.random() * 5),
          amount: (Math.random() * 0.1 + 0.01).toFixed(4),
          remainingAmount: (Math.random() * 0.05).toFixed(4),
          hasClaimed: Math.random() > 0.7,
        };

        history.push(mockData);
      }

      setHistoryData(history);
    } catch (err) {
      setError('加载历史记录失败: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (packetId) {
      loadHistory();
    }
  }, [packetId]);

  const getStatusInfo = (packet) => {
    if (packet.remainingCount === 0) {
      return { status: '已抢完', className: 'bg-gray-500 bg-opacity-30 text-gray-300', icon: '💸' };
    } else if (packet.hasClaimed) {
      return { status: '已参与', className: 'bg-green-500 bg-opacity-30 text-green-300', icon: '✅' };
    } else {
      return { status: '可抢', className: 'bg-red-500 bg-opacity-30 text-red-300', icon: '🎁' };
    }
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
          className="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white font-medium rounded-xl transition-all duration-200"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
        <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-6 text-center">
          <div className="text-red-200 mb-2">❌ {error}</div>
          <button
            onClick={loadHistory}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            重试
          </button>
        </div>
      ) : historyData.length > 0 ? (
        <div className="space-y-4">
          {historyData.map((packet) => {
            const { status, className, icon } = getStatusInfo(packet);
            const progressPercent = packet.count > 0 ? ((packet.count - packet.remainingCount) / packet.count) * 100 : 0;

            return (
              <div
                key={packet.id}
                className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 shadow-lg hover:bg-opacity-30 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${className}`}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">红包 #{packet.id}</h3>
                      <p className="text-white opacity-70 text-sm">
                        {packet.isEqual ? '等额红包' : '随机红包'}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${className}`}>
                    {status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">{packet.amount}</div>
                    <div className="text-white opacity-60 text-xs">总金额 (ETH)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">{packet.remainingAmount}</div>
                    <div className="text-white opacity-60 text-xs">剩余金额 (ETH)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">{packet.count}</div>
                    <div className="text-white opacity-60 text-xs">总个数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">{packet.remainingCount}</div>
                    <div className="text-white opacity-60 text-xs">剩余个数</div>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mb-3">
                  <div className="flex justify-between text-white text-sm mb-1">
                    <span>领取进度</span>
                    <span>{packet.count - packet.remainingCount} / {packet.count}</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-3">
                  <button 
                    className="flex-1 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                    onClick={() => console.log('查看详情', packet.id)}
                  >
                    📋 查看详情
                  </button>
                  {packet.remainingCount > 0 && !packet.hasClaimed && (
                    <button 
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                      onClick={() => console.log('立即抢红包', packet.id)}
                    >
                      🎁 立即抢红包
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 空状态 */
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-12 text-center">
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

      {/* 说明信息 */}
      <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6">
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