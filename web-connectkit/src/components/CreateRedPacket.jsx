import React, { useState } from 'react';

export default function CreateRedPacket({ redPacketData }) {
  const [isEqual, setIsEqual] = useState(true);
  const [count, setCount] = useState(5);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('恭喜发财，大吉大利！');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('请输入有效的红包金额');
      return;
    }
    
    if (count < 1 || count > 100) {
      alert('红包数量必须在1-100之间');
      return;
    }

    redPacketData.createRedPacket(isEqual, count, amount);
  };

  const canCreate = redPacketData.currentPacketCount < 10;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">发红包</h2>
        <p className="text-white opacity-75">
          创建一个新的红包分享给朋友们
        </p>
      </div>

      {!canCreate && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4">
          <p className="text-red-200 text-center">
            您已达到最大红包数量限制 (10个)
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 红包类型 */}
        <div>
          <label className="block text-white text-sm font-medium mb-3">
            红包类型
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsEqual(true)}
              className={`p-4 rounded-lg border-2 transition-all ${
                isEqual
                  ? 'border-yellow-400 bg-yellow-400 bg-opacity-20'
                  : 'border-white border-opacity-30 bg-white bg-opacity-10'
              }`}
            >
              <div className="text-2xl mb-2">💰</div>
              <div className="text-white font-medium">等额红包</div>
              <div className="text-white text-sm opacity-75">
                每个红包金额相等
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setIsEqual(false)}
              className={`p-4 rounded-lg border-2 transition-all ${
                !isEqual
                  ? 'border-yellow-400 bg-yellow-400 bg-opacity-20'
                  : 'border-white border-opacity-30 bg-white bg-opacity-10'
              }`}
            >
              <div className="text-2xl mb-2">🎲</div>
              <div className="text-white font-medium">随机红包</div>
              <div className="text-white text-sm opacity-75">
                随机分配红包金额
              </div>
            </button>
          </div>
        </div>

        {/* 红包数量 */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            红包数量 (1-100)
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-yellow-400"
            disabled={!canCreate}
          />
        </div>

        {/* 总金额 */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            总金额 (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.1"
            className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-yellow-400"
            disabled={!canCreate}
          />
          {amount && count && (
            <div className="mt-2 text-white text-sm opacity-75">
              {isEqual 
                ? `每个红包: ${(parseFloat(amount) / count).toFixed(6)} ETH`
                : `随机分配总额: ${amount} ETH`
              }
            </div>
          )}
        </div>

        {/* 祝福语 */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            祝福语
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={100}
            className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-yellow-400 resize-none"
            rows={3}
            placeholder="写下您的祝福..."
            disabled={!canCreate}
          />
          <div className="text-right text-white text-xs opacity-50 mt-1">
            {message.length}/100
          </div>
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={!canCreate || redPacketData.isSending || !amount}
          className="w-full bg-gradient-to-r from-red-500 to-yellow-500 text-white font-bold py-4 px-6 rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {redPacketData.isSending ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              发送中...
            </div>
          ) : (
            `🧧 发红包 (${amount || '0'} ETH)`
          )}
        </button>
      </form>

      {/* 提示信息 */}
      <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-4">
        <div className="text-blue-200 text-sm space-y-1">
          <div>💡 <strong>温馨提示:</strong></div>
          <div>• 等额红包：每个红包金额相等，适合公平分配</div>
          <div>• 随机红包：采用公平算法随机分配，更有趣味性</div>
          <div>• 您最多可以同时创建10个红包</div>
          <div>• 红包金额会从您的账户中扣除</div>
        </div>
      </div>
    </div>
  );
}
