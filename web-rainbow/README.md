`# 红包 DApp Frontend

这是一个基于 Next.js 和 RainbowKit 的以太坊红包分发应用前端。

## 功能特性

- 🎯 **智能合约交互** - 与红包智能合约无缝集成
- 🌈 **多钱包支持** - 支持 MetaMask、WalletConnect、Coinbase Wallet 等
- 📱 **响应式设计** - 适配桌面端和移动端
- 🎨 **现代 UI** - 使用渐变色和动画效果
- 🔒 **安全可靠** - 所有交易都在链上进行
- 🌐 **多语言支持** - 中文界面，易于使用

## 主要功能

### 1. 合约信息
- 查看合约地址和拥有者
- 显示合约余额
- 实时更新当前红包 ID

### 2. 个人信息管理
- 设置和更新用户姓名、年龄
- 显示钱包地址
- 查看个人信息历史

### 3. 创建红包
- 设置红包总金额
- 选择红包个数
- 支持平均分配和随机分配
- 实时预览红包信息

### 4. 领取红包
- 通过红包 ID 查询红包信息
- 查看红包剩余情况
- 一键领取红包
- 防重复领取机制

### 5. 充值提现
- ETH 充值到合约
- 合约拥有者提现功能
- 实时余额显示

## 技术栈

- **框架**: Next.js 15
- **React**: React 19
- **Web3**: Wagmi + Viem
- **钱包连接**: RainbowKit
- **样式**: CSS Modules
- **语言**: TypeScript

## 项目结构

```
src/
├── abi/                    # 智能合约 ABI
│   └── index.js
├── components/             # React 组件
│   ├── ClaimRedPacket.tsx
│   ├── ContractInfo.tsx
│   ├── CreateRedPacket.tsx
│   ├── DepositWithdraw.tsx
│   ├── Navigation.tsx
│   └── UserProfile.tsx
├── hooks/                  # 自定义 Hooks
│   └── useContract.ts
├── pages/                  # Next.js 页面
│   ├── _app.tsx
│   └── index.tsx
├── styles/                 # 样式文件
│   ├── globals.css
│   ├── Home.module.css
│   └── [Component].module.css
└── wagmi.ts               # Wagmi 配置
```

## 开始使用

### 环境要求

- Node.js 16+
- npm 或 yarn
- 现代浏览器（支持 Web3）

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
# 或
yarn build
yarn start
```

## 智能合约配置

在 `src/abi/index.js` 中配置合约地址和 ABI：

```javascript
export const CONTRACT_ADDRESS = \"0x...\"; // 你的合约地址
export const CONTRACT_ABI = [...]; // 合约 ABI
```

## 网络配置

在 `src/wagmi.ts` 中配置支持的网络：

```typescript
const { chains, publicClient } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_KEY }),
    publicProvider()
  ]
)
```

## 环境变量

创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_INFURA_KEY=your_infura_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

## 组件说明

### ContractInfo
显示智能合约的基本信息，包括：
- 合约地址
- 合约拥有者
- 当前红包 ID
- 合约余额
- 用户余额

### UserProfile
用户个人信息管理：
- 显示钱包地址
- 设置/编辑姓名和年龄
- 查看已保存的信息

### CreateRedPacket
创建红包功能：
- 输入红包总金额
- 设置红包个数
- 选择分配方式（平均/随机）
- 实时预览
- 创建交易

### ClaimRedPacket
领取红包功能：
- 输入红包 ID
- 查看红包详情
- 检查领取状态
- 执行领取操作

### DepositWithdraw
资金管理：
- ETH 充值到合约
- 查看合约余额
- 拥有者提现功能

### Navigation
导航组件：
- 标签页切换
- 钱包连接按钮
- 响应式设计

## 自定义 Hooks

### useContract.ts
提供与智能合约交互的 Hooks：

- `useContractBalance()` - 获取合约余额
- `useContractOwner()` - 获取合约拥有者
- `useCurrentPacketId()` - 获取当前红包 ID
- `useUserInfo()` - 获取用户信息
- `usePacketInfo(packetId)` - 获取红包信息
- `useHasClaimedPacket(packetId, address)` - 检查领取状态
- `useSendRedPacket()` - 创建红包
- `useGetRedPacket()` - 领取红包
- `useSetInfo()` - 设置用户信息
- `useDeposit()` - 充值 ETH
- `useWithdraw()` - 提现 ETH

## 样式设计

### 设计原则
- **现代化**: 使用渐变色和阴影效果
- **响应式**: 适配各种屏幕尺寸
- **用户友好**: 清晰的视觉反馈
- **可访问性**: 支持键盘导航和屏幕阅读器

### 色彩方案
- **主色调**: 蓝紫渐变 (#667eea → #764ba2)
- **成功色**: 绿色系 (#48bb78)
- **警告色**: 橙色系 (#ed8936)
- **错误色**: 红色系 (#e53e3e)
- **信息色**: 蓝色系 (#3182ce)

### 响应式断点
- **桌面端**: > 768px
- **平板端**: 481px - 768px
- **移动端**: ≤ 480px

## 开发指南

### 添加新功能
1. 在 `components/` 创建新组件
2. 在 `styles/` 添加对应样式
3. 在 `hooks/useContract.ts` 添加合约交互逻辑
4. 在主页面中集成组件

### 代码规范
- 使用 TypeScript 进行类型检查
- 组件使用函数式写法
- CSS Modules 进行样式隔离
- 遵循 React Hooks 最佳实践

### 错误处理
- 网络错误自动重试
- 用户友好的错误提示
- 交易失败回滚处理
- 输入验证和边界检查

## 部署

### Vercel 部署
```bash
npm install -g vercel
vercel
```

### 自定义服务器
```bash
npm run build
npm start
```

### Docker 部署
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD [\"npm\", \"start\"]
```

## 安全考虑

- 所有交易都需要用户确认
- 私钥永远不会离开用户设备
- 合约地址硬编码防止钓鱼
- 输入验证防止注入攻击
- HTTPS 强制加密传输

## 故障排除

### 常见问题

**钱包连接失败**
- 检查浏览器是否安装钱包扩展
- 确认网络连接正常
- 尝试刷新页面重新连接

**交易失败**
- 检查账户 ETH 余额是否足够支付 Gas
- 确认网络拥堵情况，适当提高 Gas 价格
- 检查合约地址是否正确

**页面显示异常**
- 清除浏览器缓存
- 检查网络连接
- 确认使用的是支持的浏览器版本

### 调试技巧

1. **开发者工具**: 使用浏览器开发者工具查看控制台错误
2. **网络监控**: 检查网络请求是否正常
3. **钱包日志**: 查看钱包扩展的交易记录
4. **区块浏览器**: 在 Etherscan 等工具上查看交易状态

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 支持

如有问题，请：
1. 查看文档和 FAQ
2. 提交 GitHub Issue
3. 联系开发团队

---

**祝您使用愉快！🎉**