// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./IRootStatusManager.sol";
import  "../UniversalBridge/IUniversalBridge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RootStatusManager is Ownable, IRootStatusManager {

  bool public isSlashing;

  uint256 public slashedChainId;

  address public bondManagerAddress;

  mapping(uint256 => address) childStatusManagers;

  bytes32 constant CHANGE_SLASH_STATUS = keccak256("ChangeSlashStatus");

  IUniversalBridge internal universalBridge;

  constructor (address _universalBridgeAddress) {
    universalBridge = IUniversalBridge(_universalBridgeAddress);
  }

  // get functions
  function getChildStatusManagers(uint256 _chainId) external view returns(address) {
    return childStatusManagers[_chainId];
  }

  function getBondManagerAddress() external view returns(address) {
    return bondManagerAddress;
  }

  function getSlashStatus() external view returns(bool) {
    return isSlashing;
  }

  // set functions
  function setChildStatusManagers(uint256 _chainId, address _childStatusManager) external onlyOwner returns (address){
    childStatusManagers[_chainId] = _childStatusManager;
    return childStatusManagers[_chainId];
  }

  function setBondManagerAddress(address _bondManagerAddress) external onlyOwner returns (address) {
    bondManagerAddress = _bondManagerAddress;
    return bondManagerAddress;
  }

  // external functions
  function finishSlashing() external returns (bool){
    require(msg.sender == address(bondManagerAddress), "Caller is not the bond manager contract");
    isSlashing = false;
    _sendStatusChange(slashedChainId);
    return isSlashing;
  }

  function _processMessageFromChild(
    bytes memory data
  ) external {
    // decode incoming data
    (bytes32 syncType, bytes memory syncData) = abi.decode(data, (bytes32, bytes));

    if (syncType == CHANGE_SLASH_STATUS) {
      (bool newStatus, uint256 chainId) = abi.decode(syncData, (bool, uint256));
      isSlashing = newStatus;
      slashedChainId = chainId;
    } else {
      revert("RootStatusManager: INVALID_SYNC_TYPE");
    }
  }

  function _sendStatusChange(uint256 _chainId) internal {
    bytes memory message;
    message = abi.encodeWithSignature("_processMessageFromRoot(bytes)",
      abi.encode(
        CHANGE_SLASH_STATUS,
        abi.encode(
          false
        )
      )
    );
    // TODO: write some messaging methods here.
    // TODO: This code below is only for Polygon.
    universalBridge.sendMessage(
      _chainId,
      childStatusManagers[_chainId],
      message,
      0,
      0
    );
  }
}