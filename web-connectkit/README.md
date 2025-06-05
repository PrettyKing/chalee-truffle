# Chalee DApp - ConnectKit版红包应用 🎉

🎊 基于以太坊的去中心化红包应用，现已迁移至 ConnectKit，提供更优秀的钱包连接体验！

## 🆕 ConnectKit 迁移更新

### 🔄 技术栈升级
- ✅ **移除 RainbowKit**: 完全替换为 ConnectKit
- ✅ **移除 ethers**: 使用 viem 作为唯一以太坊客户端库
- ✅ **现代化配置**: 采用 ConnectKit 的最新配置方式
- ✅ **主题定制**: 支持 ConnectKit 的主题自定义
- ✅ **更好的兼容性**: 更广泛的钱包支持

### 🎨 UI/UX 优势
- 🌟 **更现代的设计**: ConnectKit 提供更现代化的连接界面
- 🎯 **更好的用户体验**: 简化的连接流程
- 📱 **移动端优化**: 更好的移动设备兼容性
- 🔧 **自定义主题**: 可定制的外观和感觉

## ✨ 核心功能特性

### 🎁 红包系统
- **创建红包**: 支持随机红包和等额红包
- **抢红包**: 实时抢夺红包，公平分配
- **红包查询**: 查看红包状态、进度和详情
- **历史记录**: 浏览最近的红包活动
- **状态追踪**: 实时显示红包抢夺进度

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
- **ConnectKit**: 优雅的Web3钱包连接库 ⭐ NEW
- **Wagmi**: 强大的以太坊React Hooks
- **TailwindCSS**: 实用的CSS框架
- **Viem**: 轻量级以太坊库（唯一的以太坊客户端）

### 样式增强
- **CSS Grid/Flexbox**: 现代布局系统
- **CSS变量**: 动态主题支持
- **关键帧动画**: 流畅的UI动画
- **媒体查询**: 完整的响应式设计

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
- 点击 ConnectKit 的连接按钮
- 选择您的Web3钱包（支持更多钱包类型）
- 确认连接请求
- 享受更流畅的连接体验

### 2. 创建红包
1. 切换到"🎁 红包"标签
2. 选择红包类型（随机/等额）
3. 输入红包金额和个数
4. 点击"创建红包"按钮
5. 确认交易
6. 等待交易确认

### 3. 抢红包
1. 在红包信息区域输入红包ID
2. 点击"查询"按钮查看红包详情
3. 查看精美的红包卡片显示
4. 如果可以抢夺，点击"🎁 抢红包"
5. 确认交易
6. 享受抢红包动画效果

### 4. 查看历史
1. 切换到"📜 历史"标签
2. 浏览红包历史列表
3. 点击红包项查看详细信息
4. 使用弹窗查看完整红包详情

## 🔧 开发指南

### 项目结构
```
web-connectkit/
├── src/
│   ├── components/          # React组件
│   │   ├── RedPacketApp.jsx    # 主应用组件（已更新）
│   │   ├── CreateRedPacket.jsx # 创建红包组件
│   │   ├── RedPacketInfo.jsx   # 红包信息组件
│   │   ├── UserInfoManager.jsx # 用户信息管理
│   │   ├── BalanceManager.jsx  # 余额管理
│   │   ├── OwnerPanel.jsx      # 所有者面板
│   │   ├── PacketHistory.jsx   # 红包历史
│   │   └── WalletConnect.jsx   # 钱包连接（已更新）
│   ├── hooks/               # 自定义Hooks
│   │   └── useRedPacket.js     # 红包相关逻辑
│   ├── contracts/           # 合约配置
│   │   └── ChaleeDApp.js       # 合约ABI和地址
│   ├── utils/               # 工具函数
│   │   └── helpers.js          # 辅助函数（使用viem）
│   ├── App.js              # 应用入口（已更新）
│   ├── index.js            # 渲染入口
│   └── index.css           # 全局样式
├── public/                  # 静态资源
├── package.json            # 项目配置（已更新）
└── README.md              # 项目说明（已更新）
```

### ConnectKit 配置示例

```javascript
// App.js - ConnectKit 配置
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    appName: 'Chalee DApp - 红包应用',
    appDescription: '基于以太坊的去中心化红包应用',
    walletConnectProjectId: process.env.REACT_APP_PROJECT_ID,
    chains: [mainnet, polygon, localhost],
    providers: [alchemyProvider(), publicProvider()]
  })
);
```

