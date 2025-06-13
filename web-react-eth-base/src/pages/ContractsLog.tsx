import { useState, useEffect } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useBalance,
} from 'wagmi';
import { parseEther } from 'viem';
import { CONTRACT_ADDRESS, LOGCHAIN_ABI } from '../abis/LogChain';

export const ContractsLog = () => {
  const [inputData, setInputData] = useState('');
  const [ethAmount, setEthAmount] = useState('0');
  const [logs, setLogs] = useState([]);
  const [contractAddress, setContractAddress] = useState<`0x${string}`>(CONTRACT_ADDRESS);

  const { address, isConnected } = useAccount();


  // 获取合约中的数据数量
  const { data: dataCount, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi: LOGCHAIN_ABI,
    functionName: 'getDataCount',
    query: {
      enabled: isConnected && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // 获取所有数据
  const { data: allData, refetch: refetchAllData }: any = useReadContract({
    address: contractAddress,
    abi: LOGCHAIN_ABI,
    functionName: 'getAllData',
    query: {
      enabled: isConnected && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

  // 写入合约
  const {
    writeContract,
    data: writeData,
    error: writeError,
    isPending: isWriteLoading,
  } = useWriteContract();

  // 等待交易确认
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransactionReceipt({
      hash: writeData,
    });

  // 监听合约事件
  useWatchContractEvent({
    address: contractAddress,
    abi: LOGCHAIN_ABI,
    eventName: 'DataReceived',
    // @ts-ignore
    listener: logs => {
      console.log('New DataReceived event:', logs);
      //@ts-ignore
      setLogs(prev => [...prev, ...logs]);
      // 刷新数据
      refetchCount();
      refetchAllData();
    },
    enabled: isConnected && contractAddress !== '0x0000000000000000000000000000000000000000',
  });

  // 处理数据提交
  const handleSubmit = async () => {
    if (!inputData.trim()) {
      alert('请输入要上链的数据');
      return;
    }
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    if (contractAddress === '0x0000000000000000000000000000000000000000') {
      alert('请设置正确的合约地址');
      return;
    }

    try {
      writeContract({
        address: contractAddress,
        abi: LOGCHAIN_ABI,
        functionName: 'storeData',
        args: [inputData],
        value: ethAmount ? parseEther(ethAmount) : undefined,
      });
    } catch (error) {
      console.error('交易失败:', error);
    }
  };

  // 直接转账到合约（触发receive函数）
  const handleDirectTransfer = async () => {
    if (!isConnected) {
      alert('请先连接钱包');
      return;
    }
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      alert('请输入有效的ETH金额');
      return;
    }
    if (contractAddress === '0x0000000000000000000000000000000000000000') {
      alert('请设置正确的合约地址');
      return;
    }

    try {
      // 使用 window.ethereum 直接发送交易
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: address,
            to: contractAddress,
            value: '0x' + parseEther(ethAmount).toString(16),
          },
        ],
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
      // 刷新数据
      setTimeout(() => {
        refetchCount();
        refetchAllData();
      }, 2000);
    }
  }, [isTransactionSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          {/* 数据上链表单 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">方法1: 调用 storeData 函数</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    要上链的数据
                  </label>
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
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">方法2: 直接转账 (触发 receive)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    转账金额 (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={ethAmount}
                    onChange={e => setEthAmount(e.target.value)}
                    placeholder="0.001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  直接向合约转账会触发 receive 函数，自动存储 "ETH received" 消息
                </p>
                <button
                  onClick={handleDirectTransfer}
                  disabled={!isConnected}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
                >
                  直接转账
                </button>
              </div>
            </div>
          </div>

          {/* 交易状态 */}
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

          {/* 链上数据展示 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">链上存储的数据</h2>
              <div className="text-sm text-gray-600">
                总计: {dataCount ? dataCount.toString() : '0'} 条记录
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {allData && allData.length > 0 ? (
                allData.map((item: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">#{index + 1}</span>
                      <span className="text-xs text-gray-500">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="mt-1 text-gray-800">{item}</div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">暂无数据，请先上链存储一些内容</div>
              )}
            </div>
          </div>

          {/* 实时事件日志 */}
          {logs.length > 0 && (
            <div className="mt-6 bg-indigo-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3">实时事件日志</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {logs.slice(-5).map((log: any, index: number) => (
                  <div key={index} className="bg-white p-2 rounded text-sm">
                    <div className="font-medium">DataReceived 事件</div>
                    <div className="text-gray-600">数据: {log.args?.data}</div>
                    <div className="text-gray-500 text-xs">发送者: {log.args?.sender}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
