// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract Increment {

  uint256 public cnt;

  function increment() external returns(uint256){
    cnt += 1;
    return cnt;
  }

  function getCnt() external view returns(uint256) {
    return cnt;
  }

}