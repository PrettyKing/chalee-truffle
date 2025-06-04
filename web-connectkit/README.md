# Chalee DApp - 增强版红包应用

🎉 基于以太坊的去中心化红包应用，使用现代Web3技术栈构建。

## ✨ 功能特性

### 🎁 红包系统
- **创建红包**: 支持随机红包和等额红包
- **抢红包**: 实时抢夺红包，公平分配
- **红包查询**: 查看红包状态、进度和详情
- **历史记录**: 浏览最近的红包活动

### 💰 资产管理
- **存款功能**: 向合约存入ETH
- **提款功能**: 从合约提取ETH
- **余额查询**: 实时显示合约余额
- **快速操作**: 预设金额快速选择

### 👤 用户信息
- **信息设置**: 在链上存储个人信息
- **信息查询**: 查看当前用户信息
- **隐私保护**: 用户完全控制个人数据

### 🏆 所有者权限
- **资金管理**: 合约所有者可转移资金
- **系统管理**: 重置计数器等管理功能
- **权限控制**: 安全的权限验证机制

## 🛠 技术栈

### 前端技术
- **React 18**: 现代化React框架
- **RainbowKit**: 优雅的Web3钱包连接
- **Wagmi**: 强大的以太坊React Hooks
- **TailwindCSS**: 实用的CSS框架
- **Viem**: 轻量级以太坊库

### 区块链
- **Solidity**: 智能合约语言
- **Truffle**: 开发框架
- **以太坊**: 区块链平台

## 🚀 快速开始

### 前置要求
- Node.js >= 16.0.0
- npm 或 yarn
- MetaMask 或其他Web3钱包

### 安装依赖
```bash
cd web-connectkit
npm install
```

### 环境配置
创建 `.env` 文件：
```bash
cp .env.example .env
```

配置环境变量：
```env
REACT_APP_PROJECT_ID=your_walletconnect_project_id
REACT_APP_ALCHEMY_ID=your_alchemy_api_key
```

### 启动应用
```bash
npm start
```

应用将在 http://localhost:3000 启动

## 📱 使用指南

### 1. 连接钱包
- 点击"连接钱包"按钮
- 选择您的Web3钱包（推荐MetaMask）
- 确认连接请求

### 2. 创建红包
1. 切换到"🎁 红包"标签
2. 选择红包类型（随机/等额）
3. 输入红包金额和个数
4. 点击"创建红包"按钮
5. 确认交易

### 3. 抢红包
1. 在红包信息区域输入红包ID
2. 点击"查询"按钮查看红包详情
3. 如果可以抢夺，点击"立即领取红包"
4. 确认交易

### 4. 管理余额
1. 切换到"💰 余额"标签
2. 使用存款功能向合约存入ETH
3. 使用提款功能从合约提取ETH
4. 查看实时余额

### 5. 设置个人信息
1. 切换到"👤 信息"标签
2. 输入姓名和年龄
3. 点击"设置信息"按钮
4. 确认交易

## 🔧 开发指南

### 项目结构
```
web-connectkit/
├── src/
│   ├── components/          # React组件
│   │   ├── RedPacketApp.jsx    # 主应用组件
│   │   ├── CreateRedPacket.jsx # 创建红包组件
│   │   ├── RedPacketInfo.jsx   # 红包信息组件
│   │   ├── UserInfoManager.jsx # 用户信息管理
│   │   ├── BalanceManager.jsx  # 余额管理
│   │   ├── OwnerPanel.jsx      # 所有者面板
│   │   └── PacketHistory.jsx   # 红包历史
│   ├── hooks/               # 自定义Hooks
│   │   └── useRedPacket.js     # 红包相关逻辑
│   ├── contracts/           # 合约配置
│   │   └── ChaleeDApp.js       # 合约ABI和地址
│   ├── utils/               # 工具函数
│   │   └── helpers.js          # 辅助函数
│   ├── App.js              # 应用入口
│   ├── index.js            # 渲染入口
│   └── index.css           # 全局样式
├── public/                  # 静态资源
├── package.json            # 项目配置
└── README.md              # 项目说明
```

