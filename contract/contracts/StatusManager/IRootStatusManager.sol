// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IRootStatusManager {
  function getSlashStatus() external view returns(bool);
  function finishSlashing() external returns (bool);
}