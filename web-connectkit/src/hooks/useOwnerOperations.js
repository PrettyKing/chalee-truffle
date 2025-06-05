import { useState, useEffect } from 'react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/ChaleeDApp';
import { getErrorMessage, debugLog } from '../utils/helpers';

/**
 * 所有者操作 Hook
 * 专门处理所有者权限相关的操作
 */
export function useOwnerOperations() {
  const { address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [transferConfig, setTransferConfig] = useState(null);

  // 转移到所有者配置
  const { config: transferContractConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'transferToOwner',
    enabled: !!transferConfig,
  });

  const {
    write: writeTransferToOwner,
    data: transferData,
    isLoading: isTransferring,
    error: transferError,
  } = useContractWrite(transferContractConfig);

  const {
    isLoading: isTransferPending,
    isSuccess: isTransferSuccess,
  } = useWaitForTransaction({
    hash: transferData?.hash,
  });

  // 检查是否为所有者
  const checkOwnership = (owner) => {
    if (owner && address) {
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    }
  };

  // 转移到所有者函数
  const transferToOwner = async () => {
    try {
      if (!isOwner) {
        throw new Error('只有合约所有者才能执行此操作');
      }
      
      debugLog('转移到所有者');
      setTransferConfig({ enabled: true });
      
      setTimeout(() => {
        if (writeTransferToOwner) {
          writeTransferToOwner();
        }
      }, 100);
    } catch (error) {
      console.error('转移失败:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  // 重置配置
  const resetTransferConfig = () => {
    setTransferConfig(null);
  };

  // 监听转移成功
  useEffect(() => {
    if (isTransferSuccess) {
      debugLog('转移到所有者成功');
      setTransferConfig(null);
    }
  }, [isTransferSuccess]);

  return {
    isOwner,
    transferToOwner,
    isTransferring: isTransferring || isTransferPending,
    isTransferSuccess,
    transferError,
    checkOwnership,
    resetTransferConfig,
  };
}