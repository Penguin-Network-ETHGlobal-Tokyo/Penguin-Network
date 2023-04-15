// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StatusManager/IRootStatusManager.sol";

/**
 * @title BondManager
 * @notice This contract manages bonds and allows bond user to slash.
 */
contract BondManager is Ownable {
    /******** Variables ********/
  	uint256 constant UPDATE_PERIOD = 3 hours;
    uint256 public bonds;

    address public rootStatusManager;

    mapping(uint256 => bool) private isAvailableNetworks; // chainId => isAvailable

    uint256[] private usedNetworks;

    BondWithdrawal public bondWithdrawal;

    /******** Struct ********/
    struct BondWithdrawal {
		uint64 executeAfter;
        uint256 withdrawalAmount;
    }

    /******** Constructor ********/
	constructor(address _newOwner) {
		transferOwnership(_newOwner);
	}

    /******** External function ********/
    function getBond() external view returns (uint256) {
        return bonds;
    }

    function getExpireDate() external view returns (uint256) {
        if (bondWithdrawal.executeAfter == 0) {
            return 10800;
        } else {
            return bondWithdrawal.executeAfter;
        }
    }

    function getRootStatusManagerAddress() external view returns (address) {
        return rootStatusManager;
    }

    function getAllAvailableNetworks() external view returns(uint256[] memory) {
        uint256[] memory allAvailableNetworks;
        uint256 cnt = 0;
        for (uint256 i = 0; i < usedNetworks.length; i++) {
            if (isAvailableNetworks[usedNetworks[i]]) {
                allAvailableNetworks[cnt] = usedNetworks[i];
                cnt += 1;
            }
        }
        return allAvailableNetworks;
    }

    function isAvailableNetwork(uint256 _chainId) public view returns (bool) {
        return isAvailableNetworks[_chainId];
    }

    /******** Only owner function ********/

    /**
    * @notice Deposit bond
    * @param _amount The amount of bond
    */
    function deposit(uint256 _amount) external payable onlyOwner {
        require(msg.value >= _amount, "Insufficient ETH balance");
        bonds += _amount;
    }

    /**
    * @notice Withdraw bond
    * @param _amount The amount of bond
    */
	function executeWithdrawBond(uint256 _amount) external onlyOwner {
		bonds -= _amount;

		bondWithdrawal = BondWithdrawal(
			uint64(block.timestamp + UPDATE_PERIOD), _amount
		);
	}

    /**
    * @notice Finalize withdraw bond
    */
	function finalizeWithdrawalBond() external payable {
        require(uint64(block.timestamp) > bondWithdrawal.executeAfter, "Ongoing update period");
		uint256 _amount = bondWithdrawal.withdrawalAmount;

        (bool success, ) = owner().call{ value: _amount }(new bytes(0));
        require(success, "Send token failed");
		bondWithdrawal = BondWithdrawal(0, 0);
	}

    function addNetwork(uint256 _chainId) external onlyOwner {
        usedNetworks.push(_chainId);
        isAvailableNetworks[_chainId] = true;
    }

    function deleteNetwork(uint256 _chainId) external onlyOwner {
        isAvailableNetworks[_chainId] = false;
    }

    function setRootStatusManager(address _rootStatusManager) external onlyOwner {
        rootStatusManager = _rootStatusManager;
    }

    /******** Only bond manager function ********/

    /**
    * @notice Slash bond
    * @param _amount The amount of bond
    */
    function slash(uint256 _amount, address _disputerAddress) external payable {
        // TODO: add some requirements to validate if the caller is a bridge contract on L2.
        bonds -= _amount;
        (bool success, ) = msg.sender.call{ value: _amount }(new bytes(0));
        require(success, "Send ETH failed");
        IRootStatusManager(rootStatusManager).finishSlashing();
    }

    /******** Modifier ********/

    modifier onlyStatusManager() {
        require(msg.sender == address(rootStatusManager), "Caller is not the bond manager contract");
		_;
    }

}