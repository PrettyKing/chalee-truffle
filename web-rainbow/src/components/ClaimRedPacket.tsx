import { useState } from "react";
import { useAccount } from "wagmi";
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt ,
} from "wagmi";
import { usePacketInfo, useHasClaimedPacket } from "../hooks/useContract";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../abi";
import { formatEther } from "viem";
import styles from "../styles/ClaimRedPacket.module.css";

export const ClaimRedPacket: React.FC = () => {
  const [packetId, setPacketId] = useState("");
  const [showPacketInfo, setShowPacketInfo] = useState(false);
  const { address } = useAccount();

  const packetIdNum = packetId ? parseInt(packetId) : undefined;

  const {
    data: packetInfo,
    isLoading: isLoadingPacketInfo,
    error: packetInfoError,
  } = usePacketInfo(packetIdNum);
  const { data: hasClaimed, isLoading: isLoadingClaimed } = useHasClaimedPacket(
    packetIdNum,
    address
  );

  const { config, error: prepareError } = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "getRedPacket",
    args: packetIdNum ? [BigInt(packetIdNum)] : undefined,
    enabled: !!(
      packetIdNum &&
      packetInfo &&
      !hasClaimed &&
      Number(packetInfo[2]) > 0
    ),
  });

  const {
    data,
    write,
    isLoading: isWriteLoading,
    error: writeError,
  } = useWriteContract(config);

  const { isLoading: isTransactionLoading, isSuccess } = useWaitForTransactionReceipt ({
    hash: data?.hash,
  });

  const handleCheckPacket = () => {
    if (packetId && parseInt(packetId) > 0) {
      setShowPacketInfo(true);
    }
  };

  const handleClaim = () => {
    if (write) {
      write();
    }
  };

  const isLoading = isWriteLoading || isTransactionLoading;
  const error = prepareError || writeError || packetInfoError;

  const canClaim =
    packetInfo &&
    !hasClaimed &&
    Number(packetInfo[2]) > 0 && // remainingCount > 0
    BigInt(packetInfo[4].toString()) > 0; // remainingAmount > 0

  return (
    <div className={styles.container}>
      <h2>领取红包</h2>

      <div className={styles.inputSection}>
        <div className={styles.formGroup}>
          <label htmlFor="packetId">红包ID:</label>
          <input
            type="number"
            id="packetId"
            min="1"
            value={packetId}
            onChange={(e) => {
              setPacketId(e.target.value);
              setShowPacketInfo(false);
            }}
            placeholder="输入红包ID"
          />
        </div>

        <button
          onClick={handleCheckPacket}
          disabled={!packetId || isLoadingPacketInfo}
          className={styles.checkButton}
        >
          {isLoadingPacketInfo ? "查询中..." : "查看红包"}
        </button>
      </div>

      {showPacketInfo && packetInfo && (
        <div className={styles.packetInfo}>
          <h3>红包信息</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.label}>分配方式:</span>
              <span className={styles.value}>
                {packetInfo[0] ? "平均分配" : "随机分配"}
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>总个数:</span>
              <span className={styles.value}>{Number(packetInfo[1])}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>剩余个数:</span>
              <span className={styles.value}>{Number(packetInfo[2])}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>总金额:</span>
              <span className={styles.value}>
                {formatEther(BigInt(packetInfo[3].toString()))} ETH
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>剩余金额:</span>
              <span className={styles.value}>
                {formatEther(BigInt(packetInfo[4].toString()))} ETH
              </span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.label}>您的状态:</span>
              <span
                className={`${styles.value} ${
                  hasClaimed ? styles.claimed : styles.notClaimed
                }`}
              >
                {isLoadingClaimed
                  ? "查询中..."
                  : hasClaimed
                  ? "已领取"
                  : "未领取"}
              </span>
            </div>
          </div>

          {packetInfo[0] && Number(packetInfo[2]) > 0 && (
            <div className={styles.estimatedAmount}>
              <span className={styles.label}>预计金额:</span>
              <span className={styles.value}>
                {(
                  Number(formatEther(BigInt(packetInfo[4].toString()))) /
                  Number(packetInfo[2])
                ).toFixed(6)}{" "}
                ETH
              </span>
            </div>
          )}
        </div>
      )}

      {showPacketInfo && (
        <div className={styles.claimSection}>
          {!address && <div className={styles.warning}>请先连接钱包</div>}

          {address && hasClaimed && (
            <div className={styles.warning}>您已经领取过这个红包了</div>
          )}

          {address && Number(packetInfo?.[2] || 0) === 0 && (
            <div className={styles.warning}>红包已被领完</div>
          )}

          {address && canClaim && (
            <button
              onClick={handleClaim}
              disabled={isLoading || !write}
              className={styles.claimButton}
            >
              {isLoading ? "领取中..." : "领取红包"}
            </button>
          )}
        </div>
      )}

      {error && <div className={styles.error}>错误: {error.message}</div>}

      {isSuccess && (
        <div className={styles.success}>
          红包领取成功! 交易哈希: {data?.hash}
        </div>
      )}
    </div>
  );
};
