// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GasOptimizedMessageStorage {
    // 使用 packed 结构体减少存储槽
    struct PackedMessage {
        address sender; // 20 bytes
        uint96 amount; // 12 bytes (足够存储ETH数量)
        uint32 timestamp; // 4 bytes (2106年之前够用)
        bytes32 contentHash; // 32 bytes (存储内容哈希而非完整内容)
    }

    PackedMessage[] public messages;

    // 内容哈希到完整内容的映射
    mapping(bytes32 => string) public contentStorage;

    event MessageReceived(
        uint256 indexed messageId,
        address indexed sender,
        bytes32 indexed contentHash
    );

    receive() external payable {
        string memory content = _extractContent();
        bytes32 contentHash = keccak256(bytes(content));

        // 只有当内容不存在时才存储
        if (bytes(contentStorage[contentHash]).length == 0) {
            contentStorage[contentHash] = content;
        }

        PackedMessage memory message = PackedMessage({
            sender: msg.sender,
            amount: uint96(msg.value),
            timestamp: uint32(block.timestamp),
            contentHash: contentHash
        });

        uint256 messageId = messages.length;
        messages.push(message);

        emit MessageReceived(messageId, msg.sender, contentHash);
    }

    function _extractContent() internal pure returns (string memory) {
        if (msg.data.length == 0) {
            return "Payment without message";
        }
        return abi.decode(msg.data, (string));
    }

    function getMessageContent(
        uint256 messageId
    ) external view returns (string memory) {
        require(messageId < messages.length, "Invalid message ID");
        bytes32 contentHash = messages[messageId].contentHash;
        return contentStorage[contentHash];
    }

    function getFullMessage(
        uint256 messageId
    )
        external
        view
        returns (
            address sender,
            uint256 amount,
            uint256 timestamp,
            string memory content
        )
    {
        require(messageId < messages.length, "Invalid message ID");
        PackedMessage memory message = messages[messageId];

        return (
            message.sender,
            uint256(message.amount),
            uint256(message.timestamp),
            contentStorage[message.contentHash]
        );
    }
}
