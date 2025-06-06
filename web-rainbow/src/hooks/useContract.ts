import { useReadContract, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../abi';

// Hook for reading contract balance
export const useContractBalance = () => {
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getBalance'
  });
};

// Hook for reading contract owner
export const useContractOwner = () => {
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });
};

// Hook for reading current packet ID
export const useCurrentPacketId = () => {
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'packetId',
  });
};

// Hook for reading user info
export const useUserInfo = () => {
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getInfo',
  });
};

// Hook for reading packet info
export const usePacketInfo = (packetId?: number | bigint | string) => {
  const enabled = packetId !== undefined && packetId !== null;
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getPacketInfo',
    args: enabled ? [typeof packetId === 'bigint' ? packetId : BigInt(packetId!)] : undefined,
  });
};

// Hook for checking if user has claimed a packet
export const useHasClaimedPacket = (
  packetId?: number | bigint | string,
  userAddress?: string
) => {
  const enabled = !!(packetId && userAddress);
  return useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'hasClaimedPacket',
    args: enabled
      ? [
        typeof packetId === 'bigint' ? packetId : BigInt(packetId!),
        userAddress as `0x${string}`,
      ]
      : undefined,
  });
};

// Hook for depositing ETH
export const useDeposit = () => {
  const { config }: any = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'deposit',
  });

  const { data, write, isLoading: isWriteLoading }: any = useWriteContract(config ?? {});

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    deposit: write,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    transactionHash: data?.hash,
  };
};

// Hook for setting user info
export const useSetInfo = () => {
  const { config, error: prepareError }: any = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'setInfo',
  });

  const { data, write, isLoading: isWriteLoading, error: writeError }: any = useWriteContract(config ?? {});

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    setInfo: write,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error: prepareError || writeError,
    transactionHash: data?.hash,
  };
};

// Hook for creating red packet
export const useSendRedPacket = () => {
  const { config, error: prepareError }: any = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'sendRedPacket',
  });

  const { data, write, isLoading: isWriteLoading, error: writeError }: any = useWriteContract(config ?? {});

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    sendRedPacket: write,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error: prepareError || writeError,
    transactionHash: data?.hash,
  };
};

// Hook for claiming red packet
export const useGetRedPacket = () => {
  const { config, error: prepareError }: any = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getRedPacket',
  });

  const { data, write, isLoading: isWriteLoading, error: writeError }: any = useWriteContract(config ?? {});

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    getRedPacket: write,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error: prepareError || writeError,
    transactionHash: data?.hash,
  };
};

// Hook for withdrawing (owner only)
export const useWithdraw = () => {
  const { config, error: prepareError }: any = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'withdraw',
  });

  const { data, write, isLoading: isWriteLoading, error: writeError }: any = useWriteContract(config ?? {});

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: data?.hash,
  });

  return {
    withdraw: write,
    isLoading: isWriteLoading || isTransactionLoading,
    isSuccess,
    error: prepareError || writeError,
    transactionHash: data?.hash,
  };
};
