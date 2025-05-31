# 🧧 区块链红包 DApp

基于以太坊的去中心化红包应用，支持等额红包和随机红包两种模式。

## ✨ 功能特点

- 🧧 **发红包**: 支持等额红包和随机红包两种模式
- 🎁 **领红包**: 输入红包ID即可领取红包
- 📝 **红包列表**: 查看所有红包的状态和详情
- ⚙️ **合约管理**: 存款、提款、个人信息管理
- 🔗 **多钱包支持**: 集成 RainbowKit，支持多种钱包连接
- 🌐 **多网络支持**: 支持本地开发网络、测试网和主网

## 🛠️ 技术栈

- **前端框架**: React 18 + Vite
- **区块链库**: Wagmi v1 + Viem
- **钱包连接**: RainbowKit
- **样式库**: Tailwind CSS
- **智能合约**: Solidity ^0.8.19

## 📦 安装和运行

### 1. 克隆项目
```bash
git clone https://github.com/PrettyKing/chalee-truffle.git
cd chalee-truffle/web-connectkit
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
```bash
cp .env.example .env
```

编辑 `.env` 文件，填入以下信息：
```env
# 合约地址 - 部署合约后需要更新此地址
VITE_REACT_APP_CONTRACT_ADDRESS=0x你的合约地址

# Alchemy API Key - 用于连接以太坊网络
VITE_REACT_APP_ALCHEMY_ID=你的Alchemy_API_Key

# WalletConnect Project ID - 用于 RainbowKit
VITE_REACT_APP_PROJECT_ID=你的WalletConnect_Project_ID
```

### 4. 启动开发服务器
```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

## 🚀 部署智能合约

### 1. 使用 Truffle 部署到本地网络

确保 Ganache 正在运行在 `http://localhost:7545`

```bash
# 在项目根目录
cd ..
truffle migrate --network development
```

### 2. 部署到测试网络

```bash
truffle migrate --network sepolia
```

### 3. 更新合约地址

部署成功后，将合约地址更新到 `.env` 文件中的 `VITE_REACT_APP_CONTRACT_ADDRESS`。

## 📱 使用说明

### 发红包
1. 连接钱包
2. 选择 "发红包" 标签页
3. 选择红包类型（等额/随机）
4. 设置红包数量和总金额
5. 添加祝福语（可选）
6. 点击 "发红包" 按钮

### 领红包
1. 连接钱包
2. 选择 "领红包" 标签页
3. 输入红包ID
4. 点击 "查看" 查看红包详情
5. 点击 "领取红包" 按钮

### 查看红包列表
1. 选择 "红包列表" 标签页
2. 浏览所有红包的状态
3. 使用分页功能查看更多红包

### 合约管理
1. 选择 "合约信息" 标签页
2. 查看合约基本信息
3. 进行存款/提款操作
4. 管理个人信息

## 🔧 开发配置

### 本地开发网络配置

应用会自动检测环境：
- 开发环境：使用 `wagmi.local.ts` 配置（支持 Ganache）
- 生产环境：使用 `wagmi.prod.ts` 配置（支持多个主网）

### 支持的网络

**本地开发:**
- Ganache (Chain ID: 1337)

**测试网:**
- Sepolia

**主网:**
- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum

## 📄 智能合约接口

### 主要功能

- `sendRedPacket(bool isEqual, uint8 count, uint256 amount)`: 发红包
- `getRedPacket(uint256 packetId)`: 领红包
- `getPacketInfo(uint256 packetId)`: 获取红包信息
- `deposit()`: 存款到合约
- `withdraw(uint256 amount)`: 从合约提款
- `getBalance()`: 获取合约余额

### 事件

- `PacketCreated`: 红包创建事件
- `PacketClaimed`: 红包领取事件
- `Deposit`: 存款事件
- `Withdraw`: 提款事件

## 🔒 安全特性

- ✅ 每个地址只能领取一次相同的红包
- ✅ 红包数量限制（每个地址最多创建10个红包）
- ✅ 随机红包使用公平算法确保随机性
- ✅ 使用 `call` 方法进行安全的ETH转账
- ✅ 完整的输入验证和错误处理

## 🐛 故障排除

### 常见问题

1. **连接钱包失败**
   - 确保已安装 MetaMask 或其他支持的钱包
   - 检查网络配置是否正确

2. **交易失败**
   - 确保钱包有足够的ETH支付Gas费
   - 检查合约地址是否正确
   - 确认网络连接正常

3. **合约调用失败**
   - 验证合约是否已正确部署
   - 检查环境变量配置
   - 确认ABI是否与合约匹配

## 📝 开发命令

```bash
# 开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📜 许可证

MIT License

---

🧧 **祝您使用愉快，红包多多！** 🧧
