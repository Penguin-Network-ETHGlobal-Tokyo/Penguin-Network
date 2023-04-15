// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MessageManager is Ownable {

  uint8 constant STATUS_SUBMIT = 0;
  uint8 constant STATUS_START = 1;
  uint8 constant STATUS_EXECUTED = 2;
  uint8 constant STATUS_CANCELED = 3;

  struct RelayMessage {
    address user;
    uint256 index;
    uint256 destChainId;
    address to;
    uint256 fee;
    bytes message;
    uint8 status;
  }

  uint256 internal messagesCount;
  mapping(uint256 => RelayMessage) public relayMessages;

  function setRelayMessage(uint256 _destChainId, address _to, bytes calldata _message) external payable returns(RelayMessage memory) {
    relayMessages[messagesCount] = RelayMessage(
      msg.sender,
      messagesCount,
      _destChainId,
      _to,
      msg.value,
      _message,
      STATUS_SUBMIT
    );
    messagesCount += 1;
    return relayMessages[messagesCount - 1];
  }

  function getRelayMessage(
    uint256 _startMessageId, uint256 _endMessageId
  ) external returns (RelayMessage[] memory) {
    RelayMessage[] memory returnValue;
    for (uint256 i = _startMessageId; i < _endMessageId; i++) {
      if (relayMessages[i].status == STATUS_SUBMIT) {
        returnValue[i - _startMessageId] = relayMessages[i];
      }
    }
    return returnValue;
  }

  function getMessageCount () external view returns(uint256) {
    return messagesCount;
  }

  function startExecMessage(uint256 _messageId) external onlyOwner returns(RelayMessage memory) {
    require(relayMessages[_messageId].status == STATUS_SUBMIT, "Message status should be submitted!");
    relayMessages[_messageId].status = STATUS_START;
    return relayMessages[_messageId];
  }

  function finishExecMessage(uint256 _messageId) external returns(RelayMessage memory) {
    require(relayMessages[_messageId].status == STATUS_START, "Message status should be started");
    relayMessages[_messageId].status = STATUS_EXECUTED;
    return relayMessages[_messageId];
  }

  function cancelRelayMessage(uint256 _messageId) external returns(RelayMessage memory) {
    require(relayMessages[_messageId].status == STATUS_START, "Message status should be started");
    relayMessages[_messageId].status = STATUS_CANCELED;
    return relayMessages[_messageId];
  }

  // TODO: This function is underdevelopment.
  // function dispute() external returns(bool) {
  // }
}