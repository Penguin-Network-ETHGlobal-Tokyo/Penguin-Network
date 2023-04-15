// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.9;

import "./IUniversalBridge.sol";

/// @title Unified interface for sending messages from Ethereum to other chains and rollups
/// @author zefram.eth
/// @notice Enables sending messages from Ethereum to other chains via a single interface.
/// @dev This bridge is immutable, so other contracts using it should have the ability to
/// update the bridge address in order to upgrade to newer versions of the bridge in the future
/// and support more chains.
contract UniversalBridge is IUniversalBridge {
    /// -----------------------------------------------------------------------
    /// Constants
    /// -----------------------------------------------------------------------

    uint256 internal constant DEFAULT_MAX_FEE_PER_GAS = 0.1 gwei;

    uint256 public constant override CHAINID_ARBITRUM = 421613;
    ArbitrumBridge public constant override BRIDGE_ARBITRUM = ArbitrumBridge(0x6BEbC4925716945D46F0Ec336D5C2564F419682C);

    uint256 public constant override CHAINID_OPTIMISM = 420;
    OptimismBridge public constant override BRIDGE_OPTIMISM = OptimismBridge(0x5086d1eEF304eb5284A0f6720f79403b4e9bE294);

    uint256 public constant override CHAINID_POLYGON = 80001;
    PolygonBridgeUpward public constant override BRIDGE_POLYGON_UPWARD = PolygonBridgeUpward(0x3d1d3E34f7fB6D26245E6640E1c50710eFFf15bA);

    uint256 public constant override CHAINID_BSC = 56;
    ArbitraryMessageBridge public constant override BRIDGE_BSC =
        ArbitraryMessageBridge(0x07955be2967B655Cf52751fCE7ccC8c61EA594e2);

    uint256 public constant override CHAINID_GNOSIS = 100;
    ArbitraryMessageBridge public constant override BRIDGE_GNOSIS =
        ArbitraryMessageBridge(0x4C36d2919e407f0Cc2Ee3c993ccF8ac26d9CE64e);

    /// -----------------------------------------------------------------------
    /// External functions
    /// -----------------------------------------------------------------------

    error UniversalBridge__GasLimitTooLarge();
    error UniversalBridge__ChainIdNotSupported();
    error UniversalBridge__MsgValueNotSupported();

    /// @inheritdoc IUniversalBridge
    function sendMessage(uint256 chainId, address recipient, bytes calldata data, uint256 gasLimit)
        external
        payable
        virtual
        override
    {
        _sendMessage(chainId, recipient, data, gasLimit, DEFAULT_MAX_FEE_PER_GAS);
    }

    /// @inheritdoc IUniversalBridge
    function sendMessage(
        uint256 chainId,
        address recipient,
        bytes calldata data,
        uint256 gasLimit,
        uint256 maxFeePerGas
    ) external payable virtual override {
        _sendMessage(chainId, recipient, data, gasLimit, maxFeePerGas);
    }

    /// @inheritdoc IUniversalBridge
    function getRequiredMessageValue(uint256 chainId, uint256 dataLength, uint256 gasLimit)
        external
        view
        virtual
        override
        returns (uint256)
    {
        return _getRequiredMessageValue(chainId, dataLength, gasLimit, DEFAULT_MAX_FEE_PER_GAS);
    }

    /// @inheritdoc IUniversalBridge
    function getRequiredMessageValue(uint256 chainId, uint256 dataLength, uint256 gasLimit, uint256 maxFeePerGas)
        external
        view
        virtual
        override
        returns (uint256)
    {
        return _getRequiredMessageValue(chainId, dataLength, gasLimit, maxFeePerGas);
    }

    /// -----------------------------------------------------------------------
    /// Internal helpers for sending message to different chains
    /// -----------------------------------------------------------------------

    function _sendMessage(
        uint256 chainId,
        address recipient,
        bytes calldata data,
        uint256 gasLimit,
        uint256 maxFeePerGas
    ) internal virtual {
        if (chainId == CHAINID_ARBITRUM) _sendMessageArbitrum(recipient, data, gasLimit, maxFeePerGas);
        else if (chainId == CHAINID_OPTIMISM) _sendMessageOptimism(recipient, data, gasLimit);
        else if (chainId == CHAINID_POLYGON) _sendMessagePolygon(recipient, data);
        else if (chainId == CHAINID_BSC) _sendMessageAMB(BRIDGE_BSC, recipient, data, gasLimit);
        else if (chainId == CHAINID_GNOSIS) _sendMessageAMB(BRIDGE_GNOSIS, recipient, data, gasLimit);
        else revert UniversalBridge__ChainIdNotSupported();
    }

    function _getRequiredMessageValue(uint256 chainId, uint256 dataLength, uint256 gasLimit, uint256 maxFeePerGas)
        internal
        view
        virtual
        returns (uint256)
    {
        if (chainId != CHAINID_ARBITRUM) {
            return 0;
        } else {
            uint256 submissionCost = BRIDGE_ARBITRUM.calculateRetryableSubmissionFee(dataLength, block.basefee);
            return gasLimit * maxFeePerGas + submissionCost;
        }
    }

    function _sendMessageArbitrum(address recipient, bytes calldata data, uint256 gasLimit, uint256 maxFeePerGas)
        internal
        virtual
    {
        uint256 submissionCost = BRIDGE_ARBITRUM.calculateRetryableSubmissionFee(data.length, block.basefee);
        uint256 l2CallValue = msg.value - submissionCost - gasLimit * maxFeePerGas;
        BRIDGE_ARBITRUM.createRetryableTicket{value: msg.value}(
            recipient, l2CallValue, submissionCost, msg.sender, msg.sender, gasLimit, maxFeePerGas, data
        );
    }

    function _sendMessageOptimism(address recipient, bytes calldata data, uint256 gasLimit) internal virtual {
        if (msg.value != 0) revert UniversalBridge__MsgValueNotSupported();
        if (gasLimit > type(uint32).max) revert UniversalBridge__GasLimitTooLarge();
        BRIDGE_OPTIMISM.sendMessage(recipient, data, uint32(gasLimit));
    }

    function _sendMessagePolygon(address recipient, bytes calldata data) internal virtual {
        if (msg.value != 0) revert UniversalBridge__MsgValueNotSupported();
        BRIDGE_POLYGON_UPWARD.sendMessageToChild(recipient, data);
    }

    function _sendMessageAMB(ArbitraryMessageBridge bridge, address recipient, bytes calldata data, uint256 gasLimit)
        internal
        virtual
    {
        if (msg.value != 0) revert UniversalBridge__MsgValueNotSupported();
        if (gasLimit > bridge.maxGasPerTx()) revert UniversalBridge__GasLimitTooLarge();
        bridge.requireToPassMessage(recipient, data, gasLimit);
    }
}