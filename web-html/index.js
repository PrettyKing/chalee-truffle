// 安全的格式化函数 - 修复BigInt转换问题
function formatEth(wei) {
  try {
    // 处理 BigInt 类型
    if (typeof wei === 'bigint') {
      return ethers.formatEther(wei.toString());
    }
    // 处理其他类型
    return ethers.formatEther(wei);
  } catch (error) {
    console.error("格式化ETH失败:", error);
    return "0";
  }
}

// 安全的解析函数
function parseEth(eth) {
  try {
    return ethers.parseEther(eth.toString());
  } catch (error) {
    console.error("解析ETH失败:", error);
    return ethers.parseEther("0");
  }
}

// 安全的数值转换函数
function safeToNumber(value, defaultValue = 0) {
  try {
    if (typeof value === 'bigint') {
      // 对于BigInt，先检查是否在安全范围内
      if (value <= Number.MAX_SAFE_INTEGER) {
        return Number(value);
      } else {
        console.warn("数值超出安全范围，返回默认值");
        return defaultValue;
      }
    }
    if (typeof value === 'string') {
      const num = parseInt(value);
      return isNaN(num) ? defaultValue : num;
    }
    return Number(value) || defaultValue;
  } catch (error) {
    console.error("数值转换失败:", error);
    return defaultValue;
  }
}

// 安全的字符串转换函数
function safeToString(value) {
  try {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return String(value);
  } catch (error) {
    console.error("字符串转换失败:", error);
    return "0";
  }
}