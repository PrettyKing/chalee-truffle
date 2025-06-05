// 区块链数据获取工具函数
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contracts/ChaleeDApp';
import { formatEth, debugLog } from './helpers';

/**
 * 创建合约实例用于只读操作
 */
export async function createReadOnlyContract() {
  try {
    // 使用当前连接的provider，如果没有则使用默认的RPC
    let provider;
    
    if (window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
    } else {
      // 备用RPC提供商
      provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545'); // 本地 Ganache
    }
    
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    return contract;
  } catch (error) {
    debugLog('创建合约实例失败', error);
    throw error;
  }
}

/**
 * 获取红包信息
 */
export async function fetchPacketInfo(packetId) {
  try {
    debugLog('开始获取红包信息', { packetId });
    
    const contract = await createReadOnlyContract();
    const result = await contract.getPacketInfo(packetId);
    
    const [isEqual, count, remainingCount, amount, remainingAmount, hasClaimed] = result;
    
    const packetInfo = {
      id: packetId,
      isEqual: Boolean(isEqual),
      count: Number(count),
      remainingCount: Number(remainingCount),
      amount: formatEth(amount),
      remainingAmount: formatEth(remainingAmount),
      hasClaimed: Boolean(hasClaimed),
    };
    
    debugLog('红包信息获取成功', packetInfo);
    return packetInfo;
  } catch (error) {
    debugLog('获取红包信息失败', { packetId, error: error.message });
    throw error;
  }
}

/**
 * 获取合约余额
 */
export async function fetchContractBalance() {
  try {
    const contract = await createReadOnlyContract();
    const balance = await contract.getBalance();
    return formatEth(balance);
  } catch (error) {
    debugLog('获取合约余额失败', error);
    throw error;
  }
}

/**
 * 获取最新红包ID
 */
export async function fetchLatestPacketId() {
  try {
    const contract = await createReadOnlyContract();
    const packetId = await contract.packetId();
    return Number(packetId);
  } catch (error) {
    debugLog('获取最新红包ID失败', error);
    throw error;
  }
}

/**
 * 获取合约所有者
 */
export async function fetchContractOwner() {
  try {
    const contract = await createReadOnlyContract();
    const owner = await contract.owner();
    return owner;
  } catch (error) {
    debugLog('获取合约所有者失败', error);
    throw error;
  }
}

/**
 * 获取用户信息
 */
export async function fetchUserInfo() {
  try {
    const contract = await createReadOnlyContract();
    const result = await contract.getInfo();
    const [name, age] = result;
    
    return {
      name: name || '',
      age: Number(age) || 0,
    };
  } catch (error) {
    debugLog('获取用户信息失败', error);
    throw error;
  }
}

/**
 * 批量获取红包历史信息
 */
export async function fetchPacketHistory(latestPacketId, maxCount = 10) {
  try {
    debugLog('开始批量获取红包历史', { latestPacketId, maxCount });
    
    if (!latestPacketId || latestPacketId === 0) {
      return [];
    }
    
    const contract = await createReadOnlyContract();
    const historyCount = Math.min(latestPacketId, maxCount);
    const history = [];
    
    // 创建并发请求
    const promises = [];
    for (let i = latestPacketId - 1; i >= Math.max(0, latestPacketId - historyCount); i--) {
      promises.push(
        contract.getPacketInfo(i).then(result => {
          const [isEqual, count, remainingCount, amount, remainingAmount, hasClaimed] = result;
          return {
            id: i,
            isEqual: Boolean(isEqual),
            count: Number(count),
            remainingCount: Number(remainingCount),
            amount: formatEth(amount),
            remainingAmount: formatEth(remainingAmount),
            hasClaimed: Boolean(hasClaimed),
            timestamp: Date.now() - Math.random() * 86400000, // 模拟时间戳
          };
        }).catch(error => {
          debugLog(`获取红包 #${i} 失败`, error);
          return null; // 返回 null 表示获取失败
        })
      );
    }
    
    // 等待所有请求完成
    const results = await Promise.all(promises);
    
    // 过滤掉失败的请求并按ID降序排列
    const validResults = results.filter(result => result !== null);
    validResults.sort((a, b) => b.id - a.id);
    
    debugLog('红包历史批量获取完成', { 
      requested: historyCount, 
      success: validResults.length,
      failed: historyCount - validResults.length 
    });
    
    return validResults;
  } catch (error) {
    debugLog('批量获取红包历史失败', error);
    throw error;
  }
}

/**
 * 检查用户是否已经抢过特定红包
 */
export async function checkUserClaimedPacket(packetId, userAddress) {
  try {
    const contract = await createReadOnlyContract();
    const hasClaimed = await contract.hasClaimedPacket(packetId, userAddress);
    return Boolean(hasClaimed);
  } catch (error) {
    debugLog('检查用户抢红包状态失败', { packetId, userAddress, error });
    return false; // 默认返回未抢取
  }
}

/**
 * 获取完整的红包状态信息（包含用户特定信息）
 */
export async function fetchCompletePacketInfo(packetId, userAddress = null) {
  try {
    const packetInfo = await fetchPacketInfo(packetId);
    
    // 如果提供了用户地址，检查用户是否已抢取
    if (userAddress) {
      const userHasClaimed = await checkUserClaimedPacket(packetId, userAddress);
      packetInfo.hasClaimed = userHasClaimed;
    }
    
    return packetInfo;
  } catch (error) {
    debugLog('获取完整红包信息失败', { packetId, userAddress, error });
    throw error;
  }
}

/**
 * 验证合约连接状态
 */
export async function validateContractConnection() {
  try {
    const contract = await createReadOnlyContract();
    
    // 尝试调用一个简单的只读函数来验证连接
    const owner = await contract.owner();
    const packetId = await contract.packetId();
    
    debugLog('合约连接验证成功', { 
      contractAddress: CONTRACT_ADDRESS,
      owner,
      currentPacketId: Number(packetId)
    });
    
    return {
      connected: true,
      owner,
      currentPacketId: Number(packetId),
      contractAddress: CONTRACT_ADDRESS
    };
  } catch (error) {
    debugLog('合约连接验证失败', error);
    throw new Error(`合约连接失败: ${error.message}`);
  }
}

/**
 * 获取网络信息
 */
export async function getNetworkInfo() {
  try {
    if (!window.ethereum) {
      throw new Error('未检测到以太坊钱包');
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    return {
      name: network.name,
      chainId: Number(network.chainId),
      ensAddress: network.ensAddress,
    };
  } catch (error) {
    debugLog('获取网络信息失败', error);
    throw error;
  }
}

/**
 * 工具函数：格式化错误信息
 */
export function formatContractError(error) {
  if (error.code === 'CALL_EXCEPTION') {
    return '合约调用失败，请检查参数或网络连接';
  } else if (error.code === 'NETWORK_ERROR') {
    return '网络连接错误，请检查网络状态';
  } else if (error.message.includes('Invalid packet ID')) {
    return '红包ID无效';
  } else if (error.message.includes('execution reverted')) {
    return '交易被拒绝，可能是参数错误或权限不足';
  }
  
  return error.message || '未知错误';
}

// 导出所有函数
export default {
  createReadOnlyContract,
  fetchPacketInfo,
  fetchContractBalance,
  fetchLatestPacketId,
  fetchContractOwner,
  fetchUserInfo,
  fetchPacketHistory,
  checkUserClaimedPacket,
  fetchCompletePacketInfo,
  validateContractConnection,
  getNetworkInfo,
  formatContractError,
};