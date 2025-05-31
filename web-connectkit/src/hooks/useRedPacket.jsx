import { useState, useEffect } from 'react';
import { 
  useContractRead, 
  useContractWrite, 
  useWaitForTransaction,
  useAccount 
} from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { RED_PACKET_ABI, CONTRACT_ADDRESS } from '../contracts/abi';

export function useRedPacket() {
  const { address } = useAccount();
  const [currentPacketId, setCurrentPacketId] = useState(0);

  // 读取合约基本信息
  const { data: packetId, refetch: refetchPacketId } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'packetId',
    watch: true,
  });

  const { data: contractBalance, refetch: refetchBalance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'getBalance',
    watch: true,
  });

  const { data: currentPacketCount, refetch: refetchPacketCount } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'currentPacketCountOfOwner',
    watch: true,
  });

  // 读取特定红包信息
  const { data: packetInfo, refetch: refetchPacketInfo } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'getPacketInfo',
    args: currentPacketId !== null ? [BigInt(currentPacketId)] : undefined,
    enabled: currentPacketId !== null && CONTRACT_ADDRESS,
    watch: true,
  });

  // 发红包
  const { 
    write: sendRedPacket, 
    isLoading: isSending,
    data: sendData 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'sendRedPacket',
    onSuccess: () => {
      refetchPacketId();
      refetchBalance();
      refetchPacketCount();
    },
    onError: (error) => {
      console.error('发红包失败:', error);
    },
  });

  // 领红包
  const { 
    write: claimRedPacket, 
    isLoading: isClaiming,
    data: claimData 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'getRedPacket',
    onSuccess: () => {
      refetchPacketInfo();
      refetchBalance();
    },
    onError: (error) => {
      console.error('领红包失败:', error);
    },
  });

  // 存款
  const { 
    write: deposit, 
    isLoading: isDepositing 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'deposit',
    onSuccess: () => {
      refetchBalance();
    },
  });

  // 提款
  const { 
    write: withdraw, 
    isLoading: isWithdrawing 
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'withdraw',
    onSuccess: () => {
      refetchBalance();
    },
  });

  // 测试函数
  const { data: greeting } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'sayHi',
  });

  const { data: userInfo } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'getInfo',
    watch: true,
  });

  const { write: setInfo, isLoading: isSettingInfo } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: 'setInfo',
  });

  // 便捷方法
  const createRedPacket = (isEqual, count, amount) => {
    if (!sendRedPacket) return;
    
    const amountInWei = parseEther(amount.toString());
    sendRedPacket({
      args: [isEqual, count, amountInWei],
      value: amountInWei,
    });
  };

  const grabRedPacket = (packetId) => {
    if (!claimRedPacket) return;
    claimRedPacket({
      args: [BigInt(packetId)],
    });
  };

  const depositEther = (amount) => {
    if (!deposit) return;
    const amountInWei = parseEther(amount.toString());
    deposit({
      value: amountInWei,
    });
  };

  const withdrawEther = (amount) => {
    if (!withdraw) return;
    const amountInWei = parseEther(amount.toString());
    withdraw({
      args: [amountInWei],
    });
  };

  const updateUserInfo = (name, age) => {
    if (!setInfo) return;
    setInfo({
      args: [name, BigInt(age)],
    });
  };

  return {
    // 数据
    packetId: packetId ? Number(packetId) : 0,
    contractBalance: contractBalance ? formatEther(contractBalance) : '0',
    currentPacketCount: currentPacketCount ? Number(currentPacketCount) : 0,
    packetInfo,
    greeting,
    userInfo,
    currentPacketId,
    
    // 操作
    createRedPacket,
    grabRedPacket,
    depositEther,
    withdrawEther,
    updateUserInfo,
    setCurrentPacketId,
    
    // 状态
    isSending,
    isClaiming,
    isDepositing,
    isWithdrawing,
    isSettingInfo,
    
    // 刷新
    refetchAll: () => {
      refetchPacketId();
      refetchBalance();
      refetchPacketCount();
      refetchPacketInfo();
    }
  };
}

// 红包列表 hook
export function useRedPacketList() {
  const { packetId } = useRedPacket();
  const [packets, setPackets] = useState([]);
  const { address } = useAccount();

  // 获取所有红包信息
  useEffect(() => {
    if (!packetId || !CONTRACT_ADDRESS) return;

    const fetchAllPackets = async () => {
      const packetList = [];
      for (let i = 0; i < packetId; i++) {
        try {
          // 这里需要使用 wagmi 的 readContract 或其他方式读取
          // 暂时占位，实际需要实现
          packetList.push({
            id: i,
            loading: true
          });
        } catch (error) {
          console.error(`获取红包 ${i} 信息失败:`, error);
        }
      }
      setPackets(packetList);
    };

    fetchAllPackets();
  }, [packetId]);

  return {
    packets,
    totalCount: packetId || 0
  };
}
