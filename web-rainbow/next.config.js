/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // 环境变量配置
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Red Packet DApp',
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION || '基于以太坊的去中心化红包应用',
  },
  
  // 图片优化配置
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'raw.githubusercontent.com',
    ],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Webpack 配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加对 Web3 相关包的支持
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // 开发环境下的额外配置
    if (dev) {
      config.devtool = 'eval-source-map';
    }
    
    return config;
  },
  
  // 实验性功能
  experimental: {
    // 启用新的应用目录结构（如果需要）
    // appDir: true,
  },
  
  // 构建优化
  compiler: {
    // 移除 console.log (仅在生产环境)
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // 输出配置
  output: 'standalone',
};

module.exports = nextConfig;
