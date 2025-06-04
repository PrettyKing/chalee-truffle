import { formatEther, parseEther } from 'viem';

// 格式化 ETH 数量
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

// 解析 ETH 数量
export function parseEth(eth) {
  try {
    return parseEther(eth.toString());
  } catch (error) {
    console.error('解析ETH失败:', error);
    return parseEther('0');
  }
}

// 安全的数值转换
export function safeToNumber(value, defaultValue = 0) {
  try {
    if (typeof value === 'bigint') {
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

// 安全的字符串转换
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

// 参数验证函数
export function validateRedPacketParams(amount, count) {
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    throw new Error('请输入有效的红包金额');
  }
  
  if (!Number.isInteger(count) || count <= 0 || count > 100) {
    throw new Error('红包个数必须是1-100之间的整数');
  }
  
  return true;
}

// 错误消息处理
export function getErrorMessage(error) {
  if (error?.cause?.code === 'ACTION_REJECTED') {
    return '用户拒绝了交易';
  } else if (error?.cause?.code === 'INSUFFICIENT_FUNDS') {
    return '余额不足支付 Gas 费用';
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

// 格式化地址显示
export function formatAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// 延迟函数
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}