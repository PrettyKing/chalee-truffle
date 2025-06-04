import { useState } from 'react';
import { getErrorMessage } from '../utils/helpers';

export default function UserInfoManager({ userInfo, onSetUserInfo, isLoading, error }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name.trim()) {
      setLocalError('请输入姓名');
      return;
    }

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum) || ageNum < 0) {
      setLocalError('请输入有效的年龄');
      return;
    }

    try {
      await onSetUserInfo(name.trim(), ageNum);
      // 成功后清空表单
      setName('');
      setAge('');
    } catch (err) {
      setLocalError(getErrorMessage(err));
    }
  };

  const displayError = localError || (error ? getErrorMessage(error) : '');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">👤</div>
          <h2 className="text-3xl font-bold text-white mb-2">个人信息管理</h2>
          <p className="text-white opacity-80">设置和查看您的个人信息</p>
        </div>

        {/* 当前信息显示 */}
        {userInfo.name && (
          <div className="bg-white bg-opacity-10 rounded-2xl p-6 mb-8">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <span className="mr-2">📋</span>
              当前信息
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white opacity-70">姓名:</span>
                <span className="text-white font-medium">{userInfo.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white opacity-70">年龄:</span>
                <span className="text-white font-medium">{userInfo.age} 岁</span>
              </div>
            </div>
          </div>
        )}

        {/* 设置信息表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              姓名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入您的姓名"
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              年龄
            </label>
            <input
              type="number"
              min="0"
              max="150"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="请输入您的年龄"
              className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

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
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading || !name.trim() || !age}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>设置中...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">💾</span>
                  设置信息
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setName('');
                setAge('');
                setLocalError('');
              }}
              className="px-6 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white font-medium rounded-xl transition-all duration-200"
              disabled={isLoading}
            >
              <span className="mr-2">🗑️</span>
              清空
            </button>
          </div>
        </form>

        {/* 说明信息 */}
        <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-4">
          <h4 className="text-white font-medium mb-2 flex items-center">
            <span className="mr-2">💡</span>
            使用说明
          </h4>
          <ul className="text-white text-sm opacity-80 space-y-1">
            <li>• 您可以随时更新个人信息</li>
            <li>• 信息将存储在区块链上，具有不可篡改性</li>
            <li>• 更新信息需要支付少量 Gas 费用</li>
            <li>• 所有信息都是公开可见的</li>
          </ul>
        </div>
      </div>
    </div>
  );
}