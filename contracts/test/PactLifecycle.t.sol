// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {PactFactory} from "../src/PactFactory.sol";
import {PactEscrow} from "../src/PactEscrow.sol";

contract PactLifecycleTest is Test {
    MockUSDC token;
    PactFactory factory;
    PactEscrow pact;

    address client = address(0x1);
    address freelancer = address(0x2);

    function setUp() public {
        token = new MockUSDC();
        factory = new PactFactory();

        vm.prank(client);

        address pactAddress = factory.createPact(
            freelancer,
            address(token),
            "Build Pactra Landing Page",
            "Design, build, and deploy the Pactra landing page"
        );

        pact = PactEscrow(pactAddress);
    }

    function testFullPactLifecycle() public {
        vm.startPrank(client);

        pact.addMilestone(
            "UI Design",
            "Create the landing page design",
            300 * 1e6
        );

        pact.addMilestone(
            "Frontend",
            "Build the responsive frontend",
            400 * 1e6
        );

        pact.addMilestone(
            "Deployment",
            "Deploy the website",
            300 * 1e6
        );

        vm.stopPrank();

        assertEq(pact.totalAmount(), 1000 * 1e6);

        token.mint(client, 1000 * 1e6);

        vm.prank(client);
        token.approve(address(pact), 1000 * 1e6);

        vm.prank(client);
        pact.fund();

        assertEq(
            token.balanceOf(address(pact)),
            1000 * 1e6
        );

        vm.prank(freelancer);
        pact.submitMilestone(
            0,
            "ipfs://ui-design"
        );

        vm.prank(client);
        pact.approveMilestone(0);

        assertEq(
            token.balanceOf(freelancer),
            300 * 1e6
        );

        vm.prank(freelancer);
        pact.submitMilestone(
            1,
            "ipfs://frontend-v1"
        );

        vm.prank(client);
        pact.requestRevision(1);

        vm.prank(freelancer);
        pact.submitMilestone(
            1,
            "ipfs://frontend-v2"
        );

        vm.prank(client);
        pact.approveMilestone(1);

        assertEq(
            token.balanceOf(freelancer),
            700 * 1e6
        );

        vm.prank(freelancer);
        pact.submitMilestone(
            2,
            "ipfs://deployment"
        );

        vm.prank(client);
        pact.approveMilestone(2);

        assertEq(
            token.balanceOf(freelancer),
            1000 * 1e6
        );

        assertEq(
            token.balanceOf(address(pact)),
            0
        );

        assertEq(
            pact.releasedAmount(),
            1000 * 1e6
        );

        assertEq(
            uint256(pact.pactStatus()),
            uint256(PactEscrow.PactStatus.Completed)
        );
    }
}