import { useState } from "react";
import { parseEther } from "viem";
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt ,
} from "wagmi";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../abi";
import styles from "../styles/CreateRedPacket.module.css";

interface CreateRedPacketProps {
  onSuccess?: (packetId: number) => void;
}

export const CreateRedPacket: React.FC<CreateRedPacketProps> = ({
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [count, setCount] = useState("");
  const [isEqual, setIsEqual] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const { config, error: prepareError } = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "sendRedPacket",
    args: [
      isEqual,
      count ? parseInt(count) : 0,
      amount ? parseEther(amount) : BigInt(0),
    ],
    value: amount ? parseEther(amount) : undefined,
    enabled: !!(
      amount &&
      count &&
      parseFloat(amount) > 0 &&
      parseInt(count) > 0
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
    onSuccess: (data) => {
      // Extract packet ID from event logs if possible
      setIsCreating(false);
      setAmount("");
      setCount("");
      if (onSuccess) {
        onSuccess(1); // You might want to extract actual packet ID from logs
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!write) return;

    setIsCreating(true);
    write();
  };

  const isLoading = isWriteLoading || isTransactionLoading || isCreating;
  const error = prepareError || writeError;

  return (
    <div className={styles.container}>
      <h2>创建红包</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="amount">红包总金额 (ETH):</label>
          <input
            type="number"
            id="amount"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="例如: 0.1"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="count">红包个数:</label>
          <input
            type="number"
            id="count"
            min="1"
            max="255"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="例如: 5"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label>分配方式:</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="distribution"
                checked={isEqual}
                onChange={() => setIsEqual(true)}
                disabled={isLoading}
              />
              平均分配
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="distribution"
                checked={!isEqual}
                onChange={() => setIsEqual(false)}
                disabled={isLoading}
              />
              随机分配
            </label>
          </div>
        </div>

        {amount && count && (
          <div className={styles.preview}>
            <h4>预览:</h4>
            <p>总金额: {amount} ETH</p>
            <p>红包个数: {count}</p>
            <p>分配方式: {isEqual ? "平均分配" : "随机分配"}</p>
            {isEqual && (
              <p>
                每个红包: {(parseFloat(amount) / parseInt(count)).toFixed(6)}{" "}
                ETH
              </p>
            )}
          </div>
        )}

        {error && <div className={styles.error}>错误: {error.message}</div>}

        {isSuccess && (
          <div className={styles.success}>
            红包创建成功! 交易哈希: {data?.hash}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !write || !amount || !count}
          className={styles.submitButton}
        >
          {isLoading ? "创建中..." : "创建红包"}
        </button>
      </form>
    </div>
  );
};
