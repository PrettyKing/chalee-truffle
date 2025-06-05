# useRedPacket Hooks 重构说明

## 重构概述

原来的 `useRedPacket.js` 文件包含了 400+ 行代码，承担了太多责任。为了提高代码的可维护性、可测试性和可复用性，我们将其拆分为多个专门的 hooks。

## 新的 Hooks 架构

### 1. `useContract.js` - 基础合约信息
**职责**: 处理合约的基础信息获取
- 合约所有者信息
- 合约余额
- 当前红包ID
- 基础数据刷新功能

**导出内容**:
```javascript
{
  owner,           // 合约所有者地址
  balance,         // 原始余额数据
  packetId,        // 当前红包ID数字
  contractBalance, // 格式化的余额字符串
  refetchBalance,  // 刷新余额函数
  refetchPacketId, // 刷新红包ID函数
}
```

### 2. `useRedPacketQuery.js` - 红包查询功能
**职责**: 专门处理红包信息的查询和管理
- 红包信息查询
- 查询状态管理
- 错误处理
- 自动查询最新红包

**导出内容**:
```javascript
{
  redPacketInfo,        // 查询到的红包信息
  currentPacketId,      // 当前查询的红包ID
  queryError,           // 查询错误信息
  isQueryingPacket,     // 是否正在查询
  queryRedPacket,       // 查询指定红包函数
  autoQueryLatestPacket,// 自动查询最新红包函数
  refetchPacketInfo,    // 重新获取红包信息
  setCurrentPacketId,   // 设置当前红包ID
}
```

### 3. `useRedPacketCreate.js` - 红包创建功能
**职责**: 专门处理红包的创建
- 红包创建逻辑
- 参数验证
- 交易状态管理

**导出内容**:
```javascript
{
  createRedPacket,    // 创建红包函数
  isCreating,         // 是否正在创建
  isCreateSuccess,    // 创建是否成功
  createError,        // 创建错误信息
  resetCreateConfig,  // 重置创建配置
}
```

### 4. `useRedPacketGrab.js` - 抢红包功能
**职责**: 专门处理抢红包逻辑
- 抢红包操作
- 状态验证
- 交易状态管理

**导出内容**:
```javascript
{
  grabRedPacket,     // 抢红包函数
  isGrabbing,        // 是否正在抢红包
  isGrabSuccess,     // 抢红包是否成功
  grabError,         // 抢红包错误信息
  resetGrabConfig,   // 重置抢红包配置
}
```

### 5. `useContractBalance.js` - 余额操作功能
**职责**: 专门处理存款和提款操作
- 存款功能
- 提款功能
- 金额验证
- 交易状态管理

**导出内容**:
```javascript
{
  deposit,           // 存款函数
  withdraw,          // 提款函数
  isDepositing,      // 是否正在存款
  isWithdrawing,     // 是否正在提款
  isDepositSuccess,  // 存款是否成功
  isWithdrawSuccess, // 提款是否成功
  depositError,      // 存款错误信息
  withdrawError,     // 提款错误信息
  resetConfigs,      // 重置配置
}
```

### 6. `useUserInfo.js` - 用户信息管理
**职责**: 专门处理用户信息的获取和设置
- 获取用户信息
- 设置用户信息
- 信息验证

**导出内容**:
```javascript
{
  userInfo,           // 用户信息对象 {name, age}
  setUserInfo,        // 设置用户信息函数
  isSettingInfo,      // 是否正在设置信息
  isSetInfoSuccess,   // 设置是否成功
  setInfoError,       // 设置错误信息
  refetchUserInfo,    // 重新获取用户信息
  resetSetInfoConfig, // 重置设置配置
}
```

### 7. `useOwnerOperations.js` - 所有者操作
**职责**: 专门处理所有者权限相关的操作
- 所有者身份验证
- 转移到所有者操作
- 权限检查

**导出内容**:
```javascript
{
  isOwner,             // 是否为所有者
  transferToOwner,     // 转移到所有者函数
  isTransferring,      // 是否正在转移
  isTransferSuccess,   // 转移是否成功
  transferError,       // 转移错误信息
  checkOwnership,      // 检查所有者身份函数
  resetTransferConfig, // 重置转移配置
}
```

### 8. `useRedPacket.js` - 重构后的主 Hook
**职责**: 组合所有专门的 hooks，提供统一的接口
- 组合所有子 hooks
- 协调各种操作
- 提供向后兼容的接口
- 统一的状态管理

## 重构的优势

### 1. **单一职责原则**
每个 hook 只负责一个特定的功能域，使代码更易理解和维护。

### 2. **更好的可测试性**
可以单独测试每个 hook 的功能，而不需要测试整个庞大的 hook。

### 3. **更好的可复用性**
如果某个组件只需要查询红包信息，可以只使用 `useRedPacketQuery`，而不需要引入整个 `useRedPacket`。

### 4. **更清晰的依赖关系**
每个 hook 的依赖关系更加明确，便于理解数据流。

### 5. **更好的性能**
可以避免不必要的重新渲染，因为只有相关的状态发生变化时，对应的组件才会重新渲染。

### 6. **向后兼容**
重构后的主 `useRedPacket` hook 保持了原有的 API 接口，现有代码无需修改。

## 使用方式

### 使用完整功能（推荐用于主要组件）
```javascript
import { useRedPacket } from '../hooks';

function MainComponent() {
  const {
    createRedPacket,
    grabRedPacket,
    queryRedPacket,
    // ... 其他功能
  } = useRedPacket();
  
  // 使用所有功能
}
```

### 使用特定功能（推荐用于专门组件）
```javascript
import { useRedPacketQuery, useRedPacketCreate } from '../hooks';

function RedPacketQueryComponent() {
  const {
    redPacketInfo,
    queryRedPacket,
    isQueryingPacket,
  } = useRedPacketQuery();
  
  // 只使用查询功能
}

function CreateRedPacketComponent() {
  const {
    createRedPacket,
    isCreating,
    createError,
  } = useRedPacketCreate();
  
  // 只使用创建功能
}
```

## 文件结构
```
src/hooks/
├── index.js                 # 导出所有 hooks
├── useRedPacket.js          # 主 hook（重构后）
├── useContract.js           # 基础合约信息
├── useRedPacketQuery.js     # 红包查询功能
├── useRedPacketCreate.js    # 红包创建功能
├── useRedPacketGrab.js      # 抢红包功能
├── useContractBalance.js    # 余额操作功能
├── useUserInfo.js           # 用户信息管理
└── useOwnerOperations.js    # 所有者操作
```

## 迁移指南

### 对于现有组件
现有使用 `useRedPacket` 的组件无需任何修改，因为主 hook 保持了相同的 API 接口。

### 对于新组件
建议根据需要选择合适的 hook：
- 如果需要完整功能，使用 `useRedPacket`
- 如果只需要特定功能，使用对应的专门 hook

这次重构显著提高了代码的质量和可维护性，同时保持了向后兼容性。