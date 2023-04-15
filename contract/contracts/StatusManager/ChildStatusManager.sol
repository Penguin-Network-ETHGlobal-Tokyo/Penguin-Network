// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ChildStatusManager is Ownable {

  bool public isSlashing;

  uint256 public chainId;

  address rootStatusManager;
  address bridgeAddress;

  bytes32 constant CHANGE_SLASH_STATUS = keccak256("ChangeSlashStatus");

  constructor (uint256 _chainId, address _rootStatusManager) {
    chainId = _chainId;
    rootStatusManager = _rootStatusManager;
  }

  // get functions
  function getRootStatusManagers() external view returns(address) {
    return rootStatusManager;
  }

  function getBridgeAddress() external view returns(address) {
    return bridgeAddress;
  }

  function getSlashStatus() external view returns (bool) {
    return isSlashing;
  }

  // set functions
  function setBridgeAddress(address _bridgeAddress) external onlyOwner returns (address) {
    bridgeAddress = _bridgeAddress;
    return bridgeAddress;
  }

  // external functions
  function startSlashing() external onlyBridge returns (bool){
    isSlashing = true;
    _sendStatusChange();
    return isSlashing;
  }

  function _processMessageFromRoot(
      bytes memory data
  ) external {
    // decode incoming data
    (bytes32 syncType, bytes memory syncData) = abi.decode(data, (bytes32, bytes));

    if (syncType == CHANGE_SLASH_STATUS) {
      (bool newStatus) = abi.decode(syncData, (bool));
      isSlashing = newStatus;
    } else {
      revert("RootStatusManager: INVALID_SYNC_TYPE");
    }
  }

  function _sendStatusChange() internal {
    bytes memory message;
    message = abi.encodeWithSignature("_processMessageFromChild(bytes)",
      abi.encode(
        CHANGE_SLASH_STATUS,
        abi.encode(
          true,
          chainId
        )
      )
    );
    // TODO: write some messaging methods here.
    // TODO: I need to write new method for this downward communication.
  }

  modifier onlyBridge() {
		require(msg.sender == address(bridgeAddress), "Caller is not the bond manager contract");
		_;
	}
}