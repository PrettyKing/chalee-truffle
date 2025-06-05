import { useState } from 'react';

export default function CreateRedPacket({ onCreateRedPacket, isLoading, error }) {
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState('1');
  const [status, setStatus] = useState('');

  const handleCreate = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setStatus('请输入有效的红包金额');
      return;
    }

    const countNum = parseInt(count);
    if (isNaN(countNum) || countNum < 1 || countNum > 100) {
      setStatus('红包个数必须在1-100之间');
      return;
    }

    try {
      setStatus('正在创建红包...');
      await onCreateRedPacket(amount, countNum, false); // false for random red packet
      setStatus('红包创建成功！');
      setAmount('');
      setCount('1');
    } catch (err) {
      let errorMessage = err.message;
      if (errorMessage.includes('ACTION_REJECTED')) {
        errorMessage = '用户拒绝了交易';
      } else if (errorMessage.includes('INSUFFICIENT_FUNDS')) {
        errorMessage = '余额不足支付 Gas 费用';
      } else if (errorMessage.includes('Count must be between')) {
        errorMessage = '红包个数必须在1-100之间';
      } else if (errorMessage.includes('You can send at most')) {
        errorMessage = '您已达到红包发送上限，请联系管理员重置';
      }
      setStatus(`创建红包失败: ${errorMessage}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    }
  };

  return (
    <div className="card glass">
      <h3><span className="card-icon">🎁</span>创建红包</h3>
      <div className="input-group">
        <div className="input-row">
          {/* 红包金额 */}
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入红包金额（ETH）"
            step="0.001"
            min="0.001"
            disabled={isLoading}
          />
          {/* 红包个数 */}
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入红包个数"
            min="1"
            max="100"
            disabled={isLoading}
          />
        </div>
        <button 
          className="btn btn-warning"
          onClick={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              创建中...
            </>
          ) : (
            '创建红包'
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
      {error && (
        <div className="status-message status-error">
          错误: {error.message || error}
        </div>
      )}

      {/* 使用说明 */}
      <div className="status-message status-info" style={{ marginTop: '15px', fontSize: '0.9rem' }}>
        <strong>说明:</strong> 创建随机红包，每个红包的金额将随机分配。红包个数限制在1-100之间。
      </div>
    </div>
  );
}