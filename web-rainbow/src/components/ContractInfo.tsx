import { useAccount, useBalance } from 'wagmi';
import { useContractBalance, useContractOwner, useCurrentPacketId } from '../hooks/useContract';
import { CONTRACT_ADDRESS } from '../abi';
import { formatEther } from 'viem';
import styles from '../styles/ContractInfo.module.css';

export const ContractInfo: React.FC = () => {
  const { address } = useAccount();
  const { data: userBalance } = useBalance({ address });
  const { data: contractBalance, isLoading: isLoadingBalance } = useContractBalance();
  const { data: owner } = useContractOwner();
  const { data: currentPacketId } = useCurrentPacketId();

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  return (
    <div className={styles.container}>
      <h2>合约信息</h2>
      
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <h3>基本信息</h3>
          <div className={styles.infoItem}>
            <span className={styles.label}>合约地址:</span>
            <span className={styles.value} title={CONTRACT_ADDRESS}>
              {`${CONTRACT_ADDRESS.slice(0, 8)}...${CONTRACT_ADDRESS.slice(-6)}`}
            </span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.label}>合约拥有者:</span>
            <span className={styles.value} title={owner}>
              {owner ? `${owner.slice(0, 8)}...${owner.slice(-6)}` : '加载中...'}
              {isOwner && <span className={styles.ownerBadge}>（您）</span>}
            </span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.label}>当前红包ID:</span>
            <span className={styles.value}>
              {currentPacketId ? currentPacketId.toString() : '0'}
            </span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h3>余额信息</h3>
          <div className={styles.infoItem}>
            <span className={styles.label}>您的余额:</span>
            <span className={styles.value}>
              {userBalance ? `${parseFloat(formatEther(userBalance.value)).toFixed(4)} ETH` : '未连接'}
            </span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.label}>合约余额:</span>
            <span className={styles.value}>
              {isLoadingBalance ? '加载中...' : 
                contractBalance ? `${parseFloat(formatEther(contractBalance)).toFixed(4)} ETH` : '0 ETH'
              }
            </span>
          </div>
        </div>

        {isOwner && (
          <div className={styles.infoCard}>
            <h3>管理员功能</h3>
            <div className={styles.adminNote}>
              作为合约拥有者，您可以使用管理员功能
            </div>
          </div>
        )}
      </div>

      <div className={styles.networkInfo}>
        <h3>网络信息</h3>
        <div className={styles.infoItem}>
          <span className={styles.label}>当前网络:</span>
          <span className={styles.value}>
            {/* This would show the current network name */}
            以太坊
          </span>
        </div>
      </div>
    </div>
  );
};