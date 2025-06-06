import { useState } from 'react';
import { parseEther, formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { useSimulateContract, useWriteContract, useWaitForTransactionReceipt  } from 'wagmi';
import { useContractBalance, useContractOwner } from '../hooks/useContract';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../abi';
import styles from '../styles/DepositWithdraw.module.css';

export const DepositWithdraw: React.FC = () => {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const { address } = useAccount();
  
  const { data: contractBalance, refetch: refetchBalance } = useContractBalance();
  const { data: owner } = useContractOwner();
  
  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  // Deposit preparation
  const { config: depositConfig, error: depositPrepareError } = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'deposit',
    value: depositAmount ? parseEther(depositAmount) : undefined,
    enabled: !!(depositAmount && parseFloat(depositAmount) > 0),
  });

  const { 
    data: depositData, 
    write: depositWrite, 
    isLoading: isDepositWriteLoading, 
    error: depositWriteError 
  } = useWriteContract(depositConfig);

  const { 
    isLoading: isDepositTransactionLoading, 
    isSuccess: isDepositSuccess 
  } = useWaitForTransactionReceipt ({
    hash: depositData?.hash,
    onSuccess: () => {
      setDepositAmount('');
      refetchBalance();
    },
  });

  // Withdraw preparation
  const { config: withdrawConfig, error: withdrawPrepareError } = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'withdraw',
    args: withdrawAmount ? [parseEther(withdrawAmount)] : undefined,
    enabled: !!(withdrawAmount && parseFloat(withdrawAmount) > 0 && isOwner),
  });

  const { 
    data: withdrawData, 
    write: withdrawWrite, 
    isLoading: isWithdrawWriteLoading, 
    error: withdrawWriteError 
  } = useWriteContract(withdrawConfig);

  const { 
    isLoading: isWithdrawTransactionLoading, 
    isSuccess: isWithdrawSuccess 
  } = useWaitForTransactionReceipt ({
    hash: withdrawData?.hash,
    onSuccess: () => {
      setWithdrawAmount('');
      refetchBalance();
    },
  });

  // Transfer all to owner preparation
  const { config: transferConfig, error: transferPrepareError } = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'transferToOwner',
    enabled: isOwner && contractBalance && contractBalance > 0,
  });

  const { 
    data: transferData, 
    write: transferWrite, 
    isLoading: isTransferWriteLoading, 
    error: transferWriteError 
  } = useWriteContract(transferConfig);

  const { 
    isLoading: isTransferTransactionLoading, 
    isSuccess: isTransferSuccess 
  } = useWaitForTransactionReceipt ({
    hash: transferData?.hash,
    onSuccess: () => {
      refetchBalance();
    },
  });

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositWrite) {
      depositWrite();
    }
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawWrite) {
      withdrawWrite();
    }
  };

  const handleTransferAll = () => {
    if (transferWrite) {
      transferWrite();
    }
  };

  const isDepositLoading = isDepositWriteLoading || isDepositTransactionLoading;
  const isWithdrawLoading = isWithdrawWriteLoading || isWithdrawTransactionLoading;
  const isTransferLoading = isTransferWriteLoading || isTransferTransactionLoading;

  const depositError = depositPrepareError || depositWriteError;
  const withdrawError = withdrawPrepareError || withdrawWriteError;
  const transferError = transferPrepareError || transferWriteError;

  if (!address) {
    return (
      <div className={styles.container}>
        <div className={styles.warning}>
          请先连接钱包
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>充值与提现</h2>
      
      <div className={styles.balanceInfo}>
        <h3>当前合约余额</h3>
        <div className={styles.balance}>
          {contractBalance ? `${parseFloat(formatEther(contractBalance)).toFixed(4)} ETH` : '0 ETH'}
        </div>
      </div>

      <div className={styles.sectionsContainer}>
        {/* Deposit Section */}
        <div className={styles.section}>
          <h3>充值 ETH</h3>
          <form onSubmit={handleDeposit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="depositAmount">充值金额 (ETH):</label>
              <input
                type="number"
                id="depositAmount"
                step="0.001"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="例如: 0.1"
                disabled={isDepositLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isDepositLoading || !depositWrite || !depositAmount}
              className={styles.depositButton}
            >
              {isDepositLoading ? '充值中...' : '充值 ETH'}
            </button>
          </form>
          
          {depositError && (
            <div className={styles.error}>
              错误: {depositError.message}
            </div>
          )}
          
          {isDepositSuccess && (
            <div className={styles.success}>
              充值成功! 交易哈希: {depositData?.hash}
            </div>
          )}
        </div>

        {/* Withdraw Section - Only for owner */}
        {isOwner && (
          <div className={styles.section}>
            <h3>提现 ETH （仅拥有者）</h3>
            
            <form onSubmit={handleWithdraw} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="withdrawAmount">提现金额 (ETH):</label>
                <input
                  type="number"
                  id="withdrawAmount"
                  step="0.001"
                  min="0"
                  max={contractBalance ? formatEther(contractBalance) : '0'}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="例如: 0.1"
                  disabled={isWithdrawLoading}
                />
              </div>
              
              <button
                type="submit"
                disabled={isWithdrawLoading || !withdrawWrite || !withdrawAmount}
                className={styles.withdrawButton}
              >
                {isWithdrawLoading ? '提现中...' : '提现 ETH'}
              </button>
            </form>
            
            <div className={styles.transferAllSection}>
              <p className={styles.transferAllText}>
                或者提取全部余额：
              </p>
              <button
                onClick={handleTransferAll}
                disabled={isTransferLoading || !transferWrite || !contractBalance || contractBalance === BigInt(0)}
                className={styles.transferAllButton}
              >
                {isTransferLoading ? '提取中...' : '提取全部'}
              </button>
            </div>
            
            {withdrawError && (
              <div className={styles.error}>
                错误: {withdrawError.message}
              </div>
            )}
            
            {transferError && (
              <div className={styles.error}>
                错误: {transferError.message}
              </div>
            )}
            
            {isWithdrawSuccess && (
              <div className={styles.success}>
                提现成功! 交易哈希: {withdrawData?.hash}
              </div>
            )}
            
            {isTransferSuccess && (
              <div className={styles.success}>
                全部提取成功! 交易哈希: {transferData?.hash}
              </div>
            )}
          </div>
        )}
        
        {!isOwner && (
          <div className={styles.section}>
            <div className={styles.info}>
              只有合约拥有者才可以提现 ETH
            </div>
          </div>
        )}
      </div>
    </div>
  );
};