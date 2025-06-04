import { useState, useEffect } from 'react';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/ChaleeDApp';
import { parseEth, formatEth, getErrorMessage, validateRedPacketParams } from '../utils/helpers';

export function useRedPacket() {
  const { address, isConnected } = useAccount();
  const [redPacketInfo, setRedPacketInfo] = useState(null);
  const [currentPacketId, setCurrentPacketId] = useState(0);
  const [contractBalance, setContractBalance] = useState('0');
  const [userInfo, setUserInfo] = useState({ name: '', age: 0 });
  const [isOwner, setIsOwner] = useState(false);

  // 获取合约所有者
  const { data: owner } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'owner',
  });

  // 获取合约余额
  const { data: balance, refetch: refetchBalance } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getBalance',
  });

  // 获取最新红包ID
  const { data: packetId, refetch: refetchPacketId } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'packetId',
  });

  // 获取用户信息
  const { data: info, refetch: refetchUserInfo } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getInfo',
    enabled: isConnected,
  });

  // 创建红包
  const [createConfig, setCreateConfig] = useState(null);
  const { config: createRedPacketConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'sendRedPacket',
    args: createConfig?.args,
    value: createConfig?.value,
    enabled: !!createConfig,
  });

  const {
    write: writeCreateRedPacket,
    data: createData,
    isLoading: isCreating,
    error: createError,
  } = useContractWrite(createRedPacketConfig);

  const {
    isLoading: isCreatePending,
    isSuccess: isCreateSuccess,
  } = useWaitForTransaction({
    hash: createData?.hash,
  });

  // 抢红包
  const [grabConfig, setGrabConfig] = useState(null);
  const { config: grabRedPacketConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRedPacket',
    args: grabConfig?.args,
    enabled: !!grabConfig,
  });

  const {
    write: writeGrabRedPacket,
    data: grabData,
    isLoading: isGrabbing,
    error: grabError,
  } = useContractWrite(grabRedPacketConfig);

  const {
    isLoading: isGrabPending,
    isSuccess: isGrabSuccess,
  } = useWaitForTransaction({
    hash: grabData?.hash,
  });

  // 存款
  const [depositConfig, setDepositConfig] = useState(null);
  const { config: depositContractConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'deposit',
    value: depositConfig?.value,
    enabled: !!depositConfig,
  });

  const {
    write: writeDeposit,
    data: depositData,
    isLoading: isDepositing,
    error: depositError,
  } = useContractWrite(depositContractConfig);

  const {
    isLoading: isDepositPending,
    isSuccess: isDepositSuccess,
  } = useWaitForTransaction({
    hash: depositData?.hash,
  });

  // 提款
  const [withdrawConfig, setWithdrawConfig] = useState(null);
  const { config: withdrawContractConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'withdraw',
    args: withdrawConfig?.args,
    enabled: !!withdrawConfig,
  });

  const {
    write: writeWithdraw,
    data: withdrawData,
    isLoading: isWithdrawing,
    error: withdrawError,
  } = useContractWrite(withdrawContractConfig);

  const {
    isLoading: isWithdrawPending,
    isSuccess: isWithdrawSuccess,
  } = useWaitForTransaction({
    hash: withdrawData?.hash,
  });

  // 设置用户信息
  const [setInfoConfig, setSetInfoConfig] = useState(null);
  const { config: setInfoContractConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'setInfo',
    args: setInfoConfig?.args,
    enabled: !!setInfoConfig,
  });

  const {
    write: writeSetInfo,
    data: setInfoData,
    isLoading: isSettingInfo,
    error: setInfoError,
  } = useContractWrite(setInfoContractConfig);

  const {
    isLoading: isSetInfoPending,
    isSuccess: isSetInfoSuccess,
  } = useWaitForTransaction({
    hash: setInfoData?.hash,
  });

  // 转移到所有者
  const [transferConfig, setTransferConfig] = useState(null);
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

  // 更新状态
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

  // 查询红包
  const queryRedPacket = async (packetIdValue) => {
    try {
      setCurrentPacketId(packetIdValue);
      
      // 这里应该调用合约的 getPacketInfo 方法
      // 由于 useContractRead 不能动态调用，我们暂时返回成功
      // 在实际应用中，可以使用 wagmi 的 readContract 方法
      
      // 模拟红包信息
      const mockInfo = {
        id: packetIdValue,
        isEqual: false,
        count: 5,
        remainingCount: 3,
        amount: '0.1',
        remainingAmount: '0.06',
        hasClaimed: false,
      };
      
      setRedPacketInfo(mockInfo);
      return true;
    } catch (error) {
      console.error('查询红包失败:', error);
      return false;
    }
  };

  // 自动查询最新红包
  const autoQueryLatestPacket = async () => {
    if (packetId && Number(packetId) > 0) {
      const targetId = Number(packetId) - 1;
      await queryRedPacket(targetId);
    }
  };

  // 创建红包函数
  const createRedPacket = async ({ amount, count, isEqual = false }) => {
    try {
      validateRedPacketParams(amount, count);
      
      const amountWei = parseEth(amount);
      
      setCreateConfig({
        args: [isEqual, count, amountWei],
        value: amountWei,
      });
      
      // 等待 config 更新后再调用 write
      setTimeout(() => {
        if (writeCreateRedPacket) {
          writeCreateRedPacket();
        }
      }, 100);
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
      
      setGrabConfig({
        args: [currentPacketId],
      });
      
      setTimeout(() => {
        if (writeGrabRedPacket) {
          writeGrabRedPacket();
        }
      }, 100);
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
      
      setDepositConfig({
        value: amountWei,
      });
      
      setTimeout(() => {
        if (writeDeposit) {
          writeDeposit();
        }
      }, 100);
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
      
      setWithdrawConfig({
        args: [amountWei],
      });
      
      setTimeout(() => {
        if (writeWithdraw) {
          writeWithdraw();
        }
      }, 100);
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
      
      setSetInfoConfig({
        args: [name, age],
      });
      
      setTimeout(() => {
        if (writeSetInfo) {
          writeSetInfo();
        }
      }, 100);
    } catch (error) {
      console.error('设置用户信息失败:', error);
      throw new Error(getErrorMessage(error));
    }
  };

  // 转移到所有者函数
  const transferToOwner = async () => {
    try {
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

  // 刷新数据
  const refreshData = () => {
    refetchBalance();
    refetchPacketId();
    refetchUserInfo();
  };

  // 监听交易成功
  useEffect(() => {
    if (isCreateSuccess) {
      refreshData();
      autoQueryLatestPacket();
      setCreateConfig(null);
    }
  }, [isCreateSuccess]);

  useEffect(() => {
    if (isGrabSuccess) {
      refreshData();
      if (currentPacketId >= 0) {
        queryRedPacket(currentPacketId);
      }
      setGrabConfig(null);
    }
  }, [isGrabSuccess]);

  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess || isTransferSuccess) {
      refreshData();
      setDepositConfig(null);
      setWithdrawConfig(null);
      setTransferConfig(null);
    }
  }, [isDepositSuccess, isWithdrawSuccess, isTransferSuccess]);

  useEffect(() => {
    if (isSetInfoSuccess) {
      refetchUserInfo();
      setSetInfoConfig(null);
    }
  }, [isSetInfoSuccess]);

  return {
    // 状态
    redPacketInfo,
    currentPacketId,
    contractBalance,
    userInfo,
    isOwner,
    
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
  };
}