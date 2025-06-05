# Chalee DApp - ConnectKit版本

基于以太坊的去中心化红包应用，采用 ConnectKit + Wagmi v2 现代化架构，完全重构以匹配 web-html 项目的玻璃态设计风格。

## ✨ 重构亮点

### 🎨 设计升级
- **完全采用 web-html 的现代化玻璃态设计**
- 渐变背景 + 动态浮动粒子效果
- 玻璃态卡片（Glassmorphism）设计
- 流畅的动画过渡效果
- 响应式布局，支持移动端

### 🛠 技术栈升级
- **Wagmi v2** - 最新的以太坊 React Hooks
- **ConnectKit v1.8+** - 现代化的钱包连接体验
- **Viem v2** - 高性能的以太坊客户端
- **React Query v4** - 强大的数据同步
- **TailwindCSS v3** - 工具类CSS框架

### 🔧 架构改进
- 完全重构的组件系统
- 统一的错误处理和状态管理
- 优化的用户交互体验
- 更好的代码组织和可维护性

## 📁 项目结构

```
web-connectkit/
├── public/                 # 静态资源
├── src/
│   ├── components/         # 核心组件
│   │   ├── RedPacketApp.jsx       # 主应用组件
│   │   ├── UserInfoManager.jsx    # 用户信息管理
│   │   ├── BalanceManager.jsx     # 余额管理（存取款）
│   │   ├── CreateRedPacket.jsx    # 创建红包
│   │   ├── RedPacketInfo.jsx      # 红包状态和抢取
│   │   ├── PacketHistory.jsx      # 红包历史记录
│   │   ├── OwnerPanel.jsx         # 所有者操作面板
│   │   └── WalletConnect.jsx      # 钱包连接组件
│   ├── hooks/              # 自定义 Hooks
│   │   └── useRedPacket.js        # 红包相关逻辑
│   ├── contracts/          # 智能合约配置
│   ├── utils/              # 工具函数
│   ├── styles/             # 样式文件
│   ├── App.js              # 应用入口（Wagmi v2配置）
│   ├── index.css           # 全局样式（玻璃态设计）
│   └── index.js            # React 入口
├── package.json            # 依赖配置
├── tailwind.config.js      # TailwindCSS 配置
└── README.md              # 项目说明
```

## 🚀 核心功能

### 💼 用户功能
- **💳 钱包连接** - 使用 ConnectKit 的现代化连接体验
- **👤 信息管理** - 设置和查看用户信息
- **💰 余额管理** - 存入和提取 ETH
- **🎁 红包系统** - 创建、查询、抢取红包
- **📜 历史记录** - 查看红包历史

### 🏆 所有者功能
- **📊 合约管理** - 转移合约资金
- **🔄 系统重置** - 重置红包计数器（测试功能）

## 🎨 设计特色

### 玻璃态效果 (Glassmorphism)
```css
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}
```

### 动态背景
- 渐变色背景（紫色到蓝色）
- 浮动粒子动画效果
- 卡片悬停动画

### 现代化交互
- 流畅的按钮动画
- 智能状态指示器
- 响应式进度条
- 优雅的加载状态

## 📱 响应式设计

- **桌面端**: 网格布局，最佳视觉效果
- **平板端**: 自适应布局
- **移动端**: 单列布局，优化触摸体验

## 🔧 开发指南

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- 现代浏览器支持

### 安装依赖
```bash
cd web-connectkit
npm install
```

### 开发模式
```bash
npm start
# 或
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 环境配置
创建 `.env` 文件：
```env
REACT_APP_PROJECT_ID=your_walletconnect_project_id
REACT_APP_ALCHEMY_ID=your_alchemy_api_key
```

## 🔗 与 web-html 的对比

| 特性 | web-html | web-connectkit |
|------|----------|---------------|
| 技术栈 | Vanilla JS + jQuery | React + Wagmi v2 |
| 钱包连接 | 原生 MetaMask API | ConnectKit（支持多钱包）|
| 样式系统 | 纯 CSS | CSS + TailwindCSS |
| 状态管理 | 全局变量 | React Hooks + Context |
| 组件化 | 无 | 完全组件化 |
| TypeScript | 无 | 可选支持 |
| 开发体验 | 基础 | 现代化工具链 |

## 🎁 红包系统详解

### 创建红包
1. 输入金额和数量
2. 选择随机分配
3. 确认交易
4. 自动显示最新红包

### 抢取红包
1. 查询红包状态
2. 查看剩余数量和金额
3. 点击抢红包按钮
4. 确认交易

### 历史记录
- 显示最近10个红包
- 点击查看详细信息
- 实时状态更新

## 🏗 技术架构

### Wagmi v2 配置
```javascript
import { createConfig } from 'wagmi';
import { getDefaultConfig } from 'connectkit';

const config = createConfig(
  getDefaultConfig({
    appName: 'Chalee DApp',
    chains: [mainnet, polygon, localhost],
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [localhost.id]: http(),
    },
  })
);
```

### ConnectKit 主题定制
```javascript
<ConnectKitProvider
  theme="auto"
  customTheme={{
    '--ck-connectbutton-background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    '--ck-connectbutton-box-shadow': '0 4px 15px rgba(102, 126, 234, 0.4)',
    '--ck-border-radius': '12px',
  }}
>
```

## 🎯 核心优势

### 用户体验
- **一键连接** - 支持 MetaMask、WalletConnect 等多种钱包
- **实时反馈** - 所有操作都有清晰的状态提示
- **响应式设计** - 完美适配各种设备
- **现代化UI** - 玻璃态设计，视觉效果出众

### 开发体验
- **类型安全** - Wagmi v2 提供完整的 TypeScript 支持
- **热更新** - 开发时实时预览
- **模块化** - 组件化架构，易于维护
- **可扩展** - 易于添加新功能

### 性能优化
- **懒加载** - 组件按需加载
- **缓存策略** - React Query 智能缓存
- **打包优化** - 生产构建自动优化

## 🚀 部署指南

### 本地部署
```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

### Vercel 部署
```bash
# 连接到 Vercel
vercel

# 部署
vercel --prod
```

### Netlify 部署
```bash
# 构建
npm run build

# 上传 build 目录到 Netlify
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 创建 Pull Request

### 代码规范
- 使用 ESLint 和 Prettier
- 遵循 React Hooks 最佳实践
- 组件命名使用 PascalCase
- 文件命名使用 camelCase

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- **ConnectKit** - 提供优秀的钱包连接体验
- **Wagmi** - 强大的以太坊 React Hooks
- **Viem** - 高性能的以太坊客户端
- **TailwindCSS** - 实用的CSS框架

## 📞 联系方式

- 作者: chalee
- GitHub: [@PrettyKing](https://github.com/PrettyKing)
- 项目地址: [chalee-truffle](https://github.com/PrettyKing/chalee-truffle)

---

> 🎉 这是一个现代化的以太坊 DApp 重构示例，展示了如何将传统的 Vanilla JS 应用升级为基于 React + Wagmi v2 + ConnectKit 的现代化架构，并采用了最新的玻璃态设计风格。