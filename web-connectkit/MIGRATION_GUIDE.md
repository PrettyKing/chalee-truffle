# 🔄 ConnectKit 迁移指南

本指南将帮助您从 RainbowKit 版本迁移到 ConnectKit 版本，并移除 ethers 依赖。

## 📋 迁移概览

### 主要变化
- ✅ **RainbowKit → ConnectKit**: 更现代的钱包连接体验
- ✅ **移除 ethers**: 使用 viem 作为唯一以太坊客户端
- ✅ **优化配置**: 简化的设置过程
- ✅ **保持兼容**: 所有功能完全兼容

### 受影响的文件
- `package.json` - 依赖更新
- `src/App.js` - 配置更新
- `src/components/RedPacketApp.jsx` - 按钮组件更新
- `src/components/WalletConnect.jsx` - 连接组件更新
- `README.md` - 文档更新

## 🚀 快速迁移步骤

### 1. 备份当前版本
```bash
# 创建备份分支
git checkout -b backup-rainbowkit
git push origin backup-rainbowkit

# 切换到迁移分支
git checkout migrate-to-connectkit
```

### 2. 更新依赖
```bash
# 移除旧依赖
npm uninstall @rainbow-me/rainbowkit ethers

# 安装新依赖
npm install connectkit

# 验证安装
npm list connectkit
```

### 3. 更新配置文件

#### package.json
```json
{
  "dependencies": {
    "connectkit": "^1.8.2",
    "@tanstack/react-query": "^4.32.6",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "viem": "^1.19.9",
    "wagmi": "^1.4.12"
  }
}
```

#### src/App.js
```javascript
// 旧配置 (移除)
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';

// 新配置 (添加)
import 'connectkit/styles.css';
import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
```

### 4. 更新组件代码

#### ConnectButton 替换
```javascript
// 旧方式
import { ConnectButton } from '@rainbow-me/rainbowkit';
<ConnectButton />

// 新方式
import { ConnectKitButton } from 'connectkit';
<ConnectKitButton theme="retro" showBalance={true} showAvatar={true} />
```

### 5. 测试验证
```bash
# 启动开发服务器
npm start

# 检查控制台是否有错误
# 测试钱包连接功能
# 验证所有功能正常
```

## 📁 详细文件变更

### App.js 完整示例
```javascript
import 'connectkit/styles.css';
import {
  ConnectKitProvider,
  getDefaultConfig,
} from 'connectkit';
import { createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  goerli,
  sepolia,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RedPacketApp from './components/RedPacketApp';

// 自定义 localhost 配置
const localhost = {
  id: 1337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:7545'],
    },
    public: {
      http: ['http://127.0.0.1:7545'],
    },
  },
};

const config = createConfig(
  getDefaultConfig({
    appName: 'Chalee DApp - 红包应用',
    appDescription: '基于以太坊的去中心化红包应用',
    appUrl: 'https://family.co',
    appIcon: 'https://family.co/logo.png',
    walletConnectProjectId: process.env.REACT_APP_PROJECT_ID || 'YOUR_PROJECT_ID',
    chains: [
      mainnet, 
      polygon, 
      optimism, 
      arbitrum, 
      goerli, 
      sepolia,
      localhost,
    ],
    providers: [
      alchemyProvider({ 
        apiKey: process.env.REACT_APP_ALCHEMY_ID || 'YOUR_ALCHEMY_ID' 
      }),
      publicProvider()
    ],
    autoConnect: true,
  })
);

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          theme="auto"
          mode="light"
          options={{
            initialChainId: 0,
            customTheme: {
              '--ck-connectbutton-font-size': '16px',
              '--ck-connectbutton-border-radius': '12px',
              '--ck-connectbutton-color': '#373737',
              '--ck-connectbutton-background': '#ffffff',
              '--ck-connectbutton-box-shadow': '0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 6px -1px rgba(0, 0, 0, 0.10)',
            }
          }}
        >
          <RedPacketApp />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
```

### RedPacketApp.jsx 按钮更新
```javascript
// 导入更新
import { ConnectKitButton } from 'connectkit';

// 按钮使用
<div className="flex justify-center mb-6">
  <ConnectKitButton 
    theme="retro"
    showBalance={true}
    showAvatar={true}
  />
</div>
```

## 🔧 配置选项

### ConnectKit 主题选项
```javascript
<ConnectKitProvider
  theme="auto"          // "auto" | "light" | "dark"
  mode="light"          // "light" | "dark"
  options={{
    initialChainId: 0,
    customTheme: {
      // 自定义CSS变量
    }
  }}
>
```

### ConnectKitButton 选项
```javascript
<ConnectKitButton 
  theme="retro"         // "auto" | "light" | "dark" | "retro" | "soft" | "midnight" | "minimal" | "rounded"
  showBalance={true}    // 显示余额
  showAvatar={true}     // 显示头像
/>
```

## 🐛 常见问题解决

### 1. 样式问题
```bash
# 确保导入了 ConnectKit 样式
import 'connectkit/styles.css';
```

### 2. 连接问题
```javascript
// 确保 WalletConnect Project ID 正确配置
walletConnectProjectId: process.env.REACT_APP_PROJECT_ID
```

### 3. 类型错误
```bash
# 如果使用 TypeScript，安装类型定义
npm install --save-dev @types/connectkit
```

### 4. 钱包兼容性
```javascript
// ConnectKit 自动处理钱包兼容性
// 无需手动配置钱包列表
```

## ✅ 迁移检查清单

### 前置准备
- [ ] 备份当前代码到 `backup-rainbowkit` 分支
- [ ] 确保所有功能在迁移前正常工作
- [ ] 记录当前环境变量配置

### 依赖更新
- [ ] 移除 `@rainbow-me/rainbowkit`
- [ ] 移除 `ethers`
- [ ] 安装 `connectkit`
- [ ] 验证 `viem` 和 `wagmi` 版本

### 代码更新
- [ ] 更新 `App.js` 配置
- [ ] 更新 `RedPacketApp.jsx` 按钮
- [ ] 更新 `WalletConnect.jsx` 组件
- [ ] 检查所有导入语句

### 测试验证
- [ ] 钱包连接功能
- [ ] 创建红包功能
- [ ] 抢红包功能
- [ ] 余额管理功能
- [ ] 用户信息功能
- [ ] 所有者权限功能
- [ ] 移动端兼容性

### 部署准备
- [ ] 更新环境变量
- [ ] 测试生产构建
- [ ] 验证所有链配置
- [ ] 更新部署文档

## 🔄 回滚计划

如果迁移遇到问题，可以快速回滚：

```bash
# 回滚到备份版本
git checkout backup-rainbowkit

# 或者重新安装旧依赖
npm install @rainbow-me/rainbowkit ethers
npm uninstall connectkit
```

## 📞 获取帮助

如果在迁移过程中遇到问题：

1. **检查控制台错误**: 查看浏览器开发者工具
2. **查看文档**: [ConnectKit 官方文档](https://docs.family.co/connectkit)
3. **社区支持**: [GitHub Issues](https://github.com/PrettyKing/chalee-truffle/issues)

## 🎉 迁移完成

迁移完成后，您将享受到：
- 更现代的钱包连接体验
- 更好的移动端兼容性
- 更小的包体积（移除了 ethers）
- 更稳定的连接性能
- 更丰富的自定义选项

---

💡 **提示**: 建议在测试环境完成迁移验证后，再部署到生产环境。