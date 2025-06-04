import { useState } from 'react';
import { getErrorMessage } from '../utils/helpers';

export default function CreateRedPacket({ onCreateRedPacket, isLoading, error }) {
  const [amount, setAmount] = useState('');
  const [count, setCount] = useState(1);
  const [isEqual, setIsEqual] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!amount || parseFloat(amount) <= 0) {
      setLocalError('请输入有效的红包金额');
      return;
    }

    if (count < 1 || count > 100) {
      setLocalError('红包个数必须在1-100之间');
      return;
    }

    try {
      await onCreateRedPacket({
        amount: amount.toString(),
        count: parseInt(count),
        isEqual,
      });
      
      // 成功后清空表单
      setAmount('');
      setCount(1);
      setIsEqual(false);
    } catch (err) {
      setLocalError(getErrorMessage(err));
    }
  };

  const displayError = localError || (error ? getErrorMessage(error) : '');

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🎁</div>
        <h2 className="text-2xl font-bold text-white mb-2">创建红包</h2>
        <p className="text-white opacity-80">发送红包给朋友们</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 红包类型选择 */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            红包类型
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsEqual(false)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                !isEqual
                  ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 text-white'
                  : 'border-white border-opacity-30 text-white opacity-70 hover:opacity-100'
              }`}
            >
              <div className="text-2xl mb-1">🎲</div>
              <div className="font-medium">随机红包</div>
              <div className="text-xs opacity-80">金额随机分配</div>
            </button>
            <button
              type="button"
              onClick={() => setIsEqual(true)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isEqual
                  ? 'border-blue-400 bg-blue-400 bg-opacity-20 text-white'
                  : 'border-white border-opacity-30 text-white opacity-70 hover:opacity-100'
              }`}
            >
              <div className="text-2xl mb-1">⚖️</div>
              <div className="font-medium">等额红包</div>
              <div className="text-xs opacity-80">金额平均分配</div>
            </button>
          </div>
        </div>

        {/* 红包金额 */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            红包总金额 (ETH)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.001"
              min="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="输入红包总金额"
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-3 text-white opacity-60">
              ETH
            </div>
          </div>
        </div>

        {/* 红包个数 */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            红包个数
          </label>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setCount(Math.max(1, count - 1))}
              className="w-10 h-10 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white font-bold hover:bg-opacity-30 transition-colors"
              disabled={isLoading || count <= 1}
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
              className="flex-1 px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white text-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setCount(Math.min(100, count + 1))}
              className="w-10 h-10 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white font-bold hover:bg-opacity-30 transition-colors"
              disabled={isLoading || count >= 100}
            >
              +
            </button>
          </div>
          <p className="text-white text-xs opacity-60 mt-1">
            最多可创建 100 个红包
          </p>
        </div>

        {/* 预览信息 */}
        {amount && count && (
          <div className="bg-white bg-opacity-10 rounded-xl p-4">
            <h3 className="text-white font-medium mb-2">预览信息</h3>
            <div className="space-y-1 text-white text-sm">
              <div className="flex justify-between">
                <span>红包类型:</span>
                <span>{isEqual ? '等额红包' : '随机红包'}</span>
              </div>
              <div className="flex justify-between">
                <span>总金额:</span>
                <span>{amount} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>红包个数:</span>
                <span>{count} 个</span>
              </div>
              <div className="flex justify-between">
                <span>平均金额:</span>
                <span>{amount && count ? (parseFloat(amount) / count).toFixed(6) : '0'} ETH</span>
              </div>
            </div>
          </div>
        )}

        {/* 错误信息 */}
        {displayError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-red-200">
              <span>❌</span>
              <span>{displayError}</span>
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading || !amount || count < 1}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>创建中...</span>
            </div>
          ) : (
            <>
              <span className="mr-2">🎁</span>
              创建红包
            </>
          )}
        </button>
      </form>
    </div>
  );
}