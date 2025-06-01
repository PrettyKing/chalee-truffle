import { useState } from "react";
import { parseEther } from "viem";

export default function CreateRedPacket({ onCreateRedPacket, isLoading }) {
  const [amount, setAmount] = useState("");
  const [count, setCount] = useState("");
  const [isEqual, setIsEqual] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !count) {
      alert("请填写完整信息");
      return;
    }

    try {
      onCreateRedPacket({
        args: [parseInt(count), isEqual],
        value: parseEther(amount),
      });
    } catch (error) {
      console.error("参数错误:", error);
      alert("请检查输入的参数");
    }
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 card-hover">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        🧧 创建红包
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-white font-bold mb-2">
            红包金额 (ETH)
          </label>
          <input
            type="number"
            step="0.0001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            placeholder="请输入红包总金额"
          />
        </div>
        <div>
          <label className="block text-white font-bold mb-2">红包个数</label>
          <input
            type="number"
            min="1"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:ring-2 focus:ring-white focus:ring-opacity-50"
            placeholder="请输入红包个数"
          />
        </div>
        <div>
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={isEqual}
              onChange={(e) => setIsEqual(e.target.checked)}
              className="rounded"
            />
            <span>等额红包</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary text-white py-3 rounded-lg font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "创建中..." : "🎉 创建红包"}
        </button>
      </form>
    </div>
  );
}
