import React, { useState, useEffect } from 'react';
import './App.css';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './abi';

function App() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [contractInfo, setContractInfo] = useState({ name: '', age: '' });
  const [status, setStatus] = useState('');

  // 检查钱包连接状态
  useEffect(() => {
    checkConnection();
  }, []);

  // 检查钱包连接
  const checkConnection = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('检查连接失败:', error);
    }
  };

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        setStatus('钱包连接成功！');
      } else {
        setStatus('请安装 MetaMask');
      }
    } catch (error) {
      console.error('连接钱包失败:', error);
      setStatus('连接钱包失败');
    }
  };

  // 断开钱包连接
  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    setStatus('钱包已断开连接');
  };

  // 调用智能合约的 sayHi 函数
  const callSayHi = async () => {
    try {
      if (!window.ethereum) {
        setStatus('请安装 MetaMask');
        return;
      }

      const provider = new window.ethers.BrowserProvider(window.ethereum);
      const contract = new window.ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const result = await contract.sayHi();
      setStatus(`智能合约返回: ${result}`);
    } catch (error) {
      console.error('调用合约失败:', error);
      setStatus('调用合约失败');
    }
  };

  // 获取合约信息
  const getContractInfo = async () => {
    try {
      if (!window.ethereum) {
        setStatus('请安装 MetaMask');
        return;
      }

      const provider = new window.ethers.BrowserProvider(window.ethereum);
      const contract = new window.ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const [name, age] = await contract.getInfo();
      setContractInfo({ name, age: age.toString() });
      setStatus('合约信息获取成功');
    } catch (error) {
      console.error('获取合约信息失败:', error);
      setStatus('获取合约信息失败');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 包含 ethers.js 库 */}
      <script src="https://cdn.ethers.io/lib/ethers-5.7.2.umd.min.js"></script>
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Web ConnectKit
          </h1>
          <p className="text-lg text-gray-600">
            React application with Smart Contract Integration
          </p>
        </header>
        
        <main className="max-w-4xl mx-auto">
          {/* 钱包连接状态 */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              钱包连接状态
            </h2>
            <div className="flex items-center justify-between">
              <div>
                {isConnected ? (
                  <div>
                    <p className="text-green-600 font-semibold">✅ 已连接</p>
                    <p className="text-sm text-gray-600 break-all">
                      地址: {account}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-600 font-semibold">❌ 未连接</p>
                )}
              </div>
              <div>
                {!isConnected ? (
                  <button
                    onClick={connectWallet}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    连接钱包
                  </button>
                ) : (
                  <button
                    onClick={disconnectWallet}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    断开连接
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 智能合约交互 */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              智能合约交互
            </h2>
            <p className="text-gray-600 mb-4">
              合约地址: <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">{CONTRACT_ADDRESS}</code>
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={callSayHi}
                disabled={!isConnected}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                调用 sayHi 函数
              </button>
              <button
                onClick={getContractInfo}
                disabled={!isConnected}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                获取合约信息
              </button>
            </div>

            {/* 合约信息显示 */}
            {contractInfo.name && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold text-gray-800 mb-2">合约存储信息:</h3>
                <p>姓名: {contractInfo.name}</p>
                <p>年龄: {contractInfo.age}</p>
              </div>
            )}

            {/* 状态信息 */}
            {status && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">{status}</p>
              </div>
            )}
          </div>
          
          {/* 项目特性 */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                🚀 智能合约
              </h3>
              <p className="text-gray-600">
                集成了完整的智能合约 ABI，支持红包系统和信息存储功能。
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                🔗 钱包连接
              </h3>
              <p className="text-gray-600">
                支持 MetaMask 等钱包连接，实现去中心化应用交互。
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                🎨 现代设计
              </h3>
              <p className="text-gray-600">
                使用 Tailwind CSS 构建现代化用户界面，响应式设计。
              </p>
            </div>
          </div>

          {/* 使用说明 */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              使用说明
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>1. 确保浏览器已安装 MetaMask 插件</p>
              <p>2. 点击"连接钱包"按钮连接你的以太坊钱包</p>
              <p>3. 连接成功后可以与智能合约进行交互</p>
              <p>4. 智能合约支持红包发送、领取等功能</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
