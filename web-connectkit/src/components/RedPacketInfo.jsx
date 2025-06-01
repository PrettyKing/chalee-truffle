import { formatEther } from 'viem';

export default function RedPacketInfo({ info, onGrabRedPacket, isLoading }) {
  if (!info || !info[4]) { // info[4] is initialized
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 card-hover text-center">
        <div className="text-6xl mb-4">🧧</div>
        <p className="text-white text-lg">暂无红包，快来创建一个吧！</p>
      </div>
    );
  }

  const [creator, remaining, remainingCount, equalDistribution] = info;
  const remainingCountNum = Number(remainingCount);

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 card-hover">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">🧧 红包详情</h2>
      <div className="space-y-4 text-white">
        <div className="flex justify-between">
          <span>创建者:</span>
          <span className="font-mono text-sm">{creator?.slice(0, 6)}...{creator?.slice(-4)}</span>
        </div>
        <div className="flex justify-between">
          <span>剩余金额:</span>
          <span className="font-bold">{formatEther(remaining || 0n)} ETH</span>
        </div>
        <div className="flex justify-between">
          <span>剩余个数:</span>
          <span className="font-bold">{remainingCountNum}</span>
        </div>
        <div className="flex justify-between">
          <span>分配方式:</span>
          <span>{equalDistribution ? '等额' : '随机'}</span>
        </div>
      </div>
      
      {remainingCountNum > 0 && (
        <button
          onClick={onGrabRedPacket}
          disabled={isLoading}
          className="w-full btn-secondary text-white py-3 rounded-lg font-bold shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '抢夺中...' : '🎁 抢红包'}
        </button>
      )}
      
      {remainingCountNum === 0 && (
        <div className="text-center mt-6">
          <div className="text-4xl mb-2">🎊</div>
          <p className="text-white font-bold">红包已抢完！</p>
        </div>
      )}
    </div>
  );
}