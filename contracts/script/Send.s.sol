// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Counter.sol";
import "../src/AMB.sol";

interface ICounter {
    function send() external payable;
}

contract SendScript is Script {
    address counterAddress = 0xb83D12206fA955398b9260757133326FF66A5F8A;
    uint gasNeeded = 50522117871;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        ICounter(counterAddress).send{value: gasNeeded}();

        vm.stopBroadcast();
    }
}
