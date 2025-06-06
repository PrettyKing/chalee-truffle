# Web ConnectKit

这是一个基于 React 17 和 Tailwind CSS 的前端应用，专为集成 ConnectKit 而设计。

## 特性

- ⚛️ React 17.0.2
- 🎨 Tailwind CSS 3.3.0
- 📱 响应式设计
- 🚀 现代构建工具
- 🔗 准备集成 ConnectKit

## 快速开始

### 安装依赖

```bash
cd web-connectkit
npm install
```

### 启动开发服务器

```bash
npm start
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 项目结构

```
web-connectkit/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── App.js          # 主应用组件
│   ├── App.css         # 应用样式
│   ├── App.test.js     # 应用测试
│   ├── index.js        # 应用入口
│   ├── index.css       # 全局样式（包含 Tailwind）
│   ├── reportWebVitals.js
│   └── setupTests.js
├── package.json
├── tailwind.config.js  # Tailwind 配置
├── postcss.config.js   # PostCSS 配置
└── README.md
```

## Tailwind CSS 配置

Tailwind CSS 已经配置完成，你可以直接在组件中使用 Tailwind 的工具类：

```jsx
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Hello Tailwind!
</div>
```

### 自定义配置

编辑 `tailwind.config.js` 来自定义主题：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#3b82f6',
          600: '#2563eb',
        },
      },
    },
  },
}
```

## 添加 ConnectKit

要添加 ConnectKit 支持，运行：

```bash
npm install connectkit wagmi viem
```

然后在你的应用中配置 ConnectKit。

## 可用脚本

- `npm start` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm test` - 运行测试
- `npm run eject` - 弹出配置（不可逆）

## 技术栈

- React 17.0.2
- Tailwind CSS 3.3.0
- PostCSS
- Autoprefixer
- React Scripts 4.0.3

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## License

MIT