### 核心Hook: useRedPacket

`useRedPacket` Hook 封装了所有与红包相关的逻辑：

```javascript
const {
  // 状态
  redPacketInfo,
  contractBalance,
  userInfo,
  isOwner,
  
  // 红包功能
  createRedPacket,
  grabRedPacket,
  queryRedPacket,
  
  // 余额管理
  deposit,
  withdraw,
  
  // 用户信息
  setUserInfo,
  
  // 所有者功能
  transferToOwner,
  
  // 工具函数
  refreshData,
} = useRedPacket();
```

## 🎨 UI/UX 特性

### 设计原则
- **现代化**: 使用毛玻璃效果和渐变设计
- **响应式**: 支持桌面和移动设备
- **直观性**: 清晰的视觉层次和交互反馈
- **可访问性**: 良好的对比度和键盘导航

### 交互体验
- **实时反馈**: 加载状态和错误提示
- **动画效果**: 平滑的过渡和悬停效果
- **状态管理**: 智能的UI状态更新
- **错误处理**: 友好的错误信息显示

## 🔒 安全考虑

### 智能合约安全
- **权限控制**: 严格的所有者权限验证
- **重入保护**: 防止重入攻击
- **溢出检查**: 数值溢出保护
- **随机性**: 安全的伪随机数生成

### 前端安全
- **输入验证**: 严格的参数验证
- **错误处理**: 完善的异常处理机制
- **状态管理**: 安全的状态更新
- **类型检查**: 参数类型验证

## 🚨 注意事项

### Gas费用
- 所有链上操作都需要支付Gas费用
- 建议在Gas价格较低时进行交易
- 复杂操作（如创建红包）消耗更多Gas

### 网络支持
- 主要支持以太坊主网和测试网
- 确保钱包连接到正确的网络
- 不同网络的合约地址可能不同

### 资金安全
- 请确保私钥安全，不要分享给他人
- 在公共网络环境下谨慎操作
- 大额交易前请仔细核对参数

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范
- 使用ESLint和Prettier进行代码格式化
- 编写清晰的提交信息
- 添加必要的注释和文档
- 遵循React最佳实践

## 📊 版本历史

### v2.0.0 - 增强版 (当前)
- ✨ 全新的组件化架构
- 🎨 现代化UI设计
- 🔧 完整的功能模块
- 📱 响应式设计
- 🚀 性能优化

### v1.0.0 - 基础版
- 🎁 基本红包功能
- 💰 简单的余额管理
- 👤 用户信息存储
- 🏆 所有者权限

## 🐛 已知问题

- [ ] 红包历史记录功能需要完善合约调用
- [ ] 移动端某些交互体验待优化
- [ ] 需要添加更多网络支持

## 🔮 未来计划

- [ ] 添加红包模板功能
- [ ] 支持ERC-20代币红包
- [ ] 实现红包分享链接
- [ ] 添加红包统计分析
- [ ] 支持批量操作
- [ ] 集成更多钱包

## 📞 联系方式

- **作者**: chalee
- **邮箱**: your-email@example.com
- **GitHub**: [@PrettyKing](https://github.com/PrettyKing)
- **项目链接**: [chalee-truffle](https://github.com/PrettyKing/chalee-truffle)

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

感谢以下开源项目和开发者：

- [React](https://reactjs.org/) - 用于构建用户界面的JavaScript库
- [RainbowKit](https://www.rainbowkit.com/) - 最佳的Web3钱包连接体验
- [Wagmi](https://wagmi.sh/) - React Hooks for Ethereum
- [TailwindCSS](https://tailwindcss.com/) - 实用优先的CSS框架
- [Viem](https://viem.sh/) - TypeScript界面for Ethereum

---

💡 **提示**: 这是一个教育和演示项目，请在生产环境使用前进行充分的安全审计。