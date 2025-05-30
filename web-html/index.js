// 合约配置
// const CONTRACT_ADDRESS = "0x742d20593E23aC4C3B604015a0B2d50C49e6665d"; // home
const CONTRACT_ADDRESS = "0xe67cDF62E2908385E2ECDEa3D3DAA3b8b0d61Dd9"; // work

const CONTRACT_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Deposit",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "age",
          "type": "uint256"
        }
      ],
      "name": "Instructor",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "packetId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "bool",
          "name": "isEqual",
          "type": "bool"
        },
        {
          "indexed": true,
          "internalType": "uint8",
          "name": "count",
          "type": "uint8"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PacketCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "packetId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "claimer",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PacketClaimed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Withdraw",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "balance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "currentPacketCountOfOwner",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "packetId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "packets",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isEqual",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "count",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "remainingCount",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "remainingAmount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "stateMutability": "payable",
      "type": "receive",
      "payable": true
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "transferToOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "isEqual",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "count",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "sendRedPacket",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_packetId",
          "type": "uint256"
        }
      ],
      "name": "getRedPacket",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "resetPacketCount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_packetId",
          "type": "uint256"
        }
      ],
      "name": "getPacketInfo",
      "outputs": [
        {
          "internalType": "bool",
          "name": "isEqual",
          "type": "bool"
        },
        {
          "internalType": "uint8",
          "name": "count",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "remainingCount",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "remainingAmount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "hasClaimed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_packetId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "hasClaimedPacket",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "sayHi",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_age",
          "type": "uint256"
        }
      ],
      "name": "setInfo",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ]

// 工具函数
function showStatus(element, message, type = "info", showLoading = false) {
  const loadingSpinner = showLoading
    ? '<div class="loading-spinner"></div>'
    : "";
  const statusClass = `status-${type}`;
  element.html(
    `<div class="status-message ${statusClass}">${loadingSpinner}${message}</div>`
  );
}

function clearStatus(element) {
  element.html("");
}

function updateConnectionStatus(connected, account = null) {
  const dot = elements.statusDot;
  const text = elements.connectionText;

  if (connected) {
    dot.addClass("connected");
    text.text("已连接");
  } else {
    dot.removeClass("connected");
    text.text("未连接");
    elements.accountInfo.addClass("hidden");
  }
}

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

// 更新连接状态 UI
function updateConnectionUI(connected) {
  if (connected) {
    elements.connectWallet.addClass("hidden");
    elements.disconnectWallet.removeClass("hidden");
  } else {
    elements.connectWallet.removeClass("hidden");
    elements.disconnectWallet.addClass("hidden");
  }
}

// 清除所有结果
function clearAllResults() {
  [
    elements.setInfoStatus,
    elements.getInfoResult,
    elements.ownerInfo,
    elements.balanceDisplay,
    elements.depositStatus,
    elements.withdrawStatus,
    elements.transferToOwnerStatus,
  ].forEach(clearStatus);
}

// 参数验证函数
function validateRedPacketParams(amount, count) {
  // 验证金额
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    throw new Error("请输入有效的红包金额");
  }
  
  // 验证数量
  if (!Number.isInteger(count) || count <= 0 || count > 100) {
    throw new Error("红包个数必须是1-100之间的整数");
  }
  
  return true;
}

// 调试日志函数
function debugLog(message, data = null) {
  console.log(`[调试] ${message}`, data);
}