### ConnectKit 按钮使用

```javascript
// 基础用法
import { ConnectKitButton } from 'connectkit';

<ConnectKitButton 
  theme="retro"
  showBalance={true}
  showAvatar={true}
/>

// 自定义按钮
<ConnectKitButton.Custom>
  {({ isConnected, show, truncatedAddress, ensName }) => {
    return (
      <button onClick={show}>
        {isConnected ? ensName ?? truncatedAddress : "连接钱包"}
      </button>
    );
  }}
</ConnectKitButton.Custom>
```

## 🔄 迁移指南

### 从 RainbowKit 迁移的主要变化

1. **依赖变更**
```bash
# 移除
npm uninstall @rainbow-me/rainbowkit ethers

# 添加
npm install connectkit
```

2. **配置变更**
```javascript
// 旧配置 (RainbowKit)
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

// 新配置 (ConnectKit)
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
```

3. **按钮组件变更**
```javascript
// 旧方式
import { ConnectButton } from '@rainbow-me/rainbowkit';
<ConnectButton />

// 新方式
import { ConnectKitButton } from 'connectkit';
<ConnectKitButton />
```

### 兼容性说明
- ✅ 所有原有功能保持不变
- ✅ 智能合约无需修改
- ✅ 用户数据完全兼容
- ✅ 所有链配置保持一致

## 🎯 ConnectKit 优势

### 更好的用户体验
- **更快的连接**: 优化的连接流程
- **更多钱包支持**: 支持更多主流钱包
- **更好的错误处理**: 友好的错误提示
- **更现代的设计**: 现代化的UI界面

### 开发者友好
- **更简单的配置**: 简化的设置过程
- **更好的TypeScript支持**: 完整的类型定义
- **更灵活的自定义**: 丰富的自定义选项
- **更小的包体积**: 更轻量的依赖

### 技术优势
- **更好的性能**: 优化的代码执行
- **更稳定的连接**: 减少连接问题
- **更安全的实现**: 增强的安全措施
- **更好的维护**: 活跃的社区支持

## 🔒 安全增强

### 输入验证
- **数值范围检查**: 严格的边界验证
- **类型安全**: BigInt和数值类型处理（使用viem）
- **参数清理**: 输入内容过滤和验证

### 错误处理
- **友好错误消息**: 可读的错误提示
- **降级方案**: 功能降级策略
- **日志记录**: 调试和错误追踪

## 🎯 性能优化

### 代码优化
- **移除ethers依赖**: 减少包体积
- **使用viem**: 更高效的以太坊交互
- **防抖处理**: 频繁操作防抖
- **组件懒加载**: 按需加载组件

### 用户体验
- **更快的钱包连接**: ConnectKit优化
- **清晰的加载状态**: 加载指示器
- **自动重试机制**: 错误恢复
- **智能缓存**: 数据缓存策略

## 🚨 注意事项

### 迁移注意点
- 确保所有依赖已正确更新
- 测试所有钱包连接功能
- 验证主题和样式正常显示
- 检查移动端兼容性

### 环境要求
- Node.js >= 16.0.0
- 确保 WalletConnect Project ID 配置正确
- Alchemy API Key（如果使用）

## 🔮 未来计划

### v2.1.0 计划
- [ ] 添加更多 ConnectKit 主题
- [ ] 集成 ConnectKit 的高级功能
- [ ] 优化移动端体验
- [ ] 添加更多钱包支持

### v3.0.0 愿景
- [ ] 多链支持优化
- [ ] NFT红包功能
- [ ] 社交功能集成
- [ ] DAO治理模块

## 📞 联系方式

- **作者**: chalee
- **GitHub**: [@PrettyKing](https://github.com/PrettyKing)
- **项目链接**: [chalee-truffle](https://github.com/PrettyKing/chalee-truffle)

## 🙏 致谢

特别感谢：
- **ConnectKit团队**: 提供优秀的钱包连接解决方案
- **Viem团队**: 高效的以太坊客户端库
- **React生态**: 强大的前端框架支持
- **Web3社区**: 丰富的工具链和最佳实践

---

💡 **提示**: 本版本已完全迁移至 ConnectKit，移除了 ethers 依赖，使用 viem 作为唯一的以太坊客户端库。

🎉 **欢迎体验 ConnectKit 版本，享受更现代化的钱包连接体验！**