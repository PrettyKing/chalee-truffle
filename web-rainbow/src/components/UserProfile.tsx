import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useUserInfo } from "../hooks/useContract";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../abi";
import styles from "../styles/UserProfile.module.css";

export const UserProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { address } = useAccount();

  const {
    data: userInfo,
    isLoading: isLoadingInfo,
    refetch,
  }: any = useUserInfo();

  const { config, error: prepareError }: any = useSimulateContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: "setInfo",
    args: [name, age ? BigInt(age) : BigInt(0)],
  });

  const {
    data,
    write,
    isLoading: isWriteLoading,
    error: writeError,
  }: any = useWriteContract(config);

  const { isLoading: isTransactionLoading, isSuccess }: any =
    useWaitForTransactionReceipt({
      hash: data?.hash,
      onReplaced: () => {
        setIsEditing(false);
        refetch();
      },
    });

  useEffect(() => {
    if (userInfo && userInfo[0]) {
      setName(userInfo[0]);
      setAge(userInfo[1].toString());
    }
  }, [userInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (write) {
      write();
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userInfo && userInfo[0]) {
      setName(userInfo[0]);
      setAge(userInfo[1].toString());
    } else {
      setName("");
      setAge("");
    }
  };

  const isLoading = isWriteLoading || isTransactionLoading;
  const error = prepareError || writeError;
  const hasExistingInfo = userInfo && userInfo[0] && userInfo[0] !== "";

  if (!address) {
    return (
      <div className={styles.container}>
        <div className={styles.warning}>请先连接钱包以查看个人信息</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>个人信息</h2>

      <div className={styles.addressInfo}>
        <span className={styles.label}>钱包地址:</span>
        <span className={styles.address}>
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </span>
      </div>

      {isLoadingInfo ? (
        <div className={styles.loading}>加载中...</div>
      ) : (
        <div className={styles.userInfoSection}>
          {!isEditing && hasExistingInfo ? (
            <div className={styles.displayInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>姓名:</span>
                <span className={styles.value}>{userInfo[0]}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>年龄:</span>
                <span className={styles.value}>{userInfo[1].toString()}</span>
              </div>
              <button onClick={handleEdit} className={styles.editButton}>
                编辑信息
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">姓名:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="输入您的姓名"
                  required
                  disabled={isLoading}
                  maxLength={50}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="age">年龄:</label>
                <input
                  type="number"
                  id="age"
                  min="1"
                  max="150"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="输入您的年龄"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.buttonGroup}>
                <button
                  type="submit"
                  disabled={isLoading || !write || !name || !age}
                  className={styles.submitButton}
                >
                  {isLoading ? "保存中..." : "保存信息"}
                </button>

                {hasExistingInfo && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className={styles.cancelButton}
                  >
                    取消
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {error && <div className={styles.error}>错误: {error.message}</div>}

      {isSuccess && (
        <div className={styles.success}>
          信息保存成功! 交易哈希: {data?.hash}
        </div>
      )}
    </div>
  );
};
