# 🚀 Chalee-Truffle

一个基于 Truffle 框架的智能合约开发项目，包含智能合约部署、测试和前端 DApp 交互界面。

## 📋 项目概述

Chalee-Truffle 是一个完整的以太坊 DApp 开发项目，包含：

- ✅ 智能合约开发与部署
- ✅ 完整的测试套件
- ✅ 现代化的前端交互界面
- ✅ MetaMask 钱包集成
- ✅ 本地开发环境配置

## 🎯 功能特性

### 智能合约功能
- **信息存储**：存储和检索用户姓名和年龄信息
- **问候功能**：简单的 sayHi() 函数演示
- **事件监听**：Instructor 事件的触发和监听

### 前端功能
- **钱包连接**：MetaMask 钱包无缝集成
- **合约交互**：直观的智能合约调用界面
- **实时反馈**：交易状态和结果的实时显示
- **事件监听**：区块链事件的实时监控
- **科技感UI**：现代化的渐变和动画效果

## 🛠️ 技术栈

### 后端/区块链
- **Solidity** ^0.8.0 - 智能合约开发语言
- **Truffle** - 开发框架和测试套件
- **Ganache** - 本地区块链网络
- **Web3.js** - 区块链交互库

### 前端
- **HTML5/CSS3** - 基础网页技术
- **JavaScript (ES6+)** - 交互逻辑
- **Ethers.js** - 以太坊JavaScript库
- **jQuery** - DOM操作和事件处理

## 📦 安装指南

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0
- Git

### 1. 克隆仓库
```bash
git clone https://github.com/yourusername/chalee-truffle.git
cd chalee-truffle
```

### 2. 安装依赖
```bash
# 安装 Truffle (全局)
npm install -g truffle

# 安装项目依赖
npm install

# 安装 Ganache CLI (可选)
npm install -g ganache-cli
```

### 3. 安装 MetaMask
前往 [MetaMask官网](https://metamask.io/) 下载并安装浏览器扩展

## 🚀 快速开始

### 1. 启动本地区块链
```bash
# 使用 Ganache CLI
ganache-cli

# 或者使用 Truffle 内置开发网络
truffle develop
```

### 2. 编译智能合约
```bash
truffle compile
```

### 3. 部署合约
```bash
truffle migrate

# 重新部署 (开发时使用)
truffle migrate --reset
```

### 4. 运行前端
```bash
# 使用简单 HTTP 服务器
python -m http.server 8000

# 或使用 Node.js
npx http-server

# 然后访问 http://localhost:8000
```

### 5. 配置 MetaMask
1. 连接到本地网络：
   - 网络名称: `Ganache Local`
   - RPC URL: `http://127.0.0.1:8545`
   - 链ID: `1337`
   - 货币符号: `ETH`

2. 导入 Ganache 提供的私钥到 MetaMask

## 📁 项目结构

```
chalee-truffle/
├── contracts/          # 智能合约源代码
│   ├── InfoContract.sol
│   └── Migrations.sol
├── migrations/         # 部署脚本
│   ├── 1_initial_migration.js
│   └── 2_deploy_contracts.js
├── test/              # 测试文件
│   └── info_contract.js
├── build/             # 编译输出 (自动生成)
├── node_modules/      # 项目依赖
├── index.html         # 前端应用入口
├── truffle-config.js  # Truffle 配置文件
├── package.json       # 项目配置
└── README.md         # 项目说明文档
```

## 🔧 配置说明

### Truffle 配置 (truffle-config.js)
```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },
  compilers: {
    solc: {
      version: "0.8.19"
    }
  }
};
```

### 环境变量配置
创建 `.env` 文件 (可选):
```env
MNEMONIC=your_wallet_mnemonic_here
INFURA_PROJECT_ID=your_infura_project_id
```

## 🧪 测试

运行完整测试套件：
```bash
truffle test
```

运行特定测试文件：
```bash
truffle test ./test/info_contract.js
```

## 📖 API 文档

### InfoContract 智能合约

#### 函数

##### `sayHi() → string`
- **描述**: 返回问候语
- **类型**: Pure function
- **返回**: 字符串 "Hello World"

##### `setInfo(string _name, uint256 _age)`
- **描述**: 设置用户信息
- **参数**: 
  - `_name`: 用户姓名
  - `_age`: 用户年龄
- **事件**: 触发 `Instructor` 事件

##### `getInfo() → (string, uint256)`
- **描述**: 获取当前存储的用户信息
- **返回**: 姓名和年龄的元组

#### 事件

##### `Instructor(string name, uint256 age)`
- **描述**: 当信息更新时触发
- **参数**: 新的姓名和年龄值

## 🐛 故障排除

### 常见问题

1. **合约调用失败 - "could not decode result data"**
   ```bash
   # 解决方案：重新编译和部署
   truffle compile
   truffle migrate --reset
   ```

2. **MetaMask 连接失败**
   - 确保 Ganache 正在运行
   - 检查网络配置是否正确
   - 确认账户有足够的 ETH 余额

3. **交易失败 - Gas 相关错误**
   ```javascript
   // 在合约调用时指定更高的 gas limit
   await contract.setInfo(name, age, { gasLimit: 3000000 });
   ```

### 调试技巧

1. **使用 Truffle Console**
   ```bash
   truffle console
   > let instance = await InfoContract.deployed()
   > await instance.sayHi()
   ```

2. **查看合约事件**
   ```javascript
   // 监听所有事件
   contract.getPastEvents('allEvents', { fromBlock: 0 })
   ```

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 这个仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

### 代码规范
- 使用 2 空格缩进
- Solidity 合约遵循 [官方风格指南](https://docs.soliditylang.org/en/latest/style-guide.html)
- JavaScript 代码使用 ESLint 规范

## 📜 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Truffle Suite](https://trufflesuite.com/) - 优秀的开发框架
- [OpenZeppelin](https://openzeppelin.com/) - 安全的合约库
- [MetaMask](https://metamask.io/) - 用户友好的钱包
- [Ethereum](https://ethereum.org/) - 去中心化平台

## 🔗 相关链接

- [Truffle 文档](https://trufflesuite.com/docs/)
- [Solidity 文档](https://docs.soliditylang.org/)
- [Web3.js 文档](https://web3js.readthedocs.io/)
- [Ethers.js 文档](https://docs.ethers.io/)

---

⭐ 如果这个项目对你有帮助，请给它一个 star！
