// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./StatusManager/IRootStatusManager.sol";

interface IWETH {
    function deposit() payable external;
    function withdraw(uint wad) payable external;
}

interface IPool {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
    function withdraw(address asset, uint256 amount, address to) external;
}

/**
 * @title BondManager
 * @notice This contract manages bonds and allows bond user to slash.
 */
contract BondManager is Ownable {
    /******** Variables ********/
  	uint256 constant UPDATE_PERIOD = 3 hours;
    uint256 public bonds;
    uint256 public aaveBonds;
    address WETH = 0xCCB14936C2E000ED8393A571D15A2672537838Ad;
    address pool = 0x7b5C526B7F8dfdff278b4a3e045083FBA4028790;

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
        return bonds + aaveBonds;
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
    function deposit(uint256 _amount, bool _isPoolDeposit) external payable onlyOwner {
        require(msg.value >= _amount, "Insufficient ETH balance");
        if (_isPoolDeposit) {
            // convert ETH to WETH and approve
            IWETH(WETH).deposit{value: msg.value}();
            IERC20(WETH).approve(pool, _amount);

            // supply WETH to pool
            IPool(pool).supply(
                WETH,
                _amount,
                address(this), // recipient
                0
            );
            aaveBonds += _amount;
        } else {
            bonds += _amount;
        }
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
