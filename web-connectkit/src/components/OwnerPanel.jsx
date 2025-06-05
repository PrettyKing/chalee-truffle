import { useState } from 'react';

export default function OwnerPanel({ 
  onTransferToOwner, 
  onResetPacketCount,
  isTransferring, 
  transferError, 
  contractBalance, 
  onRefresh 
}) {
  const [status, setStatus] = useState('');

  const handleTransferToOwner = async () => {
    try {
      setStatus('正在转移资金到所有者...');
      await onTransferToOwner();
      setStatus('转移成功！');
      if (onRefresh) onRefresh();
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes('ACTION_REJECTED')) {
        errorMessage = '用户拒绝了交易';
      } else if (errorMessage.includes('Only the owner')) {
        errorMessage = '只有合约所有者才能执行此操作';
      } else if (errorMessage.includes('No balance')) {
        errorMessage = '合约没有余额可转移';
      }
      setStatus(`转移失败: ${errorMessage}`);
    }
  };

  const handleResetPacketCount = async () => {
    try {
      setStatus('正在重置红包计数器...');
      await onResetPacketCount();
      setStatus('重置成功！');
      if (onRefresh) onRefresh();
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes('ACTION_REJECTED')) {
        errorMessage = '用户拒绝了交易';
      } else if (errorMessage.includes('Only owner')) {
        errorMessage = '只有合约所有者才能执行此操作';
      }
      setStatus(`重置失败: ${errorMessage}`);
    }
  };

  return (
    <div className="card glass">
      <h3><span className="card-icon">🏆</span>所有者操作</h3>
      
      <div className="input-group">
        <button 
          className="btn btn-warning tooltip"
          onClick={handleTransferToOwner}
          disabled={isTransferring}
          data-tooltip="只有合约所有者可以执行此操作"
        >
          {isTransferring ? (
            <>
              <span className="loading-spinner"></span>
              转移中...
            </>
          ) : (
            '转移所有余额到合约所有者'
          )}
        </button>
        
        <button 
          className="btn btn-info tooltip"
          onClick={handleResetPacketCount}
          disabled={isTransferring}
          data-tooltip="重置红包计数器（仅测试用）"
        >
          {isTransferring ? (
            <>
              <span className="loading-spinner"></span>
              重置中...
            </>
          ) : (
            '重置红包计数器'
          )}
        </button>
      </div>

      {/* 状态显示 */}
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
      {transferError && (
        <div className="status-message status-error">
          错误: {transferError.message || transferError}
        </div>
      )}

      {/* 合约信息 */}
      <div className="status-message status-info" style={{ marginTop: '15px' }}>
        <strong>合约当前余额:</strong> {contractBalance} ETH
      </div>

      {/* 所有者权限说明 */}
      <div className="status-message status-warning" style={{ fontSize: '0.9rem' }}>
        <strong>所有者权限:</strong>
        <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
          • 转移合约中的所有ETH到所有者地址<br/>
          • 重置红包计数器（开发测试功能）<br/>
          • 这些操作不可逆，请谨慎操作
        </div>
      </div>
    </div>
  );
}