// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/Counter.sol";
import "../src/AMB.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        AMB amb = new AMB();
        Counter counter = new Counter();
        counter.initialize(address(amb), address(counter), address(counter));

        vm.stopBroadcast();
    }
}
