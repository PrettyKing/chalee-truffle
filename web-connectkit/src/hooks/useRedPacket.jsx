import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { RED_PACKET_ABI, CONTRACT_ADDRESS } from "../contracts/abi";

export function useRedPacket() {
  // 读取红包信息
  const { data: redPacketInfo, refetch: refetchInfo } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: "getRedPacketInfo",
    watch: true,
  });

  // 准备创建红包交易
  const { config: createConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: "createRedPacket",
  });

  const { write: createRedPacket, isLoading: isCreating } = useContractWrite({
    ...createConfig,
    onSuccess: () => {
      refetchInfo();
    },
    onError: (error) => {
      console.error("创建红包失败:", error);
    },
  });

  // 准备抢红包交易
  const { config: grabConfig } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: RED_PACKET_ABI,
    functionName: "grabRedPacket",
  });

  const { write: grabRedPacket, isLoading: isGrabbing } = useContractWrite({
    ...grabConfig,
    onSuccess: () => {
      refetchInfo();
    },
    onError: (error) => {
      console.error("抢红包失败:", error);
    },
  });

  return {
    redPacketInfo,
    createRedPacket,
    grabRedPacket,
    isCreating,
    isGrabbing,
    refetchInfo,
  };
}
