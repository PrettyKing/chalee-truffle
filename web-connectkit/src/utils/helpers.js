// Enhanced utility functions - integrated from web-html project
import { formatEther, parseEther } from 'viem';

/**
 * 格式化地址显示
 */
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * 安全的ETH格式化函数 - 处理BigInt类型
 */
export function formatEth(wei) {
  try {
    if (typeof wei === 'bigint') {
      return formatEther(wei);
    }
    return formatEther(wei.toString());
  } catch (error) {
    console.error('格式化ETH失败:', error);
    return '0';
  }
}

/**
 * 安全的ETH解析函数
 */
export function parseEth(eth) {
  try {
    return parseEther(eth.toString());
  } catch (error) {
    console.error('解析ETH失败:', error);
    return parseEther('0');
  }
}

/**
 * 安全的数值转换函数
 */
export function safeToNumber(value, defaultValue = 0) {
  try {
    if (typeof value === 'bigint') {
      // 对于BigInt，先检查是否在安全范围内
      if (value <= Number.MAX_SAFE_INTEGER) {
        return Number(value);
      } else {
        console.warn('数值超出安全范围，返回默认值');
        return defaultValue;
      }
    }
    if (typeof value === 'string') {
      const num = parseInt(value);
      return isNaN(num) ? defaultValue : num;
    }
    return Number(value) || defaultValue;
  } catch (error) {
    console.error('数值转换失败:', error);
    return defaultValue;
  }
}

/**
 * 安全的字符串转换函数
 */
export function safeToString(value) {
  try {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return String(value);
  } catch (error) {
    console.error('字符串转换失败:', error);
    return '0';
  }
}

/**
 * 参数验证函数
 */
export function validateRedPacketParams(amount, count) {
  // 验证金额
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    throw new Error('请输入有效的红包金额');
  }
  
  // 验证数量
  if (!Number.isInteger(count) || count <= 0 || count > 100) {
    throw new Error('红包个数必须是1-100之间的整数');
  }
  
  return true;
}

/**
 * 错误处理函数
 */
export function getErrorMessage(error) {
  if (error?.cause?.code === 'ACTION_REJECTED') {
    return '用户拒绝了交易';
  } else if (error?.cause?.code === 'INSUFFICIENT_FUNDS') {
    return '余额不足支付 Gas 费用';
  } else if (error?.message?.includes('User rejected')) {
    return '用户拒绝了交易';
  } else if (error?.message?.includes('insufficient funds')) {
    return '余额不足支付交易费用';
  } else if (error?.message?.includes('Count must be between')) {
    return '红包个数必须在1-100之间';
  } else if (error?.message?.includes('You can send at most')) {
    return '您已达到红包发送上限，请联系管理员重置';
  } else if (error?.message?.includes('No remaining red packets')) {
    return '红包已被抢完';
  } else if (error?.message?.includes('Already claimed')) {
    return '您已经抢过这个红包了';
  } else if (error?.message?.includes('Invalid packet ID')) {
    return '红包ID无效';
  } else if (error?.message?.includes('Insufficient balance')) {
    return '合约余额不足';
  } else if (error?.message?.includes('Only the owner')) {
    return '只有合约所有者才能执行此操作';
  } else if (error?.message?.includes('No balance')) {
    return '合约没有余额可转移';
  }
  
  return error?.message || '操作失败';
}

/**
 * 延迟函数
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 调试日志函数
 */
export function debugLog(message, data = null) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[调试] ${message}`, data);
  }
}

/**
 * 格式化时间戳
 */
export function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('时间格式化失败:', error);
    return '时间未知';
  }
}

/**
 * 计算进度百分比
 */
export function calculateProgress(current, total) {
  if (!total || total === 0) return 0;
  return Math.min(100, Math.max(0, (current / total) * 100));
}

/**
 * 生成随机ID
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制失败:', error);
    
    // 降级方案
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      console.error('降级复制也失败:', fallbackError);
      return false;
    }
  }
}

/**
 * 检查是否为移动设备
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 获取网络名称
 */
export function getNetworkName(chainId) {
  const networks = {
    1: 'Ethereum Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    5: 'Goerli',
    11155111: 'Sepolia',
    137: 'Polygon',
    80001: 'Mumbai',
    1337: 'Localhost',
    31337: 'Hardhat'
  };
  
  return networks[chainId] || `Unknown Network (${chainId})`;
}

/**
 * 检查交易哈希格式
 */
export function isValidTxHash(hash) {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * 检查地址格式
 */
export function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 格式化红包状态
 */
export function formatPacketStatus(remainingCount, hasClaimed) {
  if (remainingCount === 0) {
    return { text: '已抢完', class: 'finished' };
  } else if (hasClaimed) {
    return { text: '已参与', class: 'claimed' };
  } else {
    return { text: '可抢', class: 'available' };
  }
}

/**
 * 创建通知
 */
export function createNotification(title, message, type = 'info') {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: message,
      icon: '/favicon.ico'
    });
  }
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return Notification.permission === 'granted';
}

/**
 * 本地存储助手
 */
export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('读取本地存储失败:', error);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('写入本地存储失败:', error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除本地存储失败:', error);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('清空本地存储失败:', error);
      return false;
    }
  }
};

/**
 * 节流函数
 */
export function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 防抖函数
 */
export function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}