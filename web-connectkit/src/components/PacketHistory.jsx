import { useState, useEffect, useCallback } from "react";
import { useContractRead } from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contracts/ChaleeDApp";
import {
  calculateProgress,
  formatPacketStatus,
  debugLog,
} from "../utils/helpers";
// import { fetchPacketHistory, fetchPacketInfo } from "../utils/blockchain";

export default function PacketHistory({ onQueryRedPacket, onGrabRedPacket }) {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPacket, setSelectedPacket] = useState(null);

  // 获取最新红包ID
  const { data: packetId } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "packetId",
  });

  // 加载红包历史记录
  const loadHistory = useCallback(async () => {
    if (!packetId || Number(packetId) === 0) {
      setHistoryData([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const latestId = Number(packetId);
      debugLog("开始加载红包历史", { latestId });

      // 使用新的区块链工具函数批量获取红包历史
      const history = await fetchPacketHistory(latestId, 10);

      setHistoryData(history);
      debugLog("红包历史加载完成", { count: history.length });
    } catch (err) {
      const errorMsg = "加载历史记录失败: " + err.message;
      setError(errorMsg);
      debugLog("加载历史记录失败", err);
    } finally {
      setIsLoading(false);
    }
  }, [packetId]);

  // 当 packetId 变化时自动加载历史记录
  useEffect(() => {
    if (packetId) {
      loadHistory();
    }
  }, [packetId, loadHistory]);

  const handlePacketClick = async (packet) => {
    setSelectedPacket(packet);
    debugLog("查看红包详情", packet);

    // 获取最新的红包信息
    try {
      const updatedPacket = await fetchPacketInfo(packet.id);
      setSelectedPacket(updatedPacket);
    } catch (error) {
      debugLog("刷新红包详情失败", error);
    }
  };

  const handleClaimPacket = async (packetId) => {
    debugLog("尝试抢红包", { packetId });
    try {
      if (onQueryRedPacket) {
        // 先查询红包以更新状态
        await onQueryRedPacket(packetId);
      }
      if (onGrabRedPacket) {
        // 然后抢红包
        await onGrabRedPacket();
      }
      // 抢红包后刷新历史记录
      setTimeout(() => {
        loadHistory();
      }, 3000); // 等待3秒让交易确认
    } catch (error) {
      debugLog("抢红包失败", error);
    }
  };

  const handleQueryPacket = (packetId) => {
    if (onQueryRedPacket) {
      onQueryRedPacket(packetId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">📜</div>
        <h2 className="text-3xl font-bold text-white mb-2">红包历史</h2>
        <p className="text-white opacity-80">查看最近的红包记录（链上数据）</p>
      </div>

      {/* 统计信息 */}
      {packetId && Number(packetId) > 0 && (
        <div className="enhanced-card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {Number(packetId)}
              </div>
              <div className="text-white opacity-70 text-sm">总红包数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {historyData.length}
              </div>
              <div className="text-white opacity-70 text-sm">已加载</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {
                  historyData.filter(
                    (p) => p.remainingCount > 0 && !p.hasClaimed
                  ).length
                }
              </div>
              <div className="text-white opacity-70 text-sm">可抢红包</div>
            </div>
          </div>
        </div>
      )}

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
              <span>从区块链加载中...</span>
            </div>
          ) : (
            <>🔄 刷新历史记录</>
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
              const packetStatus = formatPacketStatus(
                packet.remainingCount,
                packet.hasClaimed
              );
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
                      <span>类型: {packet.isEqual ? "等额" : "随机"}</span>
                      <span>总额: {packet.amount} ETH</span>
                    </div>
                    <div className="detail-item">
                      <span>
                        进度: {claimedCount}/{packet.count}
                      </span>
                      <span>剩余: {packet.remainingAmount} ETH</span>
                    </div>
                    <div className="detail-item">
                      <span>
                        状态: {packet.hasClaimed ? "已参与" : "未参与"}
                      </span>
                      <span>剩余: {packet.remainingCount} 个</span>
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
                        handleQueryPacket(packet.id);
                      }}
                    >
                      📋 查询详情
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
            {Number(packetId) === 0
              ? "还没有人创建过红包"
              : "正在从区块链加载历史记录..."}
          </p>
          <div className="space-y-2 text-white text-sm opacity-60">
            <p>💡 创建第一个红包来开始使用</p>
            <p>🎁 红包历史会自动显示在这里</p>
            <p>📊 支持查看最近10个红包的状态</p>
            <p>⛓️ 数据直接从区块链获取</p>
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
                    {selectedPacket.isEqual ? "等额红包" : "随机红包"}
                  </span>
                </div>

                <div className="packet-stats">
                  <div className="stat-item">
                    <span className="stat-label">总金额:</span>
                    <span className="stat-value">
                      {selectedPacket.amount} ETH
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">剩余金额:</span>
                    <span className="stat-value">
                      {selectedPacket.remainingAmount} ETH
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">总个数:</span>
                    <span className="stat-value">{selectedPacket.count}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">剩余个数:</span>
                    <span className="stat-value">
                      {selectedPacket.remainingCount}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">参与状态:</span>
                    <span
                      className={`stat-value ${
                        selectedPacket.hasClaimed ? "claimed" : "not-claimed"
                      }`}
                    >
                      {selectedPacket.hasClaimed ? "已参与" : "未参与"}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">红包状态:</span>
                    <span
                      className={`stat-value ${
                        formatPacketStatus(
                          selectedPacket.remainingCount,
                          selectedPacket.hasClaimed
                        ).class
                      }`}
                    >
                      {
                        formatPacketStatus(
                          selectedPacket.remainingCount,
                          selectedPacket.hasClaimed
                        ).text
                      }
                    </span>
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
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {selectedPacket.count - selectedPacket.remainingCount} /{" "}
                    {selectedPacket.count}
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    onClick={() => handleQueryPacket(selectedPacket.id)}
                    className="refresh-btn"
                  >
                    📋 查询最新状态
                  </button>

                  {selectedPacket.remainingCount > 0 &&
                    !selectedPacket.hasClaimed && (
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
              <li>
                • <span className="text-red-300">🎁 可抢:</span>{" "}
                红包还有剩余，您未参与
              </li>
              <li>
                • <span className="text-green-300">✅ 已参与:</span>{" "}
                您已经抢过这个红包
              </li>
              <li>
                • <span className="text-gray-300">💸 已抢完:</span>{" "}
                红包已被全部领取
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">功能说明:</h5>
            <ul className="space-y-1">
              <li>• 显示最近10个红包的详细信息</li>
              <li>• 实时更新红包状态和进度</li>
              <li>• 支持快速查看和参与红包</li>
              <li>• 数据直接从区块链获取</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-500 bg-opacity-20 rounded-lg">
          <div className="text-yellow-200 text-sm">
            <strong>🎉 增强功能：</strong>
            现在使用优化的区块链工具函数，支持批量并发获取数据，加载速度更快更稳定！
          </div>
        </div>

        <div className="mt-2 p-3 bg-blue-500 bg-opacity-20 rounded-lg">
          <div className="text-blue-200 text-sm">
            <strong>⛓️ 链上数据：</strong>
            所有红包信息都直接从以太坊区块链获取，确保数据真实可靠。
          </div>
        </div>
      </div>
    </div>
  );
}
