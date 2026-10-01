// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";

contract MockUSDCTest is Test {
    MockUSDC token;

    address alice = address(0x1);

    function setUp() public {
        token = new MockUSDC();
    }

    function testInitialSupply() public view {
        assertEq(
            token.balanceOf(address(this)),
            1_000_000 * 1e6
        );
    }

    function testMint() public {
        token.mint(alice, 100 * 1e6);

        assertEq(
            token.balanceOf(alice),
            100 * 1e6
        );
    }

    function testDecimals() public view {
        assertEq(token.decimals(), 6);
    }
}