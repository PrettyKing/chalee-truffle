import { useCallback, useEffect } from 'react';
import { useContract } from './useContract';
import { useRedPacketQuery } from './useRedPacketQuery';
import { useRedPacketCreate } from './useRedPacketCreate';
import { useRedPacketGrab } from './useRedPacketGrab';
import { useContractBalance } from './useContractBalance';
import { useUserInfo } from './useUserInfo';
import { useOwnerOperations } from './useOwnerOperations';
import { debugLog } from '../utils/helpers';

/**
 * 红包主 Hook - 重构版本
 * 组合所有专门的 hooks，提供统一的接口
 * 这个 hook 现在更简洁，职责更清晰
 */
export function useRedPacket() {
  // 基础合约信息
  const {
    owner,
    balance,
    packetId,
    contractBalance,
    refetchBalance,
    refetchPacketId,
  } = useContract();

  // 红包查询功能
  const {
    redPacketInfo,
    currentPacketId,
    queryError,
    isQueryingPacket,
    queryRedPacket: baseQueryRedPacket,
    autoQueryLatestPacket: baseAutoQueryLatestPacket,
    refetchPacketInfo,
    setCurrentPacketId,
  } = useRedPacketQuery();

  // 红包创建功能
  const {
    createRedPacket,
    isCreating,
    isCreateSuccess,
    createError,
    resetCreateConfig,
  } = useRedPacketCreate();

  // 抢红包功能
  const {
    grabRedPacket: baseGrabRedPacket,
    isGrabbing,
    isGrabSuccess,
    grabError,
    resetGrabConfig,
  } = useRedPacketGrab();

  // 合约余额操作
  const {
    deposit,
    withdraw,
    isDepositing,
    isWithdrawing,
    isDepositSuccess,
    isWithdrawSuccess,
    depositError,
    withdrawError,
    resetConfigs: resetBalanceConfigs,
  } = useContractBalance();

  // 用户信息管理
  const {
    userInfo,
    setUserInfo,
    isSettingInfo,
    isSetInfoSuccess,
    setInfoError,
    refetchUserInfo,
    resetSetInfoConfig,
  } = useUserInfo();

  // 所有者操作
  const {
    isOwner,
    transferToOwner,
    isTransferring,
    isTransferSuccess,
    transferError,
    checkOwnership,
    resetTransferConfig,
  } = useOwnerOperations();

  // 检查所有者身份
  useEffect(() => {
    checkOwnership(owner);
  }, [owner, checkOwnership]);

  // 包装查询红包函数，传入必要的参数
  const queryRedPacket = useCallback(async (packetIdValue) => {
    return await baseQueryRedPacket(packetIdValue, packetId);
  }, [baseQueryRedPacket, packetId]);

  // 包装自动查询最新红包函数
  const autoQueryLatestPacket = useCallback(async () => {
    return await baseAutoQueryLatestPacket(packetId);
  }, [baseAutoQueryLatestPacket, packetId]);

  // 包装抢红包函数，传入必要的参数
  const grabRedPacket = useCallback(async () => {
    return await baseGrabRedPacket(currentPacketId, packetId);
  }, [baseGrabRedPacket, currentPacketId, packetId]);

  // 刷新所有数据
  const refreshData = useCallback(() => {
    debugLog('刷新所有数据');
    refetchBalance();
    refetchPacketId();
    refetchUserInfo();
    if (currentPacketId >= 0) {
      refetchPacketInfo();
    }
  }, [refetchBalance, refetchPacketId, refetchUserInfo, refetchPacketInfo, currentPacketId]);

  // 监听创建红包成功
  useEffect(() => {
    if (isCreateSuccess) {
      debugLog('红包创建成功，刷新数据');
      refreshData();
      setTimeout(() => {
        autoQueryLatestPacket();
      }, 2000); // 等待2秒让区块确认
    }
  }, [isCreateSuccess, refreshData, autoQueryLatestPacket]);

  // 监听抢红包成功
  useEffect(() => {
    if (isGrabSuccess) {
      debugLog('抢红包成功，刷新数据');
      refreshData();
      if (currentPacketId >= 0) {
        setTimeout(() => {
          queryRedPacket(currentPacketId);
        }, 2000); // 等待2秒让区块确认
      }
    }
  }, [isGrabSuccess, currentPacketId, queryRedPacket, refreshData]);

  // 监听余额操作成功
  useEffect(() => {
    if (isDepositSuccess || isWithdrawSuccess || isTransferSuccess) {
      debugLog('余额操作成功，刷新数据', { 
        isDepositSuccess, 
        isWithdrawSuccess, 
        isTransferSuccess 
      });
      refreshData();
    }
  }, [isDepositSuccess, isWithdrawSuccess, isTransferSuccess, refreshData]);

  // 重置所有配置的函数
  const resetAllConfigs = useCallback(() => {
    resetCreateConfig();
    resetGrabConfig();
    resetBalanceConfigs();
    resetSetInfoConfig();
    resetTransferConfig();
  }, [
    resetCreateConfig,
    resetGrabConfig,
    resetBalanceConfigs,
    resetSetInfoConfig,
    resetTransferConfig,
  ]);

  return {
    // 基础状态
    contractBalance,
    packetId,
    isOwner,
    
    // 红包相关
    redPacketInfo,
    currentPacketId,
    queryError,
    
    // 用户信息
    userInfo,
    
    // 创建红包
    createRedPacket,
    isCreating,
    createError,
    
    // 抢红包
    grabRedPacket,
    isGrabbing,
    grabError,
    
    // 余额操作
    deposit,
    withdraw,
    isDepositing,
    isWithdrawing,
    depositError,
    withdrawError,
    
    // 用户信息管理
    setUserInfo,
    isSettingInfo,
    setInfoError,
    
    // 所有者操作
    transferToOwner,
    isTransferring,
    transferError,
    
    // 查询和刷新
    queryRedPacket,
    autoQueryLatestPacket,
    refreshData,
    isQueryingPacket,
    
    // 工具函数
    resetAllConfigs,
    setCurrentPacketId,
  };
}