// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {PactFactory} from "../src/PactFactory.sol";

contract DeployPactra is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        MockUSDC mockUSDC = new MockUSDC();
        PactFactory factory = new PactFactory();

        vm.stopBroadcast();

        console2.log("MockUSDC:", address(mockUSDC));
        console2.log("PactFactory:", address(factory));
    }
}