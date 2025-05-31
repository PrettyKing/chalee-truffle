import React, { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { CONTRACT_ADDRESS } from '../contracts/abi';

export default function ContractInfo({ redPacketData }) {
  const { address } = useAccount();
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');

  // 获取用户ETH余额
  const { data: userBalance } = useBalance({
    address: address,
  });

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('请输入有效的存款金额');
      return;
    }
    redPacketData.depositEther(depositAmount);
    setDepositAmount('');
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      alert('请输入有效的提款金额');
      return;
    }
    if (parseFloat(withdrawAmount) > parseFloat(redPacketData.contractBalance)) {
      alert('提款金额超过合约余额');
      return;
    }
    redPacketData.withdrawEther(withdrawAmount);
    setWithdrawAmount('');
  };

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    if (!userName.trim() || !userAge || parseInt(userAge) <= 0) {
      alert('请输入有效的姓名和年龄');
      return;
    }
    redPacketData.updateUserInfo(userName.trim(), parseInt(userAge));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">合约管理</h2>
        <p className="text-white opacity-75">
          管理合约账户和个人信息
        </p>
      </div>

      {/* 合约基本信息 */}
      <div className="bg-white bg-opacity-20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📊 合约信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white opacity-75">合约地址:</span>
              <span className="text-white font-mono text-sm">
                {CONTRACT_ADDRESS ? `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white opacity-75">合约余额:</span>
              <span className="text-white font-bold">{redPacketData.contractBalance} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white opacity-75">总红包数:</span>
              <span className="text-white font-bold">{redPacketData.packetId}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white opacity-75">您的红包数:</span>
              <span className="text-white font-bold">{redPacketData.currentPacketCount}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white opacity-75">您的ETH余额:</span>
              <span className="text-white font-bold">
                {userBalance ? parseFloat(userBalance.formatted).toFixed(4) : '0'} ETH
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white opacity-75">合约状态:</span>
              <span className="text-green-400 font-bold">✅ 正常</span>
            </div>
          </div>
        </div>
      </div>

      {/* 账户操作 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 存款 */}
        <div className="bg-white bg-opacity-20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">💰 存款到合约</h3>
          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                存款金额 (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="0.1"
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-green-400"
              />
            </div>
            <button
              type="submit"
              disabled={redPacketData.isDepositing || !depositAmount}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {redPacketData.isDepositing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  存款中...
                </div>
              ) : (
                '💰 存款'
              )}
            </button>
          </form>
        </div>

        {/* 提款 */}
        <div className="bg-white bg-opacity-20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">💸 从合约提款</h3>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                提款金额 (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                max={redPacketData.contractBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.1"
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-blue-400"
              />
              <div className="text-white text-xs opacity-75 mt-1">
                最大可提款: {redPacketData.contractBalance} ETH
              </div>
            </div>
            <button
              type="submit"
              disabled={redPacketData.isWithdrawing || !withdrawAmount}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {redPacketData.isWithdrawing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  提款中...
                </div>
              ) : (
                '💸 提款'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 用户信息管理 */}
      <div className="bg-white bg-opacity-20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">👤 个人信息</h3>
        
        {/* 当前信息显示 */}
        {redPacketData.userInfo && (
          <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4">
            <div className="text-white">
              <div><strong>当前姓名:</strong> {redPacketData.userInfo[0] || '未设置'}</div>
              <div><strong>当前年龄:</strong> {redPacketData.userInfo[1] ? Number(redPacketData.userInfo[1]) : '未设置'}</div>
            </div>
          </div>
        )}

        {/* 更新信息表单 */}
        <form onSubmit={handleUpdateInfo} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                姓名
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="输入您的姓名"
                maxLength={50}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-purple-400"
              />
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                年龄
              </label>
              <input
                type="number"
                min="1"
                max="150"
                value={userAge}
                onChange={(e) => setUserAge(e.target.value)}
                placeholder="输入您的年龄"
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-50 focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={redPacketData.isSettingInfo || !userName.trim() || !userAge}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {redPacketData.isSettingInfo ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                更新中...
              </div>
            ) : (
              '👤 更新信息'
            )}
          </button>
        </form>
      </div>

      {/* 测试功能 */}
      <div className="bg-white bg-opacity-20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🧪 测试功能</h3>
        <div className="space-y-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-white">
              <strong>合约问候:</strong> {redPacketData.greeting || '加载中...'}
            </div>
          </div>
          
          <button
            onClick={redPacketData.refetchAll}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            🔄 刷新所有数据
          </button>
        </div>
      </div>

      {/* 重要提示 */}
      <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-4">
        <div className="text-red-200 text-sm space-y-1">
          <div>⚠️ <strong>重要提示:</strong></div>
          <div>• 存款操作将从您的钱包扣除ETH到合约</div>
          <div>• 提款操作将从合约转ETH到您的钱包</div>
          <div>• 请确保有足够的Gas费用进行交易</div>
          <div>• 个人信息存储在区块链上，请谨慎填写</div>
          <div>• 所有操作都是不可逆的，请仔细确认</div>
        </div>
      </div>
    </div>
  );
}
