import { useWriteContract } from 'wagmi';
import { LogChainAbi, CONTRACTS } from '../abis/LogChain';
import { parseEther } from 'viem';
import { useState } from 'react';

interface DataReceivedEvent {
  data: string;
  sender: string;
  value: bigint;
  transactionHash?: string;
  blockNumber?: bigint;
}

interface LogEvent {
  data: string;
  transactionHash?: string;
  blockNumber?: bigint;
}

export const ContractsLog: React.FC = () => {
  const { writeContract, data: writeHash, isPending, error: writeError } = useWriteContract();
  const [inputData, setInputData] = useState('');

  const handleFunctionStore = async (inputData: string, ethAmount: string = '0.001') => {
    try {
      writeContract({
        address: CONTRACTS,
        abi: LogChainAbi,
        functionName: 'storeData',
        args: [inputData],
        value: parseEther(ethAmount),
      });
    } catch (err) {
      console.error('Error storing via function:', err);
      throw err;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">输入数据:</label>
          <input
            type="text"
            value={inputData}
            onChange={e => setInputData(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="输入要上链的数据..."
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => handleFunctionStore}
          disabled={isPending || !inputData.trim()}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {isPending ? '处理中...' : '直接调用合约'}
        </button>
      </div>
    </div>
  );
};
