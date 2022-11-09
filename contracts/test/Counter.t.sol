// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "../src/Counter.sol";
import "../src/AMB.sol";

contract CounterTest is Test {
    Counter public counter;
    AMB public amb;

    function setUp() public {
        amb = new AMB();
        counter = new Counter();
        counter.initialize(address(amb), address(counter), address(counter));
    }

    function testSend() public {
        counter.send();
    }

    function testReceive() public {
        uint256 count = counter.counter();
        amb.receiveMsg(
            0,
            address(counter),
            abi.encodePacked(bytes4(keccak256(bytes("increment()"))), "")
        );
        assertTrue(count + 1 == counter.counter());
    }

    function testWithdrawFunds() public {
        counter.send{value: 10 ether}();
        assertTrue(address(amb).balance == 10 ether);

        amb.withdraw();
        assertTrue(address(amb).balance == 0 ether);
    }

    function testFailNotAMB() public {
        counter.increment();
    }

    function testFailSecondInit() public {
        counter.initialize(address(amb), address(counter), address(counter));
    }

    fallback() external payable {}
}
