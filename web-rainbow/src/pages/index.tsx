import { useState } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Navigation } from '../components/Navigation';
import { ContractInfo } from '../components/ContractInfo';
import { UserProfile } from '../components/UserProfile';
import { CreateRedPacket } from '../components/CreateRedPacket';
import { ClaimRedPacket } from '../components/ClaimRedPacket';
import { DepositWithdraw } from '../components/DepositWithdraw';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [activeTab, setActiveTab] = useState('info');

  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return <ContractInfo />;
      case 'profile':
        return <UserProfile />;
      case 'create':
        return <CreateRedPacket />;
      case 'claim':
        return <ClaimRedPacket />;
      case 'deposit':
        return <DepositWithdraw />;
      default:
        return <ContractInfo />;
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>红包 DApp - 区块链红包应用</title>
        <meta
          content="一个基于以太坊的去中心化红包应用，支持创建和领取加密货币红包"
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className={styles.main}>
        <div className={styles.content}>
          {renderContent()}
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p>基于以太坊智能合约的去中心化红包应用</p>
          <p>由 ❤️ 和 🌈 构建</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;