# 🚀 Chalee-Truffle

[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue.svg)](https://soliditylang.org/)
[![Truffle](https://img.shields.io/badge/Truffle-Latest-orange.svg)](https://trufflesuite.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

一个轻量级的以太坊DApp开发启动模板，基于Truffle框架，提供智能合约开发、部署、测试以及交互式前端界面。

<div align="center">
  <img src="https://ethereum.org/static/28214bb68eb5445dcb063a72535bc90c/9019e/hero.png" alt="Ethereum DApp" width="400"/>
</div>

## ✨ 主要特性

- **简单高效** - 最小化的合约设计，专注于功能演示
- **完整工作流** - 从合约开发到前端交互的完整实现
- **现代开发栈** - 使用Truffle、Ethers.js和Web3技术栈
- **友好文档** - 详细的操作指南和API文档
- **轻松扩展** - 基础架构便于添加新功能

## 📋 核心功能

### 📱 前端

- MetaMask钱包集成
- 实时合约状态显示
- 事件监听和响应
- 响应式设计，适配多种设备

### 📝 智能合约

- 基础数据存储与检索
- 事件触发与监听
- 纯函数和视图函数示例

## 🛠️ 技术栈

- **Solidity** (v0.8.20) - 智能合约开发
- **Truffle** - 开发、测试和部署框架
- **Ethers.js** (v6.14.1) - 以太坊交互库
- **jQuery** (v3.7.1) - DOM操作
- **Web3** - 区块链交互基础设施

## 🚀 快速开始

### 前置条件

- Node.js (>= 16.0.0)
- npm 或 yarn
- MetaMask 浏览器扩展
- Ganache (本地区块链模拟器)

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/PrettyKing/chalee-truffle.git
cd chalee-truffle
```

2. **安装依赖**

```bash
# 安装Truffle (如未安装)
npm install -g truffle

# 安装项目依赖
cd web
npm install
```

3. **启动本地区块链**

```bash
# 使用Truffle自带开发网络
truffle develop
```

4. **编译和部署合约**

```bash
# 在truffle开发控制台中
compile
migrate
```

5. **启动前端应用**

```bash
# 在项目根目录中
cd web
npx http-server

# 访问 http://localhost:8080
```

## 📂 项目结构

```
chalee-truffle/
├── contracts/                # 智能合约
│   └── InfoContract.sol      # 信息存储合约
├── migrations/               # 部署脚本
│   └── 1_deploy_contracts.js # 合约部署
├── web/                      # 前端应用
│   ├── index.html            # 主页面
│   └── package.json          # 前端依赖
├── truffle-config.js         # Truffle配置
└── README.md                 # 项目文档
```

## 📖 合约API

### InfoContract

简单的信息存储和检索合约，用于演示基本的区块链交互功能。

#### 函数

| 函数 | 描述 | 参数 | 返回值 |
|------|------|------|--------|
| `setInfo(string _name, uint256 _age)` | 设置用户信息 | 姓名、年龄 | 无 |
| `getInfo()` | 获取用户信息 | 无 | (string, uint256) |
| `sayHi()` | 返回问候语 | 无 | string |

#### 事件

| 事件 | 描述 | 参数 |
|------|------|------|
| `Instructor(string name, uint256 age)` | 信息更新事件 | 姓名、年龄 |

## 💡 使用示例

### 合约交互

```javascript
// 获取合约实例
const contract = await InfoContract.deployed();

// 设置信息
await contract.setInfo("Alice", 25);

// 获取信息
const [name, age] = await contract.getInfo();
console.log(`用户: ${name}, 年龄: ${age}`);

// 监听事件
contract.Instructor().on("data", event => {
  console.log(`新增用户: ${event.returnValues.name}`);
});
```

### 前端集成

```javascript
// 使用Ethers.js连接合约
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

// 调用合约函数
const tx = await contract.setInfo("Bob", 30);
await tx.wait();

// 读取合约状态
const [name, age] = await contract.getInfo();
```

## 🔍 故障排除

**常见问题与解决方案:**

1. **无法连接到网络**
   - 确认Ganache正在运行
   - 检查truffle-config.js中的网络配置
   - 确认MetaMask已连接到正确网络

2. **合约部署失败**
   - 检查编译器版本兼容性
   - 确保账户有足够的测试ETH
   - 运行 `truffle migrate --reset` 重新部署

3. **交易失败**
   - 检查交易gas设置
   - 确认函数调用参数类型正确
   - 查看合约事件日志以获取详细错误信息

## 🧪 测试指南

```bash
# 运行全部测试
truffle test

# 查看测试覆盖率
truffle run coverage
```

## 🤝 参与贡献

欢迎贡献代码、报告问题或提出新功能建议!

1. Fork 仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📚 学习资源

- [Truffle框架文档](https://trufflesuite.com/docs/)
- [Solidity语言文档](https://docs.soliditylang.org/)
- [Ethers.js指南](https://docs.ethers.io/v5/)
- [Web3开发最佳实践](https://ethereum.org/en/developers/)

## 📄 许可证

本项目采用MIT许可证 - 详情请查看 [LICENSE](LICENSE) 文件

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/PrettyKing">PrettyKing</a></sub>
</div>
