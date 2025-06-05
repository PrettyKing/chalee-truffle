import { useState } from 'react';

export default function UserInfoManager({ userInfo, onSetUserInfo, isLoading, error }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [status, setStatus] = useState('');
  const [getUserStatus, setGetUserStatus] = useState('');

  const handleSetInfo = async () => {
    if (!name.trim() || !age || isNaN(age) || age < 0) {
      setStatus('请输入有效的姓名和年龄');
      return;
    }

    try {
      setStatus('正在设置信息...');
      await onSetUserInfo(name, parseInt(age));
      setStatus('设置成功！');
      setName('');
      setAge('');
    } catch (err) {
      setStatus(`设置失败: ${err.message}`);
    }
  };

  const handleGetInfo = async () => {
    try {
      setGetUserStatus('正在获取信息...');
      // userInfo 应该已经从 hook 中获取
      if (userInfo && userInfo.name && userInfo.age !== '0') {
        setGetUserStatus(`当前信息 - 姓名: "${userInfo.name}", 年龄: ${userInfo.age}`);
      } else {
        setGetUserStatus('暂无信息或信息为空');
      }
    } catch (err) {
      setGetUserStatus(`获取失败: ${err.message}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSetInfo();
    }
  };

  return (
    <div className="card glass">
      <h3><span className="card-icon">📝</span>信息管理</h3>
      
      {/* 设置信息 */}
      <div className="input-group">
        <div className="input-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入姓名"
            disabled={isLoading}
          />
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入年龄"
            disabled={isLoading}
          />
        </div>
        <button 
          className="btn"
          onClick={handleSetInfo}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner"></span>
              设置中...
            </>
          ) : (
            '设置信息'
          )}
        </button>
      </div>

      {/* 设置状态显示 */}
      {status && (
        <div className={`status-message ${
          status.includes('成功') ? 'status-success' :
          status.includes('失败') ? 'status-error' :
          status.includes('正在') ? 'status-info' : 'status-warning'
        }`}>
          {status}
        </div>
      )}

      {/* 获取信息 */}
      <div className="input-group" style={{ marginTop: '25px' }}>
        <button 
          className="btn btn-success"
          onClick={handleGetInfo}
        >
          获取当前信息
        </button>
      </div>

      {/* 获取状态显示 */}
      {getUserStatus && (
        <div className={`status-message ${
          getUserStatus.includes('当前信息') ? 'status-success' :
          getUserStatus.includes('失败') ? 'status-error' :
          getUserStatus.includes('正在') ? 'status-info' : 'status-warning'
        }`}>
          {getUserStatus}
        </div>
      )}

      {/* 错误显示 */}
      {error && (
        <div className="status-message status-error">
          错误: {error.message || error}
        </div>
      )}

      {/* 当前用户信息显示 */}
      {userInfo && userInfo.name && userInfo.age !== '0' && (
        <div className="status-message status-info" style={{ marginTop: '20px' }}>
          <strong>当前信息:</strong> 姓名: "{userInfo.name}", 年龄: {userInfo.age}
        </div>
      )}
    </div>
  );
}