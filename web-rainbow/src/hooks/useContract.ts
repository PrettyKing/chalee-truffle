import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../abi';
import { parseEther, formatEther } from 'viem';

// Hook for reading contract balance
export const useContractBalance = () => {
    return useContractRead({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getBalance',
        watch: true,
    });
};

// Hook for reading contract owner
export const useContractOwner = () => {
    return useContractRead({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'owner',
    });
};

// Hook for reading current packet ID
export const useCurrentPacketId = () => {
    return useContractRead({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'packetId',
        watch: true,
    });
};

// Hook for reading user info
export const useUserInfo = () => {
    return useContractRead({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getInfo',
    });
};

// Hook for reading packet info
export const usePacketInfo = (packetId: number | undefined) => {
    return useContractRead({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getPacketInfo',
        args: packetId ? [BigInt(packetId)] : undefined,
        enabled: !!packetId,
    });
};

// Hook for checking if user has claimed a packet
export const useHasClaimedPacket = (packetId: number | undefined, userAddress: string | undefined) => {
    return useContractRead({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'hasClaimedPacket',
        args: packetId && userAddress ? [BigInt(packetId), userAddress as `0x${string}`] : undefined,
        enabled: !!(packetId && userAddress),
    });
};

// Hook for depositing ETH
export const useDeposit = () => {
    const { config } = usePrepareContractWrite({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'deposit',
    });

    const { data, write, isLoading: isWriteLoading } = useContractWrite(config);

    const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
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
    const { config, error: prepareError } = usePrepareContractWrite({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'setInfo',
    });

    const { data, write, isLoading: isWriteLoading, error: writeError } = useContractWrite(config);

    const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
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
    const { config, error: prepareError } = usePrepareContractWrite({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'sendRedPacket',
    });

    const { data, write, isLoading: isWriteLoading, error: writeError } = useContractWrite(config);

    const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
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
    const { config, error: prepareError } = usePrepareContractWrite({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'getRedPacket',
    });

    const { data, write, isLoading: isWriteLoading, error: writeError } = useContractWrite(config);

    const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
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
    const { config, error: prepareError } = usePrepareContractWrite({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'withdraw',
    });

    const { data, write, isLoading: isWriteLoading, error: writeError } = useContractWrite(config);

    const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransaction({
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