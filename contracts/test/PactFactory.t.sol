// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {PactFactory} from "../src/PactFactory.sol";
import {PactEscrow} from "../src/PactEscrow.sol";

contract PactFactoryTest is Test {
    MockUSDC token;
    PactFactory factory;

    address client = address(0x1);
    address freelancer = address(0x2);

    function setUp() public {
        token = new MockUSDC();
        factory = new PactFactory();
    }

    function testClientCanCreatePact() public {
        vm.prank(client);

        address pactAddress = factory.createPact(
            freelancer,
            address(token),
            "Build Pactra Landing Page",
            "Design and build the Pactra landing page"
        );

        assertTrue(pactAddress != address(0));
        assertEq(factory.getPactCount(), 1);

        PactEscrow pact = PactEscrow(pactAddress);

        assertEq(pact.client(), client);
        assertEq(pact.freelancer(), freelancer);
        assertEq(
            address(pact.paymentToken()),
            address(token)
        );
    }

    function testFactoryTracksClientPacts() public {
        vm.prank(client);

        address pactAddress = factory.createPact(
            freelancer,
            address(token),
            "Landing Page",
            "Build landing page"
        );

        address[] memory createdPacts =
            factory.getClientPacts(client);

        assertEq(createdPacts.length, 1);
        assertEq(createdPacts[0], pactAddress);
    }

    function testFactoryTracksFreelancerPacts() public {
        vm.prank(client);

        address pactAddress = factory.createPact(
            freelancer,
            address(token),
            "Landing Page",
            "Build landing page"
        );

        address[] memory assignedPacts =
            factory.getFreelancerPacts(freelancer);

        assertEq(assignedPacts.length, 1);
        assertEq(assignedPacts[0], pactAddress);
    }
}