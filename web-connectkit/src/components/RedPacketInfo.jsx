import { useState } from 'react';
import { getErrorMessage } from '../utils/helpers';

export default function RedPacketInfo({ info, onGrabRedPacket, onQueryRedPacket, isLoading, error }) {
  const [packetId, setPacketId] = useState('0');
  const [localError, setLocalError] = useState('');

  const handleQuery = async (e) => {
    e.preventDefault();
    setLocalError('');

    const id = parseInt(packetId);
    if (isNaN(id) || id < 0) {
      setLocalError('请输入有效的红包ID');
      return;
    }

    try {
      const success = await onQueryRedPacket(id);
      if (!success) {
        setLocalError('红包不存在或查询失败');
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
    ? ((info.count - info.remainingCount) / info.count) * 100 
    : 0;

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-2">红包信息</h2>
        <p className="text-white opacity-80">查询和领取红包</p>
      </div>

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
              value={packetId}
              onChange={(e) => setPacketId(e.target.value)}
              placeholder="输入红包ID"
              className="flex-1 px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
            >
              查询
            </button>
          </div>
        </div>
      </form>

      {/* 红包详情 */}
      {info ? (
        <div className="space-y-6">
          {/* 红包头部信息 */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">红包 #{info.id}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                info.isEqual 
                  ? 'bg-blue-500 bg-opacity-30 text-blue-200' 
                  : 'bg-yellow-500 bg-opacity-30 text-yellow-200'
              }`}>
                {info.isEqual ? '等额红包' : '随机红包'}
              </span>
            </div>

            {/* 状态指示器 */}
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                isFinished ? 'bg-gray-500 bg-opacity-30' :
                alreadyClaimed ? 'bg-green-500 bg-opacity-30' :
                canClaim ? 'bg-red-500 bg-opacity-30 animate-pulse' :
                'bg-yellow-500 bg-opacity-30'
              }`}>
                {isFinished ? '💸' : alreadyClaimed ? '✅' : canClaim ? '🎁' : '⏳'}
              </div>
            </div>

            {/* 红包统计 */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{info.amount}</div>
                <div className="text-white opacity-60 text-sm">总金额 (ETH)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{info.remainingAmount}</div>
                <div className="text-white opacity-60 text-sm">剩余金额 (ETH)</div>
              </div>
            </div>

            {/* 进度条 */}
            <div className="mb-4">
              <div className="flex justify-between text-white text-sm mb-2">
                <span>领取进度</span>
                <span>{info.count - info.remainingCount} / {info.count}</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* 状态信息 */}
            <div className="text-center">
              {isFinished && (
                <div className="text-gray-300 font-medium">
                  🎉 红包已被抢完
                </div>
              )}
              {alreadyClaimed && !isFinished && (
                <div className="text-green-300 font-medium">
                  ✨ 您已经领取过这个红包
                </div>
              )}
              {canClaim && (
                <div className="text-yellow-300 font-medium animate-pulse">
                  💰 可以领取红包！
                </div>
              )}
              {!canClaim && !alreadyClaimed && !isFinished && (
                <div className="text-blue-300 font-medium">
                  🔍 红包信息已加载
                </div>
              )}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="space-y-3">
            {canClaim && (
              <button
                onClick={handleGrab}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>领取中...</span>
                  </div>
                ) : (
                  <>
                    <span className="mr-2">🎁</span>
                    立即领取红包
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => onQueryRedPacket(info.id)}
              className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
            >
              🔄 刷新状态
            </button>
          </div>
        </div>
      ) : (
        /* 空状态 */
        <div className="text-center py-12">
          <div className="text-6xl mb-4 opacity-50">🎁</div>
          <p className="text-white opacity-70 mb-4">
            输入红包ID来查询红包信息
          </p>
          <p className="text-white opacity-50 text-sm">
            提示：红包ID从0开始递增
          </p>
        </div>
      )}

      {/* 错误信息 */}
      {displayError && (
        <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-4">
          <div className="flex items-center space-x-2 text-red-200">
            <span>❌</span>
            <span>{displayError}</span>
          </div>
        </div>
      )}
    </div>
  );
}