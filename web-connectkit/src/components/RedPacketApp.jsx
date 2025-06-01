import { useAccount } from 'wagmi';
import WalletConnect from './WalletConnect';
import CreateRedPacket from './CreateRedPacket';
import RedPacketInfo from './RedPacketInfo';
import { useRedPacket } from '../hooks/useRedPacket';

export default function RedPacketApp() {
  const { isConnected } = useAccount();
  const {
    redPacketInfo,
    createRedPacket,
    grabRedPacket,
    isCreating,
    isGrabbing
  } = useRedPacket();

  const handleCreateRedPacket = (config) => {
    createRedPacket?.(config);
  };

  const handleGrabRedPacket = () => {
    grabRedPacket?.();
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🧧 区块链红包 DApp</h1>
          <p className="text-white text-lg opacity-90">基于以太坊的去中心化红包应用</p>
        </div>

        <WalletConnect />

        {isConnected && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <CreateRedPacket 
              onCreateRedPacket={handleCreateRedPacket} 
              isLoading={isCreating} 
            />
            <RedPacketInfo 
              info={redPacketInfo} 
              onGrabRedPacket={handleGrabRedPacket} 
              isLoading={isGrabbing} 
            />
          </div>
        )}

        {!isConnected && (
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 inline-block">
              <div className="text-6xl mb-4">🔗</div>
              <p className="text-white text-lg">请先连接钱包开始使用</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}