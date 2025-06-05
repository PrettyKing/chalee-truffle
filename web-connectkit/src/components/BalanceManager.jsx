import { useState } from 'react';

export default function BalanceManager({ 
  balance, 
  onDeposit, 
  onWithdraw, 
  isDepositing, 
  isWithdrawing, 
  depositError, 
  withdrawError, 
  onRefresh 
}) {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositStatus, setDepositStatus] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState('');

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
      setDepositStatus('请输入有效的存款金额');
      return;
    }

    try {
      setDepositStatus(`正在存入 ${depositAmount} ETH...`);
      await onDeposit(depositAmount);
      setDepositStatus('存款成功！');
      setDepositAmount('');
      if (onRefresh) onRefresh();
    } catch (err) {
      setDepositStatus(`存款失败: ${err.message}`);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
      setWithdrawStatus('请输入有效的提取金额');
      return;
    }

    try {
      setWithdrawStatus(`正在提取 ${withdrawAmount} ETH...`);
      await onWithdraw(withdrawAmount);
      setWithdrawStatus('提取成功！');
      setWithdrawAmount('');
      if (onRefresh) onRefresh();
    } catch (err) {
      setWithdrawStatus(`提取失败: ${err.message}`);
    }
  };

  const handleDepositKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleDeposit();
    }
  };

  const handleWithdrawKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleWithdraw();
    }
  };

  return (
    <>
      {/* 存款功能卡片 */}
      <div className="card glass">
        <h3><span className="card-icon">📥</span>存入 ETH</h3>
        <div className="input-group">
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            onKeyPress={handleDepositKeyPress}
            placeholder="输入存款金额（ETH）"
            step="0.001"
            min="0.001"
            className="tooltip"
            data-tooltip="最小存款金额为 0.001 ETH"
            disabled={isDepositing}
          />
          <button 
            className="btn btn-success"
            onClick={handleDeposit}
            disabled={isDepositing}
          >
            {isDepositing ? (
              <>
                <span className="loading-spinner"></span>
                存入中...
              </>
            ) : (
              '存入'
            )}
          </button>
        </div>

        {/* 存款状态显示 */}
        {depositStatus && (
          <div className={`status-message ${
            depositStatus.includes('成功') ? 'status-success' :
            depositStatus.includes('失败') ? 'status-error' :
            depositStatus.includes('正在') ? 'status-info' : 'status-warning'
          }`}>
            {depositStatus}
          </div>
        )}

        {/* 存款错误显示 */}
        {depositError && (
          <div className="status-message status-error">
            存款错误: {depositError.message || depositError}
          </div>
        )}
      </div>

      {/* 提款功能卡片 */}
      <div className="card glass">
        <h3><span className="card-icon">📤</span>提取 ETH</h3>
        <div className="input-group">
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            onKeyPress={handleWithdrawKeyPress}
            placeholder="输入提取金额（ETH）"
            step="0.001"
            min="0.001"
            className="tooltip"
            data-tooltip="确保合约有足够余额"
            disabled={isWithdrawing}
          />
          <button 
            className="btn btn-primary"
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? (
              <>
                <span className="loading-spinner"></span>
                提取中...
              </>
            ) : (
              '提取'
            )}
          </button>
        </div>

        {/* 提款状态显示 */}
        {withdrawStatus && (
          <div className={`status-message ${
            withdrawStatus.includes('成功') ? 'status-success' :
            withdrawStatus.includes('失败') ? 'status-error' :
            withdrawStatus.includes('正在') ? 'status-info' : 'status-warning'
          }`}>
            {withdrawStatus}
          </div>
        )}

        {/* 提款错误显示 */}
        {withdrawError && (
          <div className="status-message status-error">
            提款错误: {withdrawError.message || withdrawError}
          </div>
        )}

        {/* 当前余额提示 */}
        <div className="status-message status-info" style={{ marginTop: '15px' }}>
          <strong>当前合约余额:</strong> {balance} ETH
        </div>
      </div>
    </>
  );
}