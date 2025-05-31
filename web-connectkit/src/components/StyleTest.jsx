import React from 'react';

// 临时测试组件，用于验证样式是否生效
export default function StyleTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* 基础 Tailwind 测试 */}
        <div className="bg-red-500 text-white p-4 rounded-lg">
          ✅ 如果您看到这个红色框，说明 Tailwind CSS 基础功能正常
        </div>

        {/* 玻璃形态测试 */}
        <div className="glass-card p-6">
          <h2 className="text-2xl font-bold text-white mb-4">🧪 玻璃形态效果测试</h2>
          <p className="text-white opacity-90">
            如果您看到这个半透明的毛玻璃效果，说明自定义样式正常工作
          </p>
        </div>

        {/* 按钮测试 */}
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-xl font-bold text-white mb-4">🔘 按钮样式测试</h3>
          <div className="space-x-4">
            <button className="btn-primary">主要按钮</button>
            <button className="btn-secondary">次要按钮</button>
          </div>
        </div>

        {/* 动画测试 */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 animate-float">🎭 动画效果测试</h3>
          <p className="text-white opacity-90 animate-pulse-slow">
            这个文字应该有缓慢的脉冲效果
          </p>
        </div>

        {/* 输入框测试 */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">📝 输入框样式测试</h3>
          <input 
            type="text" 
            placeholder="测试输入框样式" 
            className="input-glass w-full"
          />
        </div>

        {/* 红包卡片测试 */}
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4">🧧 红包卡片测试</h3>
          <div className="red-packet-card text-white">
            <div className="text-center">
              <div className="text-3xl mb-2">🧧</div>
              <div className="font-bold">测试红包</div>
              <div className="text-sm opacity-90">悬停查看效果</div>
            </div>
          </div>
        </div>

        {/* 状态样式测试 */}
        <div className="glass-card p-6 space-y-3">
          <h3 className="text-xl font-bold text-white mb-4">🚦 状态样式测试</h3>
          <div className="status-success p-3 rounded-lg">✅ 成功状态</div>
          <div className="status-error p-3 rounded-lg">❌ 错误状态</div>
          <div className="status-warning p-3 rounded-lg">⚠️ 警告状态</div>
          <div className="status-info p-3 rounded-lg">ℹ️ 信息状态</div>
        </div>

      </div>
    </div>
  );
}
