import { useState } from 'react';
import { getErrorMessage, calculateProgress, formatPacketStatus } from '../utils/helpers';

export default function RedPacketInfo({ info, onGrabRedPacket, onQueryRedPacket, isLoading, error, packetId }) {
  const [inputPacketId, setInputPacketId] = useState('0');
  const [localError, setLocalError] = useState('');

  const handleQuery = async (e) => {
    e.preventDefault();
    setLocalError('');

    const id = parseInt(inputPacketId);
    if (isNaN(id) || id < 0) {
      setLocalError('请输入有效的红包ID（大于等于0）');
      return;
    }

    // 检查红包ID是否在有效范围内
    if (packetId === 0) {
      setLocalError('还没有人创建过红包，请先创建红包');
      return;
    }

    if (id >= packetId) {
      setLocalError(`红包ID无效。当前最大红包ID为: ${packetId - 1}`);
      return;
    }

    try {
      const success = await onQueryRedPacket(id);
      if (!success) {
        setLocalError('查询失败，请检查红包ID是否正确');
      }
    } catch (err) {
      setLocalError(getErrorMessage(err));
    }
  };

  const handleGrab = async () => {
    setLocalError('');
    try {
      await onGrabRedPacket();
    } catch (err) {
      setLocalError(getErrorMessage(err));
    }
  };

  const displayError = localError || (error ? getErrorMessage(error) : '');

  const canClaim = info && !info.hasClaimed && info.remainingCount > 0 && parseFloat(info.remainingAmount) > 0;
  const isFinished = info && info.remainingCount === 0;
  const alreadyClaimed = info && info.hasClaimed;

  const progressPercent = info 
    ? calculateProgress(info.count - info.remainingCount, info.count)
    : 0;

  const claimedCount = info ? info.count - info.remainingCount : 0;
  const packetStatus = info ? formatPacketStatus(info.remainingCount, info.hasClaimed) : null;

  return (
    <div className="enhanced-card">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-2">红包信息</h2>
        <p className="text-white opacity-80">查询和领取红包</p>
      </div>

      {/* 连接状态指示器 */}
      <div className="connection-status mb-4">
        <div className={`status-dot ${info ? 'connected' : ''}`}></div>
        <span className="text-white text-sm">
          {info ? '红包已查询' : '等待查询红包'}
        </span>
      </div>

      {/* 红包状态提示 */}
      {packetId !== undefined && (
        <div className="bg-white bg-opacity-10 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between text-white text-sm">
            <span>当前红包总数:</span>
            <span className="font-bold">{packetId} 个</span>
          </div>
          <div className="flex items-center justify-between text-white text-sm mt-1">
            <span>可查询ID范围:</span>
            <span className="font-bold">
              {packetId > 0 ? `0 - ${packetId - 1}` : '暂无红包'}
            </span>
          </div>
        </div>
      )}

      {/* 查询红包 */}
      <form onSubmit={handleQuery} className="space-y-4 mb-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            红包ID
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              min="0"
              max={packetId > 0 ? packetId - 1 : 0}
              value={inputPacketId}
              onChange={(e) => setInputPacketId(e.target.value)}
              placeholder={packetId > 0 ? `输入 0-${packetId - 1}` : '暂无红包'}
              className="input-enhanced flex-1"
              disabled={packetId === 0}
            />
            <button
              type="submit"
              disabled={packetId === 0}
              className="btn-enhanced btn-primary"
            >
              查询
            </button>
          </div>
          {packetId === 0 && (
            <p className="text-yellow-300 text-xs mt-1">
              💡 还没有红包被创建，请先在左侧创建红包
            </p>
          )}
        </div>
      </form>

      {/* 红包详情 - 增强版 */}
      {info && !info.error ? (
        <div className="red-packet-details">
          <div className="packet-info-card">
            <div className="packet-header">
              <h4>红包 #{info.id}</h4>
              <span className="packet-type-badge">
                {info.isEqual ? '等额红包' : '随机红包'}
              </span>
            </div>

            {/* 统计信息网格 */}
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
              <div className="stat-item">
                <span className="stat-label">状态:</span>
                <span className={`stat-value ${packetStatus?.class}`}>
                  {packetStatus?.text}
                </span>
              </div>
            </div>

            {/* 进度条 */}
            <div className="progress-container">
              <div className="progress-label">抢红包进度</div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="progress-text">{claimedCount} / {info.count}</div>
            </div>

            {/* 操作按钮 */}
            <div className="action-buttons">
              {canClaim && (
                <button
                  onClick={handleGrab}
                  disabled={isLoading}
                  className="claim-btn"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="loading-spinner"></div>
                      <span>抢红包中...</span>
                    </div>
                  ) : (
                    '🎁 抢红包'
                  )}
                </button>
              )}
              
              {isFinished && (
                <button
                  className="claim-btn"
                  disabled={true}
                >
                  😢 红包已抢完
                </button>
              )}

              <button
                onClick={() => onQueryRedPacket(info.id)}
                className="refresh-btn"
              >
                🔄 刷新状态
              </button>
            </div>
          </div>
        </div>
      ) : info && info.error ? (
        /* 错误状态显示 */
        <div className="text-center py-8">
          <div className="text-6xl mb-4 opacity-50">❌</div>
          <h3 className="text-white text-xl font-bold mb-4">查询失败</h3>
          <div className="status-message status-error">
            {info.error}
          </div>
          <p className="text-white opacity-70 text-sm mt-2">
            请检查网络连接和合约配置
          </p>
        </div>
      ) : (
        /* 空状态 */
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🎁</div>
          <p className="text-white opacity-70 mb-4">
            {packetId === 0 
              ? '还没有红包被创建，请先创建红包' 
              : '输入红包ID来查询红包信息'
            }
          </p>
          <p className="text-white opacity-50 text-sm">
            {packetId > 0 
              ? `当前可查询的红包ID: 0 - ${packetId - 1}`
              : '创建第一个红包后就可以查询了'
            }
          </p>
        </div>
      )}

      {/* 错误信息 */}
      {displayError && (
        <div className="status-message status-error mt-4">
          <span>❌</span>
          <span>{displayError}</span>
        </div>
      )}
    </div>
  );
}