import { useState, useEffect } from 'react';

export default function RedPacketInfo({ 
  info, 
  onGrabRedPacket, 
  onQueryRedPacket, 
  isLoading, 
  error, 
  packetId 
}) {
  const [queryId, setQueryId] = useState(packetId || 0);
  const [status, setStatus] = useState('');
  const [currentPacketId, setCurrentPacketId] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // 当packetId变化时自动更新查询ID
  useEffect(() => {
    if (packetId > 0) {
      setQueryId(packetId - 1); // packetId是下一个要创建的ID，所以减1
    }
  }, [packetId]);

  const handleQuery = async () => {
    if (isNaN(queryId) || queryId < 0) {
      setStatus('请输入有效的红包ID');
      return;
    }

    try {
      setStatus('正在查询红包信息...');
      await onQueryRedPacket(queryId);
      setCurrentPacketId(queryId);
      setShowDetails(true);
      setStatus('查询成功！');
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes('Invalid packet ID')) {
        errorMessage = '红包ID不存在';
      }
      setStatus(`查询失败: ${errorMessage}`);
      setShowDetails(false);
    }
  };

  const handleGrab = async () => {
    if (currentPacketId < 0) {
      setStatus('请先查询红包信息');
      return;
    }

    try {
      setStatus('正在抢红包...');
      const result = await onGrabRedPacket(currentPacketId);
      setStatus(`抢红包成功！获得 ${result?.amount || '未知'} ETH`);
      // 刷新红包状态
      setTimeout(() => {
        handleRefresh();
      }, 1000);
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes('ACTION_REJECTED')) {
        errorMessage = '用户拒绝了交易';
      } else if (errorMessage.includes('No remaining red packets')) {
        errorMessage = '红包已被抢完';
      } else if (errorMessage.includes('Already claimed')) {
        errorMessage = '您已经抢过这个红包了';
      } else if (errorMessage.includes('Invalid packet ID')) {
        errorMessage = '红包ID无效';
      }
      setStatus(`抢红包失败: ${errorMessage}`);
    }
  };

  const handleRefresh = async () => {
    if (currentPacketId >= 0) {
      await handleQuery();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };

  // 计算进度
  const getProgress = () => {
    if (!info || !info.count) return { percent: 0, text: '0 / 0' };
    
    const totalCount = parseInt(info.count);
    const remainingCount = parseInt(info.remainingCount || 0);
    const claimedCount = totalCount - remainingCount;
    const percent = totalCount > 0 ? (claimedCount / totalCount) * 100 : 0;
    
    return { percent, text: `${claimedCount} / ${totalCount}` };
  };

  const progress = getProgress();

  // 判断是否可以抢红包
  const canClaim = info && 
    !info.hasClaimed && 
    parseInt(info.remainingCount || 0) > 0 && 
    parseFloat(info.remainingAmount || 0) > 0;

  return (
    <div className="card glass">
      <h3><span className="card-icon">🎉</span>红包状态</h3>

      {/* 查询红包 */}
      <div className="input-group">
        <div className="input-row">
          <input
            type="number"
            value={queryId}
            onChange={(e) => setQueryId(parseInt(e.target.value) || 0)}
            onKeyPress={handleKeyPress}
            placeholder="输入红包ID查询"
            min="0"
            disabled={isLoading}
          />
          <button 
            className="btn btn-info"
            onClick={handleQuery}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                查询中...
              </>
            ) : (
              '查询红包'
            )}
          </button>
        </div>
      </div>

      {/* 状态信息 */}
      {status && (
        <div className={`status-message ${
          status.includes('成功') ? 'status-success' :
          status.includes('失败') ? 'status-error' :
          status.includes('正在') ? 'status-info' : 'status-warning'
        }`}>
          {status}
        </div>
      )}

      {/* 错误显示 */}
      {error && (
        <div className="status-message status-error">
          错误: {error.message || error}
        </div>
      )}

      {/* 红包详情显示区域 */}
      {showDetails && info && (
        <div className="red-packet-details">
          <div className="packet-info-card">
            <div className="packet-header">
              <h4>红包 #{currentPacketId}</h4>
              <span className="packet-type-badge">
                {info.isEqual ? '等额红包' : '随机红包'}
              </span>
            </div>

            <div className="packet-stats">
              <div className="stat-item">
                <span className="stat-label">总金额:</span>
                <span className="stat-value">{info.amount} ETH</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">剩余金额:</span>
                <span className="stat-value">{info.remainingAmount} ETH</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">总个数:</span>
                <span className="stat-value">{info.count}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">剩余个数:</span>
                <span className="stat-value">{info.remainingCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">已抢状态:</span>
                <span className={`stat-value ${info.hasClaimed ? 'claimed' : 'not-claimed'}`}>
                  {info.hasClaimed ? '已抢' : '未抢'}
                </span>
              </div>
            </div>

            {/* 进度条 */}
            <div className="progress-container">
              <div className="progress-label">抢红包进度</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress.percent}%` }}
                ></div>
              </div>
              <div className="progress-text">{progress.text}</div>
            </div>

            {/* 抢红包按钮 */}
            <div className="action-buttons">
              {canClaim ? (
                <button
                  className="btn btn-success claim-btn"
                  onClick={handleGrab}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      抢夺中...
                    </>
                  ) : (
                    '🎁 抢红包'
                  )}
                </button>
              ) : info.hasClaimed ? (
                <button className="btn claim-btn" disabled>
                  ✅ 已抢过
                </button>
              ) : parseInt(info.remainingCount || 0) === 0 ? (
                <button className="btn claim-btn" disabled>
                  😢 红包已抢完
                </button>
              ) : (
                <button className="btn claim-btn" disabled>
                  ❌ 不可抢取
                </button>
              )}
              
              <button 
                className="btn btn-secondary"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                🔄 刷新状态
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 使用提示 */}
      {!showDetails && (
        <div className="status-message status-info" style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          <strong>提示:</strong> 输入红包ID查询详细信息，或等待新红包创建后自动显示最新红包。
        </div>
      )}
    </div>
  );
}