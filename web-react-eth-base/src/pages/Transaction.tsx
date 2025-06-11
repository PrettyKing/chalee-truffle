import { useSendTransaction, useAccount, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
// 向0地址转装、向合约转账
export const Transaction: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SendTransaction />
    </div>
  );
};

function SendTransaction() {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { sendTransactionAsync } = useSendTransaction();

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const recipient = formData.get('recipient') as `0x${string}`;
    const amount = formData.get('amount') as string;
    const data = formData.get('data') as `0x${string}` | undefined;
    const parsedAmount = parseEther(amount);
    try {
      const tx = await sendTransactionAsync({
        to: recipient,
        value: parsedAmount,
        ...(data ? { data: stringToHex(data) } : {}),
      });
      console.log('Transaction sent:', tx);
      // setTransitionHex(tx);
      console.log('Transaction receipt:', data);

    } catch (error) {
      console.error('Transaction failed:', error);
      alert('交易失败，请检查输入信息。');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">发送以太币</h2>
      <p className="text-gray-600 mb-4">
        当前余额: {balance ? formatEther(balance.value) : '加载中...'} ETH
      </p>
      <form onSubmit={onsubmit}>
        <div className="mb-4">
          <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-2">
            收款地址
          </label>
          <input
            type="text"
            id="recipient"
            name="recipient"
            required
            defaultValue={'0x0000000000000000000000000000000000000000'}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0x..."
          />
        </div>
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
            金额 (ETH)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            required
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0.01"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
            附加数据 (可选)
          </label>
          <textarea
            id="data"
            name="data"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="附加数据..."
          ></textarea>
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md transition-colors duration-200`}
        >
          发送交易
        </button>
      </form>
    </div>
  );
}

// 字符串转十六进制
function stringToHex(str: string): `0x${string}` {
  const hex = Array.from(str)
    .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
  return ('0x' + hex) as `0x${string}`; // 确保返回类型符合 `0x` 前缀的十六进制字符串格式
}
