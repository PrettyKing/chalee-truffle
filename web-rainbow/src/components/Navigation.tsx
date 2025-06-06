import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/Navigation.module.css';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'info', label: '合约信息', icon: '📊' },
    { id: 'profile', label: '个人信息', icon: '👤' },
    { id: 'create', label: '创建红包', icon: '🎁' },
    { id: 'claim', label: '领取红包', icon: '💰' },
    { id: 'deposit', label: '充值提现', icon: '💳' },
  ];

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>🌈</span>
          <span className={styles.logoText}>红包 DApp</span>
        </div>
        
        <div className={styles.tabList}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className={styles.connectButton}>
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
};