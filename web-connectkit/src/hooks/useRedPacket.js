import { useState, useEffect, useCallback } from 'react';
import { 
  useAccount, 
  useReadContract, 
  useWriteContract, 
  useWaitForTransactionReceipt 
} from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/ChaleeDApp';
import { parseEth, formatEth, getErrorMessage, validateRedPacketParams, debugLog } from '../utils/helpers';

export function useRedPacket() {
  const { address, isConnected } = useAccount();
  const [redPacketInfo, setRedPacketInfo] = useState(null);
  const [currentPacketId, setCurrentPacketId] = useState(0);
  const [contractBalance, setContractBalance] = useState('0');
  const [userInfo, setUserInfo] = useState({ name: '', age: 0 });
  const [isOwner, setIsOwner] = useState(false);
  const [queryError, setQueryError] = useState('');

  // 获取合约所有者
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });

  // 获取合约余额
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getBalance',
  });

  // 获取最新红包ID
  const { data: packetId, refetch: refetchPacketId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'packetId',
  });

  // 获取用户信息
  const { data: info, refetch: refetchUserInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getInfo',
    query: {
      enabled: isConnected,
    }
  });

  // 查询红包信息的 hook - 使用动态参数
  const [packetQueryId, setPacketQueryId] = useState(-1);
  const { 
    data: packetInfoData, 
    isLoading: isQueryingPacket,
    error: packetQueryError,
    refetch: refetchPacketInfo 
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPacketInfo',
    args: [packetQueryId],
    query: {
      enabled: isConnected && packetQueryId >= 0,
    }
  });

  // 写入合约的 hooks
  const { 
    writeContract: writeCreateRedPacket,
    data: createData,
    isPending: isCreating,
    error: createError,
  } = useWriteContract();

  const { 
    writeContract: writeGrabRedPacket,
    data: grabData,
    isPending: isGrabbing,
    error: grabError,
  } = useWriteContract();

  const { 
    writeContract: writeDeposit,
    data: depositData,
    isPending: isDepositing,
    error: depositError,
  } = useWriteContract();

  const { 
    writeContract: writeWithdraw,
    data: withdrawData,
    isPending: isWithdrawing,
    error: withdrawError,
  } = useWriteContract();

  const { 
    writeContract: writeSetInfo,
    data: setInfoData,
    isPending: isSettingInfo,
    error: setInfoError,
  } = useWriteContract();

  const { 
    writeContract: writeTransferToOwner,
    data: transferData,
    isPending: isTransferring,
    error: transferError,
  } = useWriteContract();

  // 等待交易确认的 hooks
  const { isLoading: isCreatePending, isSuccess: isCreateSuccess } = useWaitForTransactionReceipt({
    hash: createData,
  });

  const { isLoading: isGrabPending, isSuccess: isGrabSuccess } = useWaitForTransactionReceipt({
    hash: grabData,
  });

  const { isLoading: isDepositPending, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositData,
  });

  const { isLoading: isWithdrawPending, isSuccess: isWithdrawSuccess } = useWaitForTransactionReceipt({
    hash: withdrawData,
  });

  const { isLoading: isSetInfoPending, isSuccess: isSetInfoSuccess } = useWaitForTransactionReceipt({
    hash: setInfoData,
  });

  const { isLoading: isTransferPending, isSuccess: isTransferSuccess } = useWaitForTransactionReceipt({
    hash: transferData,
  });

  // 更新状态 effects
  useEffect(() => {
    if (balance) {
      setContractBalance(formatEth(balance));
    }
  }, [balance]);

  useEffect(() => {
    if (owner && address) {
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    }
  }, [owner, address]);

  useEffect(() => {
    if (info && info[0]) {
      setUserInfo({
        name: info[0],
        age: Number(info[1]),
      });
    }
  }, [info]);

  // 处理红包查询结果
  useEffect(() => {
    if (packetInfoData && packetQueryId >= 0) {
      try {
        const [isEqual, count, remainingCount, amount, remainingAmount, hasClaimed] = packetInfoData;
        
        const processedInfo = {
          id: packetQueryId,
          isEqual: Boolean(isEqual),
          count: Number(count),
          remainingCount: Number(remainingCount),
          amount: formatEth(amount),
          remainingAmount: formatEth(remainingAmount),
          hasClaimed: Boolean(hasClaimed),
          error: null
        };
        
        debugLog('红包信息解析完成', processedInfo);
        setRedPacketInfo(processedInfo);
        setQueryError('');
      } catch (error) {
        debugLog('红包信息解析失败', error);
        setQueryError('解析红包信息失败: ' + error.message);
        setRedPacketInfo({
          id: packetQueryId,
          error: '解析红包信息失败: ' + error.message
        });
      }
    }
  }, [packetInfoData, packetQueryId]);

  // 处理查询错误
  useEffect(() => {
    if (packetQueryError && packetQueryId >= 0) {
      const errorMsg = getErrorMessage(packetQueryError);
      debugLog('红包查询错误', { packetQueryId, error: errorMsg });
      setQueryError(errorMsg);
      setRedPacketInfo({
        id: packetQueryId,
        error: errorMsg
      });
    }
  }, [packetQueryError, packetQueryId]);

  // 查询红包函数
  const queryRedPacket = useCallback(async (packetIdValue) => {
    try {
      debugLog('开始查询红包', { packetIdValue, currentPacketId: Number(packetId) });
      
      // 输入验证
      if (packetIdValue < 0 || !Number.isInteger(packetIdValue)) {
        throw new Error('红包ID必须是大于等于0的整数');
      }

      // 检查是否有红包存在
      if (!packetId || Number(packetId) === 0) {
        throw new Error('还没有人创建过红包，请先创建红包');
      }
      
      // 检查查询的ID是否有效
      if (packetIdValue >= Number(packetId)) {
        throw new Error(`红包ID无效。当前最大红包ID为: ${Number(packetId) - 1}`);
      }
      
      // 重置错误状态
      setQueryError('');
      setRedPacketInfo(null);
      
      // 设置要查询的ID，这会触发 useReadContract
      setCurrentPacketId(packetIdValue);
      setPacketQueryId(packetIdValue);
      
      // 返回成功
      return true;
      
    } catch (error) {
      debugLog('查询红包失败', error);
      setQueryError(error.message);
      setRedPacketInfo({
        id: packetIdValue,
        error: error.message
      });
      throw error;
    }
  }, [packetId]);

  // 自动查询最新红包
  const autoQueryLatestPacket = useCallback(async () => {
    if (packetId && Number(packetId) > 0) {
      const targetId = Number(packetId) - 1;
      debugLog('自动查询最新红包', { targetId, totalPackets: Number(packetId) });
      try {
        await queryRedPacket(targetId);
      } catch (error) {
        debugLog('自动查询失败', error.message);
      }
    }
  }, [packetId, queryRedPacket]);

  // 创建红包函数
  const createRedPacket = async ({ amount, count, isEqual = false }) => {
    try {
      validateRedPacketParams(amount, count);
      
      const amountWei = parseEth(amount);
      debugLog('创建红包参数', { amount, count, isEqual, amountWei: amountWei.toString() });
      
      await writeCreateRedPacket({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'sendRedPacket',
        args: [isEqual, count, amountWei],
        value: amountWei,
      });
    } catch (error) {
      console.error('创建红包失败:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  // 抢红包函数
  const grabRedPacket = async () => {
    try {
      if (currentPacketId < 0) {
        throw new Error('请先查询红包信息');
      }
      
      // 检查红包是否存在
      if (!packetId || Number(packetId) === 0) {
        throw new Error('没有可抢的红包，请先创建红包');
      }
      
      if (currentPacketId >= Number(packetId)) {
        throw new Error('红包ID无效');
      }

      debugLog('抢红包', { currentPacketId });
      
      await writeGrabRedPacket({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getRedPacket',
        args: [currentPacketId],
      });
    } catch (error) {
      console.error('抢红包失败:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  // 存款函数
  const deposit = async (amount) => {
    try {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error('请输入有效的存款金额');
      }
      
      const amountWei = parseEth(amount);
      debugLog('存款', { amount, amountWei: amountWei.toString() });
      
      await writeDeposit({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'deposit',
        value: amountWei,
      });
    } catch (error) {
      console.error('存款失败:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  // 提款函数
  const withdraw = async (amount) => {
    try {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        throw new Error('请输入有效的提款金额');
      }
      
      const amountWei = parseEth(amount);
      debugLog('提款', { amount, amountWei: amountWei.toString() });
      
      await writeWithdraw({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'withdraw',
        args: [amountWei],
      });
    } catch (error) {
      console.error('提款失败:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  // 设置用户信息函数
  const setUserInfoData = async (name, age) => {
    try {
      if (!name || !age || isNaN(age) || age < 0) {
        throw new Error('请输入有效的姓名和年龄');
      }
      
      debugLog('设置用户信息', { name, age });
      
      await writeSetInfo({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'setInfo',
        args: [name, age],
      });
    } catch (error) {
      console.error('设置用户信息失败:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  // 转移到所有者函数
  const transferToOwner = async () => {
    try {
      debugLog('转移到所有者');
      
      await writeTransferToOwner({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'transferToOwner',
      });
    } catch (error) {
      console.error('转移失败:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  // 刷新数据
  const refreshData = useCallback(() => {
    debugLog('刷新数据');
    refetchBalance();
    refetchPacketId();
    refetchUserInfo();
    if (packetQueryId >= 0) {
      refetchPacketInfo();
    }
  }, [refetchBalance, refetchPacketId, refetchUserInfo, refetchPacketInfo, packetQueryId]);

  // 监听交易成功
  useEffect(() => {
    if (isCreateSuccess) {
      debugLog('红包创建成功');
      refreshData();
      setTimeout(() => {
        autoQueryLatestPacket();
      }, 2000); // 等待2秒让区块确认
    }
  }, [isCreateSuccess, refreshData, autoQueryLatestPacket]);

  useEffect(() => {
    if (isGrabSuccess) {
      debugLog('抢红包成功');
      refreshData();
      if (currentPacketId >= 0) {
        setTimeout(() => {
          queryRedPacket(currentPacketId);
        }, 2000); // 等待2秒让区块确认
      }
    }
  }, [isGrabSuccess, currentPacketId, queryRedPacket, refreshData]);

  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess || isTransferSuccess) {
      debugLog('余额操作成功', { isDepositSuccess, isWithdrawSuccess, isTransferSuccess });
      refreshData();
    }
  }, [isDepositSuccess, isWithdrawSuccess, isTransferSuccess, refreshData]);

  useEffect(() => {
    if (isSetInfoSuccess) {
      debugLog('用户信息设置成功');
      refetchUserInfo();
    }
  }, [isSetInfoSuccess, refetchUserInfo]);

  return {
    // 状态
    redPacketInfo,
    currentPacketId,
    contractBalance,
    userInfo,
    isOwner,
    packetId: packetId ? Number(packetId) : 0,
    queryError,
    
    // 创建红包
    createRedPacket,
    isCreating: isCreating || isCreatePending,
    createError,
    
    // 抢红包
    grabRedPacket,
    isGrabbing: isGrabbing || isGrabPending,
    grabError,
    
    // 存款提款
    deposit,
    withdraw,
    isDepositing: isDepositing || isDepositPending,
    isWithdrawing: isWithdrawing || isWithdrawPending,
    depositError,
    withdrawError,
    
    // 用户信息
    setUserInfo: setUserInfoData,
    isSettingInfo: isSettingInfo || isSetInfoPending,
    setInfoError,
    
    // 所有者功能
    transferToOwner,
    isTransferring: isTransferring || isTransferPending,
    transferError,
    
    // 查询功能
    queryRedPacket,
    autoQueryLatestPacket,
    refreshData,
    isQueryingPacket,
  };
}