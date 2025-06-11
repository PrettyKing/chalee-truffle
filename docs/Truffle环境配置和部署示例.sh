
# ===================================
# package.json 脚本配置
# ===================================

# {
#   "scripts": {
#     "compile": "truffle compile",
#     "test": "truffle test",
#     
#     "// 完整部署",
#     "deploy:dev": "truffle migrate --network development",
#     "deploy:sepolia": "truffle migrate --network sepolia",
#     "deploy:mainnet": "truffle migrate --network mainnet",
#     
#     "// 选择性部署 - 只部署代币",
#     "deploy:token:sepolia": "DEPLOY_TOKEN=true DEPLOY_EXCHANGE=false DEPLOY_MARKETPLACE=false truffle migrate --network sepolia",
#     
#     "// 选择性部署 - 只部署交易所（需要已有代币）",
#     "deploy:exchange:sepolia": "DEPLOY_TOKEN=false DEPLOY_EXCHANGE=true DEPLOY_MARKETPLACE=false truffle migrate --network sepolia",
#     
#     "// 选择性部署 - 只部署市场（需要已有代币）",
#     "deploy:marketplace:sepolia": "DEPLOY_TOKEN=false DEPLOY_EXCHANGE=false DEPLOY_MARKETPLACE=true truffle migrate --network sepolia",
#     
#     "// 使用自定义脚本的选择性部署",
#     "deploy:custom:token": "truffle exec scripts/selective-deploy.js --token --network sepolia",
#     "deploy:custom:exchange": "truffle exec scripts/selective-deploy.js --exchange --network sepolia",
#     "deploy:custom:marketplace": "truffle exec scripts/selective-deploy.js --marketplace --network sepolia",
#     "deploy:custom:all": "truffle exec scripts/selective-deploy.js --all --network sepolia",
#     
#     "// 迁移文件范围部署",
#     "migrate:token": "truffle migrate --f 2 --to 2 --network sepolia",
#     "migrate:exchange": "truffle migrate --f 3 --to 3 --network sepolia", 
#     "migrate:marketplace": "truffle migrate --f 4 --to 4 --network sepolia",
#     "migrate:from-exchange": "truffle migrate --f 3 --network sepolia",
#     
#     "// 重置和重新部署",
#     "redeploy:dev": "truffle migrate --reset --network development",
#     "redeploy:sepolia": "truffle migrate --reset --network sepolia",
#     
#     "// 验证合约",
#     "verify:sepolia": "truffle run verify CHMToken CHMExchange CourseMarketplace --network sepolia",
#     
#     "// 交互脚本",
#     "interact": "truffle exec scripts/interact.js --network sepolia"
#   }
# }

# ===================================
# 实际使用命令示例
# ===================================

# 1. 基本选择性部署命令

# 只部署代币合约
truffle migrate --f 2 --to 2 --network sepolia

# 只部署交易所合约（假设代币已部署）
truffle migrate --f 3 --to 3 --network sepolia

# 只部署市场合约（假设代币已部署）
truffle migrate --f 4 --to 4 --network sepolia

# 部署从第3个迁移开始的所有合约
truffle migrate --f 3 --network sepolia

# 重新部署所有合约
truffle migrate --reset --network sepolia

# ===================================
# 2. 使用环境变量的选择性部署

# 只部署代币
DEPLOY_TOKEN=true DEPLOY_EXCHANGE=false DEPLOY_MARKETPLACE=false truffle migrate --network sepolia

# 只部署交易所
DEPLOY_TOKEN=false DEPLOY_EXCHANGE=true DEPLOY_MARKETPLACE=false CHM_TOKEN_ADDRESS=0x123... truffle migrate --network sepolia

# 只部署市场
DEPLOY_TOKEN=false DEPLOY_EXCHANGE=false DEPLOY_MARKETPLACE=true CHM_TOKEN_ADDRESS=0x123... truffle migrate --network sepolia

# 部署代币和交易所，但不部署市场
DEPLOY_TOKEN=true DEPLOY_EXCHANGE=true DEPLOY_MARKETPLACE=false truffle migrate --network sepolia

# ===================================
# 3. 使用自定义脚本的选择性部署

# 使用npm脚本
npm run deploy:custom:token
npm run deploy:custom:exchange  
npm run deploy:custom:marketplace
npm run deploy:custom:all

