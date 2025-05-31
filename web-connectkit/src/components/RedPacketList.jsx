import React, { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import { useContractRead } from 'wagmi';
import { RED_PACKET_ABI, CONTRACT_ADDRESS } from '../contracts/abi';

export default function RedPacketList({ redPacketData }) {
  const [packets, setPackets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 6;

  // 获取红包列表数据
  useEffect(() => {
    if (redPacketData.packetId === 0) {
      setPackets([]);
      return;
    }

    setLoading(true);
    const loadPackets = async () => {
      const packetList = [];
      const start = currentPage * pageSize;
      const end = Math.min(start + pageSize, redPacketData.packetId);

      for (let i = start; i < end; i++) {
        packetList.push({
          id: i,
          loading: true,
          data: null
        });
      }
      setPackets(packetList);

      // 逐个加载红包信息（这里简化处理，实际应该用批量查询）
      for (let i = start; i < end; i++) {
        try {
          // 注意：这里需要实际的合约调用来获取数据
          // 暂时使用模拟数据
          setTimeout(() => {
            setPackets(prev => prev.map(packet => 
              packet.id === i ? {
                ...packet,
                loading: false,
                data: {
                  isEqual: Math.random() > 0.5,
                  count: Math.floor(Math.random() * 10) + 1,
                  remainingCount: Math.floor(Math.random() * 5),
                  amount: (Math.random() * 0.1 + 0.01).toString(),
                  remainingAmount: (Math.random() * 0.05 + 0.005).toString()
                }
              } : packet
            ));
          }, i * 100);
        } catch (error) {
          console.error(`获取红包 ${i} 信息失败:`, error);
        }
      }
      setLoading(false);
    };

    loadPackets();
  }, [redPacketData.packetId, currentPage]);

  const totalPages = Math.ceil(redPacketData.packetId / pageSize);

  const PacketCard = ({ packet }) => {
    if (packet.loading) {
      return (
        <div className="bg-white bg-opacity-20 rounded-xl p-4 animate-pulse">
          <div className="h-6 bg-white bg-opacity-30 rounded mb-3"></div>
          <div className="h-4 bg-white bg-opacity-30 rounded mb-2"></div>
          <div className="h-4 bg-white bg-opacity-30 rounded"></div>
        </div>
      );
    }

    const data = packet.data;
    if (!data) return null;

    const progress = ((data.count - data.remainingCount) / data.count) * 100;
    const isFinished = data.remainingCount === 0;

    return (
      <div className={`bg-white bg-opacity-20 rounded-xl p-4 border-2 transition-all hover:scale-105 cursor-pointer ${
        isFinished ? 'border-gray-400' : 'border-yellow-400'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-white font-bold">红包 #{packet.id}</div>
          <div className="text-2xl">
            {isFinished ? '🔒' : data.isEqual ? '💰' : '🎲'}
          </div>
        </div>

        <div className="space-y-2 text-white text-sm">
          <div className="flex justify-between">
            <span>类型:</span>
            <span>{data.isEqual ? '等额红包' : '随机红包'}</span>
          </div>
          
          <div className="flex justify-between">
            <span>总金额:</span>
            <span>{parseFloat(data.amount).toFixed(4)} ETH</span>
          </div>
          
          <div className="flex justify-between">
            <span>剩余金额:</span>
            <span>{parseFloat(data.remainingAmount).toFixed(4)} ETH</span>
          </div>
          
          <div className="flex justify-between">
            <span>进度:</span>
            <span>{data.count - data.remainingCount}/{data.count}</span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="mt-3">
          <div className="bg-white bg-opacity-30 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                isFinished ? 'bg-gray-400' : 'bg-gradient-to-r from-yellow-400 to-red-400'
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* 状态标签 */}
        <div className="mt-3 text-center">
          {isFinished ? (
            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs">
              已抢完
            </span>
          ) : (
            <span className="bg-gradient-to-r from-yellow-400 to-red-400 text-white px-3 py-1 rounded-full text-xs">
              可领取
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">红包列表</h2>
        <p className="text-white opacity-75">
          查看所有已创建的红包状态
        </p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{redPacketData.packetId}</div>
          <div className="text-white opacity-75 text-sm">总红包数</div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {packets.filter(p => p.data && p.data.remainingCount > 0).length}
          </div>
          <div className="text-white opacity-75 text-sm">可领取</div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">
            {redPacketData.contractBalance} ETH
          </div>
          <div className="text-white opacity-75 text-sm">总余额</div>
        </div>
      </div>

      {/* 红包网格 */}
      {redPacketData.packetId === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-white text-lg">暂无红包</p>
          <p className="text-white opacity-75">创建您的第一个红包吧！</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packets.map((packet) => (
              <PacketCard key={packet.id} packet={packet} />
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-30"
              >
                上一页
              </button>
              
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === i
                        ? 'bg-yellow-400 text-white'
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-30"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}

      {/* 刷新按钮 */}
      <div className="text-center">
        <button
          onClick={() => {
            redPacketData.refetchAll();
            setCurrentPage(0);
          }}
          disabled={loading}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? '加载中...' : '🔄 刷新列表'}
        </button>
      </div>

      {/* 使用说明 */}
      <div className="bg-purple-500 bg-opacity-20 border border-purple-500 rounded-lg p-4">
        <div className="text-purple-200 text-sm space-y-1">
          <div>💡 <strong>列表说明:</strong></div>
          <div>• 🔒 已抢完的红包</div>
          <div>• 💰 等额红包 - 固定金额分配</div>
          <div>• 🎲 随机红包 - 随机金额分配</div>
          <div>• 点击红包卡片可查看详细信息</div>
        </div>
      </div>
    </div>
  );
}
