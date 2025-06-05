import { useState, useEffect } from 'react';
import { useRedPacket } from '../hooks/useRedPacket';

export default function PacketHistory({ onQueryRedPacket, onGrabRedPacket }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { packetId } = useRedPacket();

  const loadHistory = async () => {
    if (!packetId || packetId === 0) {
      setHistory([]);
      setError('暂无红包历史');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // 这里应该调用实际的历史查询逻辑
      // 由于我们需要查询多个红包信息，这里做一个模拟实现
      const historyData = [];
      const maxHistory = Math.min(packetId, 10);
      
      for (let i = packetId - 1; i >= Math.max(0, packetId - maxHistory); i--) {
        try {
          // 这里应该调用实际的红包查询
          // const packetInfo = await queryRedPacket(i);
          // 暂时使用模拟数据
          const mockPacketInfo = {
            id: i,
            isEqual: Math.random() > 0.5,
            count: Math.floor(Math.random() * 10) + 1,
            remainingCount: Math.floor(Math.random() * 5),
            amount: (Math.random() * 0.1 + 0.01).toFixed(4),
            remainingAmount: (Math.random() * 0.05).toFixed(4),
            hasClaimed: Math.random() > 0.7,
          };
          
          historyData.push(mockPacketInfo);
        } catch (err) {
          console.error(`加载红包 #${i} 失败:`, err);
        }
      }
      
      setHistory(historyData);
    } catch (err) {
      setError(`加载失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePacketClick = (packetId) => {
    if (onQueryRedPacket) {
      onQueryRedPacket(packetId);
    }
  };

  const getStatusInfo = (packet) => {
    const totalCount = parseInt(packet.count);
    const remainingCount = parseInt(packet.remainingCount);
    const claimedCount = totalCount - remainingCount;
    const progressPercent = totalCount > 0 ? (claimedCount / totalCount) * 100 : 0;
    
    let status = '可抢';
    let statusClass = 'available';
    
    if (remainingCount === 0) {
      status = '已抢完';
      statusClass = 'finished';
    } else if (packet.hasClaimed) {
      status = '已参与';
      statusClass = 'claimed';
    }
    
    return { status, statusClass, progressPercent, claimedCount, totalCount };
  };

  useEffect(() => {
    if (packetId > 0) {
      loadHistory();
    }
  }, [packetId]);

  return (
    <div className="card glass">
      <h3><span className="card-icon">📜</span>红包历史</h3>
      
      <div className="input-group">
        <button 
          className="btn btn-info"
          onClick={loadHistory}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              加载中...
            </>
          ) : (
            '加载红包历史'
          )}
        </button>
      </div>

      <div className="history-container">
        {loading && (
          <div className="loading">正在加载红包历史...</div>
        )}

        {error && !loading && (
          <div className="error">{error}</div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="no-data">暂无红包历史</div>
        )}

        {!loading && history.length > 0 && (
          <div className="history-list">
            {history.map((packet) => {
              const statusInfo = getStatusInfo(packet);
              
              return (
                <div 
                  key={packet.id}
                  className={`history-item ${statusInfo.statusClass}`}
                  onClick={() => handlePacketClick(packet.id)}
                >
                  <div className="history-header">
                    <span className="packet-id">红包 #{packet.id}</span>
                    <span className={`packet-status ${statusInfo.statusClass}`}>
                      {statusInfo.status}
                    </span>
                  </div>
                  
                  <div className="history-details">
                    <div className="detail-item">
                      <span>类型: {packet.isEqual ? '等额' : '随机'}</span>
                      <span>总额: {packet.amount} ETH</span>
                    </div>
                    <div className="detail-item">
                      <span>进度: {statusInfo.claimedCount}/{statusInfo.totalCount}</span>
                      <span>剩余: {packet.remainingAmount} ETH</span>
                    </div>
                  </div>
                  
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill-small" 
                      style={{ width: `${statusInfo.progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 使用说明 */}
      <div className="status-message status-info" style={{ marginTop: '15px', fontSize: '0.9rem' }}>
        <strong>说明:</strong> 点击历史记录项可以查看该红包的详细信息。历史记录显示最近10个红包。
      </div>
    </div>
  );
}