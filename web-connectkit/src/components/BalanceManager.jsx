import { useState } from 'react';
import { getErrorMessage } from '../utils/helpers';

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
  const [localDepositError, setLocalDepositError] = useState('');
  const [localWithdrawError, setLocalWithdrawError] = useState('');

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLocalDepositError('');

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setLocalDepositError('请输入有效的存款金额');
      return;
    }

    try {
      await onDeposit(depositAmount);
      setDepositAmount('');
    } catch (err) {
      setLocalDepositError(getErrorMessage(err));
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLocalWithdrawError('');

    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      setLocalWithdrawError('请输入有效的提款金额');
      return;
    }

    if (parseFloat(withdrawAmount) > parseFloat(balance)) {
      setLocalWithdrawError('提款金额不能超过合约余额');
      return;
    }

    try {
      await onWithdraw(withdrawAmount);
      setWithdrawAmount('');
    } catch (err) {
      setLocalWithdrawError(getErrorMessage(err));
    }
  };

  const displayDepositError = localDepositError || (depositError ? getErrorMessage(depositError) : '');
  const displayWithdrawError = localWithdrawError || (withdrawError ? getErrorMessage(withdrawError) : '');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">💰</div>
        <h2 className="text-3xl font-bold text-white mb-2">余额管理</h2>
        <p className="text-white opacity-80">管理您在合约中的ETH余额</p>
      </div>

      {/* 当前余额显示 */}
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl">
        <div className="text-center">
          <h3 className="text-white text-lg font-medium mb-4">合约当前余额</h3>
          <div className="text-5xl font-bold text-white mb-4">
            {balance} ETH
          </div>
          <button
            onClick={onRefresh}
            className="px-6 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white font-medium rounded-xl transition-all duration-200"
          >
            🔄 刷新余额
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 存款部分 */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">📥</div>
            <h3 className="text-xl font-bold text-white mb-2">存入ETH</h3>
            <p className="text-white opacity-80">向合约存入ETH</p>
          </div>

          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                存款金额 (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="输入存款金额"
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
                  disabled={isDepositing}
                />
                <div className="absolute right-3 top-3 text-white opacity-60">
                  ETH
                </div>
              </div>
            </div>

            {/* 快速金额选择 */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                快速选择
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['0.01', '0.1', '1'].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setDepositAmount(amount)}
                    className="py-2 px-3 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white text-sm rounded-lg transition-colors"
                    disabled={isDepositing}
                  >
                    {amount} ETH
                  </button>
                ))}
              </div>
            </div>

            {displayDepositError && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-3">
                <div className="flex items-center space-x-2 text-red-200 text-sm">
                  <span>❌</span>
                  <span>{displayDepositError}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isDepositing || !depositAmount}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {isDepositing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>存入中...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">📥</span>
                  存入ETH
                </>
              )}
            </button>
          </form>
        </div>

        {/* 提款部分 */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">📤</div>
            <h3 className="text-xl font-bold text-white mb-2">提取ETH</h3>
            <p className="text-white opacity-80">从合约提取ETH</p>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                提款金额 (ETH)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  max={balance}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="输入提款金额"
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
                  disabled={isWithdrawing}
                />
                <div className="absolute right-3 top-3 text-white opacity-60">
                  ETH
                </div>
              </div>
              <p className="text-white text-xs opacity-60 mt-1">
                最大可提取: {balance} ETH
              </p>
            </div>

            {/* 快速提款选择 */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                快速选择
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWithdrawAmount((parseFloat(balance) * 0.25).toFixed(6))}
                  className="py-2 px-3 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white text-sm rounded-lg transition-colors"
                  disabled={isWithdrawing || parseFloat(balance) === 0}
                >
                  25%
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount((parseFloat(balance) * 0.5).toFixed(6))}
                  className="py-2 px-3 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white text-sm rounded-lg transition-colors"
                  disabled={isWithdrawing || parseFloat(balance) === 0}
                >
                  50%
                </button>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(balance)}
                  className="py-2 px-3 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white text-sm rounded-lg transition-colors"
                  disabled={isWithdrawing || parseFloat(balance) === 0}
                >
                  全部
                </button>
              </div>
            </div>

            {displayWithdrawError && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-3">
                <div className="flex items-center space-x-2 text-red-200 text-sm">
                  <span>❌</span>
                  <span>{displayWithdrawError}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isWithdrawing || !withdrawAmount || parseFloat(balance) === 0}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {isWithdrawing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>提取中...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">📤</span>
                  提取ETH
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 说明信息 */}
      <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <span className="mr-2">💡</span>
          使用说明
        </h4>
        <div className="grid md:grid-cols-2 gap-6 text-white text-sm opacity-80">
          <div>
            <h5 className="font-medium mb-2">关于存款:</h5>
            <ul className="space-y-1">
              <li>• 存款会将ETH从您的钱包转入合约</li>
              <li>• 存入的ETH可用于创建红包</li>
              <li>• 存款操作需要支付Gas费用</li>
              <li>• 建议一次性存入足够的金额</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">关于提款:</h5>
            <ul className="space-y-1">
              <li>• 提款会将ETH从合约转回您的钱包</li>
              <li>• 只能提取合约中的可用余额</li>
              <li>• 提款操作需要支付Gas费用</li>
              <li>• 锁定在红包中的ETH无法直接提取</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}