# 直接使用truffle exec
truffle exec scripts/selective-deploy.js --token --network sepolia
truffle exec scripts/selective-deploy.js --exchange --network sepolia
truffle exec scripts/selective-deploy.js --marketplace --network sepolia
truffle exec scripts/selective-deploy.js --all --network sepolia

# ===================================
# 4. 分阶段部署示例

# 第一阶段：部署代币
echo "第一阶段：部署CHM代币合约"
DEPLOY_TOKEN=true DEPLOY_EXCHANGE=false DEPLOY_MARKETPLACE=false truffle migrate --network sepolia

# 等待确认，然后部署交易所
echo "第二阶段：部署CHM交易所合约"  
DEPLOY_TOKEN=false DEPLOY_EXCHANGE=true DEPLOY_MARKETPLACE=false truffle migrate --f 3 --to 3 --network sepolia

# 最后部署市场
echo "第三阶段：部署课程市场合约"
DEPLOY_TOKEN=false DEPLOY_EXCHANGE=false DEPLOY_MARKETPLACE=true truffle migrate --f 4 --to 4 --network sepolia

# ===================================
# 5. 条件部署脚本示例
# ===================================

#!/bin/bash
# deploy.sh - 智能部署脚本

set -e

NETWORK=${1:-sepolia}
ACTION=${2:-all}

echo "开始部署到网络: $NETWORK"
echo "部署动作: $ACTION"

case $ACTION in
  "token")
    echo "只部署CHM代币合约..."
    DEPLOY_TOKEN=true DEPLOY_EXCHANGE=false DEPLOY_MARKETPLACE=false truffle migrate --f 2 --to 2 --network $NETWORK
    ;;
  "exchange")
    echo "只部署CHM交易所合约..."
    if [ -z "$CHM_TOKEN_ADDRESS" ]; then
      echo "错误: 请提供CHM_TOKEN_ADDRESS环境变量"
      exit 1
    fi
    DEPLOY_TOKEN=false DEPLOY_EXCHANGE=true DEPLOY_MARKETPLACE=false truffle migrate --f 3 --to 3 --network $NETWORK
    ;;
  "marketplace")
    echo "只部署课程市场合约..."
    if [ -z "$CHM_TOKEN_ADDRESS" ]; then
      echo "错误: 请提供CHM_TOKEN_ADDRESS环境变量"
      exit 1
    fi
    DEPLOY_TOKEN=false DEPLOY_EXCHANGE=false DEPLOY_MARKETPLACE=true truffle migrate --f 4 --to 4 --network $NETWORK
    ;;
  "all")
    echo "部署所有合约..."
    truffle migrate --network $NETWORK
    ;;
  "reset")
    echo "重置并重新部署所有合约..."
    truffle migrate --reset --network $NETWORK
    ;;
  *)
    echo "未知动作: $ACTION"
    echo "支持的动作: token, exchange, marketplace, all, reset"
    exit 1
    ;;
esac

echo "部署完成！"

# 使用方法:
# chmod +x deploy.sh
# ./deploy.sh sepolia token
# ./deploy.sh sepolia exchange  
# ./deploy.sh sepolia marketplace
# ./deploy.sh sepolia all
# ./deploy.sh sepolia reset

# ===================================
# 6. 验证部署状态脚本
# ===================================

#!/bin/bash
# check-deployment.sh - 检查部署状态

NETWORK=${1:-sepolia}

echo "检查网络 $NETWORK 上的合约部署状态..."

# 读取部署记录
if [ -f "contract-deployments.json" ]; then
  echo "找到部署记录文件"
  cat contract-deployments.json | jq ".$NETWORK"
else
  echo "未找到部署记录文件"
fi

# 检查build目录中的合约artifacts
echo ""
echo "检查编译的合约artifacts:"
ls -la build/contracts/*.json | grep -E "(CHMToken|CHMExchange|CourseMarketplace)" || echo "未找到合约artifacts"

# 使用truffle networks命令检查
echo ""
echo "使用truffle networks检查:"
truffle networks --network $NETWORK

# ===================================
# 7. 部署后配置脚本
# ===================================

#!/bin/bash
# post-deploy-config.sh - 部署后配置

NETWORK=${1:-sepolia}

echo "执行部署后配置..."

# 给交易所添加流动性
echo "给交易所添加流动性..."
truffle exec scripts/add-liquidity.js --network $NETWORK

# 验证合约
echo "验证合约..."
npm run verify:$NETWORK

# 运行基本交互测试
echo "运行基本交互测试..."
truffle exec scripts/basic-test.js --network $NETWORK

echo "部署后配置完成！"