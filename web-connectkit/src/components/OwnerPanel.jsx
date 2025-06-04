import { getErrorMessage } from '../utils/helpers';

export default function OwnerPanel({ 
  onTransferToOwner, 
  isTransferring, 
  transferError, 
  contractBalance, 
  onRefresh 
}) {
  const handleTransfer = async () => {
    try {
      await onTransferToOwner();
    } catch (err) {
      console.error('转移失败:', err);
    }
  };

  const displayError = transferError ? getErrorMessage(transferError) : '';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏆</div>
          <h2 className="text-3xl font-bold text-white mb-2">所有者管理面板</h2>
          <p className="text-white opacity-80">合约所有者专用功能</p>
        </div>

        {/* 权限提示 */}
        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-50 rounded-xl p-4 mb-8">
          <div className="flex items-center space-x-2 text-yellow-200">
            <span>⚠️</span>
            <span className="font-medium">您拥有合约的完全控制权</span>
          </div>
        </div>

        {/* 合约状态 */}
        <div className="bg-white bg-opacity-10 rounded-2xl p-6 mb-8">
          <h3 className="text-white font-medium mb-4 flex items-center">
            <span className="mr-2">📊</span>
            合约状态
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white opacity-70">合约余额:</span>
              <span className="text-white font-medium">{contractBalance} ETH</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white opacity-70">可转移余额:</span>
              <span className="text-white font-medium">{contractBalance} ETH</span>
            </div>
          </div>
        </div>

        {/* 所有者操作 */}
        <div className="space-y-6">
          {/* 转移资金 */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <span className="mr-2">💸</span>
              转移合约资金
            </h3>
            <p className="text-white opacity-70 text-sm mb-4">
              将合约中的所有可用余额转移到所有者账户
            </p>
            
            {parseFloat(contractBalance) > 0 ? (
              <button
                onClick={handleTransfer}
                disabled={isTransferring}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg"
              >
                {isTransferring ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>转移中...</span>
                  </div>
                ) : (
                  <>
                    <span className="mr-2">💸</span>
                    转移 {contractBalance} ETH 到所有者账户
                  </>
                )}
              </button>
            ) : (
              <div className="text-center py-4">
                <div className="text-white opacity-60">
                  合约暂无可转移余额
                </div>
              </div>
            )}
          </div>

          {/* 其他管理功能 */}
          <div className="bg-white bg-opacity-10 rounded-2xl p-6">
            <h3 className="text-white font-medium mb-4 flex items-center">
              <span className="mr-2">🔧</span>
              管理功能
            </h3>
            <div className="space-y-3">
              <button
                onClick={onRefresh}
                className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 border border-white border-opacity-30 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
              >
                🔄 刷新合约数据
              </button>
              
              <button
                disabled
                className="w-full bg-gray-500 bg-opacity-30 text-gray-300 font-medium py-3 px-6 rounded-xl cursor-not-allowed"
                title="功能开发中"
              >
                🔧 重置红包计数器 (开发中)
              </button>
            </div>
          </div>
        </div>

        {/* 错误信息 */}
        {displayError && (
          <div className="mt-6 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-red-200">
              <span>❌</span>
              <span>{displayError}</span>
            </div>
          </div>
        )}

        {/* 使用说明 */}
        <div className="mt-8 bg-white bg-opacity-10 rounded-xl p-6">
          <h4 className="text-white font-medium mb-3 flex items-center">
            <span className="mr-2">💡</span>
            使用说明
          </h4>
          <ul className="text-white text-sm opacity-80 space-y-2">
            <li>• <strong>转移资金:</strong> 将合约中的所有可用余额转移到所有者账户</li>
            <li>• <strong>权限控制:</strong> 只有合约所有者才能执行这些操作</li>
            <li>• <strong>Gas费用:</strong> 所有操作都需要支付Gas费用</li>
            <li>• <strong>安全提示:</strong> 请谨慎使用所有者权限，避免误操作</li>
          </ul>
        </div>

        {/* 安全警告 */}
        <div className="mt-6 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-4">
          <div className="flex items-start space-x-2 text-red-200">
            <span className="mt-0.5">🚨</span>
            <div>
              <div className="font-medium mb-1">安全警告</div>
              <div className="text-sm opacity-90">
                作为合约所有者，您拥有强大的权限。请确保：
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>只在安全的网络环境下操作</li>
                  <li>仔细确认每个操作的参数</li>
                  <li>定期备份您的私钥</li>
                  <li>不要与他人分享所有者权限</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}