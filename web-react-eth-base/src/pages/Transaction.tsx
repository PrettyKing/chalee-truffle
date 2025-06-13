import { useSendTransaction, useAccount, useBalance, useTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { useState } from 'react';

export interface ITxParams {
  to: `0x${string}`;
  value?: bigint;
  data?: `0x${string}`;
}

export const Transaction: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SendTransaction />
    </div>
  );
};

function SendTransaction() {
  const { address } = useAccount();
  const { sendTransactionAsync, isPending } = useSendTransaction();
  const [hex, setHex] = useState<`0x${string}` | undefined>(undefined);

  const [inputHex, setInputHex] = useState<`0x${string}` | undefined>(undefined);
  const [parseHex, setParseHex] = useState<string>('');

  const { isLoading: isReceiptLoading, data: receiptData } = useTransactionReceipt({ hash: hex });

  const onsubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address) {
      alert('请先连接钱包！');
      return;
    }
    const formData = new FormData(event.currentTarget);
    const recipient = formData.get('recipient') as `0x${string}`;
    const amount = formData.get('amount') as string;
    const data = formData.get('data') as `0x${string}` | undefined;
    const parsedAmount = parseEther(amount || '0');
    try {
      const txParams: ITxParams = {
        to: recipient || '0x0000000000000000000000000000000000000000',
        value: parsedAmount,
      };
      if (data && data.trim()) {
        txParams.data = stringToHex(data.trim() as string);
      }
      console.log('Transaction parameters:', txParams);
      const tx = await sendTransactionAsync(txParams);
      setHex(tx as `0x${string}`);
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('交易失败，请检查输入信息。');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">直接像zeroaddress转向0eth gas费方式数据上链</h2>
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
            disabled={true}
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
            disabled={true}
            defaultValue={0}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
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
          disabled={isPending || isReceiptLoading}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md focus:outline-none ${
            isPending || isReceiptLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPending || isReceiptLoading ? '发送中...' : '发送交易'}
        </button>
        {isReceiptLoading ? (
          <p className="mt-4 text-gray-500">正在等待交易确认...</p>
        ) : receiptData ? (
          <p className="mt-4 text-green-600">
            交易已确认！交易哈希:{' '}
            <a
              href={`https://sepolia.etherscan.io/tx/${hex}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {hex}
            </a>
          </p>
        ) : (
          <p className="mt-4 text-gray-500">{hex ? `交易哈希: ${hex}` : ''}</p>
        )}
      </form>
      <div className="mt-4">
        <input
          type="text"
          value={inputHex}
          onChange={e => setInputHex(e.target.value as `0x${string}`)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入十六进制数据 (0x...)"
        />
        <button
          onClick={() => {
            if (inputHex) {
              setParseHex(hexToString(inputHex));
            }
          }}
          className="mt-2 w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md focus:outline-none hover:bg-green-700"
          disabled={!inputHex}
        >
          解析十六进制数据
        </button>
        {parseHex && (
          <div className="mt-2 p-4 bg-gray-100 rounded-md">
            <h3 className="text-sm font-semibold mb-2">解析结果:</h3>
            <p className="text-gray-700">{parseHex}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 字符串转十六进制
const stringToHex = (str: string): `0x${string}` => {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `0x${hex}`;
};
// // 十六进制转字符串
function hexToString(hex: `0x${string}`): string {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
  const bytes = new Uint8Array(
    cleanHex.match(/.{1,2}/g)?.map((byte:any) => parseInt(byte, 16)) || []
  );
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
}
