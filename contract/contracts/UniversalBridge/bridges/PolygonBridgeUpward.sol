// SPDX-License-Identifier: MIT
pragma solidity >=0.6.9 <0.9.0;

interface PolygonBridgeUpward {
    function sendMessageToChild(address receiver, bytes calldata data) external;
}