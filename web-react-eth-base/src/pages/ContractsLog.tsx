import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, LOGCHAIN_ABI } from '../abis/LogChain';

export const ContractsLog = () => {
  const [inputData, setInputData] = useState('');
  const [ethAmount, setEthAmount] = useState('0');

  const { address, isConnected } = useAccount();

  const {
    writeContract,
    data: writeData,
    error: writeError,
    isPending: isWriteLoading,
  } = useWriteContract();

  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({hash: writeData});

  const handleSubmit = async () => {
    if (!inputData.trim()) {
      alert('请输入要上链的数据');
      return;
    }
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }

    try {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: LOGCHAIN_ABI,
        functionName: 'storeData',
        args: [inputData],
        value: ethAmount ? parseEther(ethAmount) : undefined,
      });
    } catch (error) {
      console.error('交易失败:', error);
    }
  };
  
  const handleDirectTransfer = async () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert('请输入有效的ETH金额');
      return;
    }

    try {
      // 使用 window.ethereum 直接发送交易
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: CONTRACT_ADDRESS,
          value: '0x' + parseEther(ethAmount).toString(16),
        }],
      });
      console.log('Direct transfer transaction:', txHash);
    } catch (error) {
      console.error('Direct transfer failed:', error);
    }
  };

  useEffect(() => {
    if (isTransactionSuccess) {
      setInputData('');
      setEthAmount('0');
    }
  }, [isTransactionSuccess]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          直接转向一个合约地址 把数据上链的内容通过日志的形式再链上进行存储
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">要上链的数据</label>
            <textarea
              value={inputData}
              onChange={e => setInputData(e.target.value)}
              placeholder="输入要存储到区块链的数据..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              发送 ETH 金额 (可选)
            </label>
            <input
              type="number"
              step="0.001"
              value={ethAmount}
              onChange={e => setEthAmount(e.target.value)}
              placeholder="0.001"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isConnected || isWriteLoading || isTransactionLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
          >
            {isWriteLoading || isTransactionLoading ? '处理中...' : '上链存储'}
          </button>
        </div>

        {writeError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            交易失败: {writeError.message}
          </div>
        )}

        {isTransactionSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            交易成功! 数据已上链存储
          </div>
        )}
      </div>
    </div>
  );
};
