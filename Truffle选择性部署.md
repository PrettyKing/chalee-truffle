### 🎯 1. **迁移文件范围部署**（最常用）
```bash
# 只执行特定迁移文件
truffle migrate --f 2 --to 2 --network sepolia  # 只部署第2个文件

# 执行范围内的迁移
truffle migrate --f 2 --to 4 --network sepolia   # 部署第2到4个文件

# 从某个迁移开始
truffle migrate --f 3 --network sepolia          # 从第3个开始部署所有
```

### 🎯 2. **环境变量控制**
```bash
# 在命令行中设置环境变量
DEPLOY_TOKEN=true DEPLOY_EXCHANGE=false truffle migrate --network sepolia

# 在.env文件中配置，然后执行
truffle migrate --network sepolia
```

### 🎯 3. **网络配置控制**
在`truffle-config.js`中为不同网络设置不同的部署配置：
```javascript
networks: {
  sepolia: {
    deployConfig: {
      deployToken: true,
      deployExchange: false,
      deployMarketplace: false
    }
  }
}
```

### 🎯 4. **自定义脚本部署**
```bash
truffle exec scripts/selective-deploy.js --token --network sepolia
truffle exec scripts/selective-deploy.js --exchange --network sepolia
```

### 🎯 5. **条件逻辑部署**
在迁移文件中使用if条件：
```javascript
if (network === 'sepolia' && process.env.DEPLOY_TOKEN === 'true') {
  await deployer.deploy(CHMToken, 1000000);
}
```

### 🎯 6. **标签和状态检查**
检查合约是否已部署，避免重复部署：
```javascript
const existingContracts = await checkExistingContracts();
if (!existingContracts.token) {
  await deployer.deploy(CHMToken, 1000000);
}
```

### 📋 **实际使用建议**

**开发阶段：**
```bash
# 快速重新部署所有合约
truffle migrate --reset --network development

# 只测试新的市场合约
truffle migrate --f 4 --to 4 --network development
```

**测试网部署：**
```bash
# 分阶段部署，便于调试
npm run deploy:token:sepolia
npm run deploy:exchange:sepolia  
npm run deploy:marketplace:sepolia
```

**主网部署：**
```bash
# 使用环境变量，更安全
DEPLOY_MARKETPLACE=true CHM_TOKEN_ADDRESS=0x... truffle

### 🛡️ **最佳实践和注意事项**### 🎯 **核心要点总结**

#### **1. 选择合适的部署方法**
- **简单项目**: 使用迁移文件范围 (`--f 2 --to 3`)
- **复杂项目**: 使用环境变量 + 条件逻辑
- **生产环境**: 使用部署辅助工具 + 安全检查

#### **2. 常用命令速查**
```bash
# 基础选择性部署
truffle migrate --f 2 --to 2 --network sepolia  # 只部署第2个文件
truffle migrate --f 3 --network sepolia          # 从第3个开始部署

# 环境变量控制
DEPLOY_TOKEN=false DEPLOY_EXCHANGE=true truffle migrate --network sepolia

# 自定义脚本
truffle exec scripts/selective-deploy.js --token --network sepolia

# 重置重新部署
truffle migrate --reset --network sepolia
```

#### **3. 安全最佳实践**
- ✅ 部署前检查账户余额
- ✅ 估算Gas费用
- ✅ 验证部署环境
- ✅ 保存部署记录
- ✅ 部署后验证合约状态
- ✅ 主网部署前充分测试

#### **4. 推荐的项目结构**
```
├── contracts/
├── migrations/
│   ├── 1_initial_migration.js
│   ├── 2_deploy_token.js
│   ├── 3_deploy_exchange.js
│   ├── 4_deploy_marketplace.js
│   └── utils/deploymentHelper.js
├── scripts/
│   ├── selective-deploy.js
│   ├── monitor-deployment.js
│   └── emergency-pause.js
├── .env
├── deployments.json
└── package.json
```

#### **5. 实际使用流程建议**

**开发阶段:**
```bash
# 快速测试单个合约
truffle migrate --f 4 --to 4 --network development
```

**测试网部署:**
```bash
# 分步部署，便于调试
npm run deploy:token:sepolia
npm run deploy:exchange:sepolia
npm run deploy:marketplace:sepolia
```

**主网部署:**
```bash
# 使用安全脚本，包含所有检查
truffle migrate --network mainnet
truffle exec scripts/monitor-deployment.js --network mainnet
```

这样你就可以灵活地选择部署策略，既能提高开发效率，又能确保生产环境的安全性！