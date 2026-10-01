// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {PactEscrow} from "../src/PactEscrow.sol";

contract PactEscrowTest is Test {
    MockUSDC token;
    PactEscrow escrow;

    address client = address(0x1);
    address freelancer = address(0x2);

    function setUp() public {
        token = new MockUSDC();

        escrow = new PactEscrow(
            client,
            freelancer,
            address(token),
            "Build Pactra Landing Page",
            "Create and deploy the Pactra landing page"
        );
    }

    function testClientCanAddMilestone() public {
        vm.prank(client);

        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        assertEq(escrow.getMilestoneCount(), 1);
        assertEq(escrow.totalAmount(), 300 * 1e6);
    }

    function testFreelancerCannotAddMilestone() public {
        vm.prank(freelancer);

        vm.expectRevert("Only client");

        escrow.addMilestone(
            "Fake Milestone",
            "Freelancer should not be able to add this",
            300 * 1e6
        );
    }

    function testClientCanFundEscrow() public {
        vm.prank(client);

        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        token.mint(client, 300 * 1e6);

        vm.prank(client);
        token.approve(address(escrow), 300 * 1e6);

        vm.prank(client);
        escrow.fund();

        assertEq(
            token.balanceOf(address(escrow)),
            300 * 1e6
        );
        assertEq(escrow.funded(), true);
    }

    function testFreelancerCanSubmitMilestone() public {
    vm.prank(client);
    escrow.addMilestone(
        "UI Design",
        "Create responsive landing page design",
        300 * 1e6
    );

    token.mint(client, 300 * 1e6);

    vm.prank(client);
    token.approve(address(escrow), 300 * 1e6);

    vm.prank(client);
    escrow.fund();

    vm.prank(freelancer);
    escrow.submitMilestone(
        0,
        "ipfs://pactra-ui-design"
    );

    (
        ,
        ,
        ,
        string memory submissionURI,
        PactEscrow.MilestoneStatus status
    ) = escrow.milestones(0);

    assertEq(
        submissionURI,
        "ipfs://pactra-ui-design"
    );

    assertEq(
        uint256(status),
        uint256(PactEscrow.MilestoneStatus.Submitted)
    );
    }

        function testClientCanRequestRevision() public {
        vm.prank(client);
        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        token.mint(client, 300 * 1e6);

        vm.prank(client);
        token.approve(address(escrow), 300 * 1e6);

        vm.prank(client);
        escrow.fund();

        vm.prank(freelancer);
        escrow.submitMilestone(
            0,
            "ipfs://first-submission"
        );

        vm.prank(client);
        escrow.requestRevision(0);

        (, , , , PactEscrow.MilestoneStatus status) =
            escrow.milestones(0);

        assertEq(
            uint256(status),
            uint256(PactEscrow.MilestoneStatus.RevisionRequested)
        );
    }  
    function testApproveMilestoneReleasesPayment() public {
        vm.prank(client);
        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        token.mint(client, 300 * 1e6);

        vm.prank(client);
        token.approve(address(escrow), 300 * 1e6);

        vm.prank(client);
        escrow.fund();

        vm.prank(freelancer);
        escrow.submitMilestone(
            0,
            "ipfs://final-design"
        );

        vm.prank(client);
        escrow.approveMilestone(0);

        assertEq(
            token.balanceOf(freelancer),
            300 * 1e6
        );

        assertEq(
            token.balanceOf(address(escrow)),
            0
        );

        assertEq(
            escrow.releasedAmount(),
            300 * 1e6
        );
    }

        function testPactCompletesAfterAllMilestonesApproved() public {
        vm.startPrank(client);

        escrow.addMilestone(
            "UI Design",
            "Create UI design",
            300 * 1e6
        );

        escrow.addMilestone(
            "Frontend",
            "Build frontend",
            400 * 1e6
        );

        vm.stopPrank();

        token.mint(client, 700 * 1e6);

        vm.prank(client);
        token.approve(address(escrow), 700 * 1e6);

        vm.prank(client);
        escrow.fund();

        vm.prank(freelancer);
        escrow.submitMilestone(
            0,
            "ipfs://ui-design"
        );

        vm.prank(client);
        escrow.approveMilestone(0);

        assertEq(
            uint256(escrow.pactStatus()),
            uint256(PactEscrow.PactStatus.Active)
        );

        vm.prank(freelancer);
        escrow.submitMilestone(
            1,
            "ipfs://frontend"
        );

        vm.prank(client);
        escrow.approveMilestone(1);

        assertEq(
            uint256(escrow.pactStatus()),
            uint256(PactEscrow.PactStatus.Completed)
        );

        assertEq(
            token.balanceOf(freelancer),
            700 * 1e6
        );
    }
        function testFreelancerCannotApproveMilestone() public {
        vm.prank(client);
        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        token.mint(client, 300 * 1e6);

        vm.prank(client);
        token.approve(address(escrow), 300 * 1e6);

        vm.prank(client);
        escrow.fund();

        vm.prank(freelancer);
        escrow.submitMilestone(
            0,
            "ipfs://submission"
        );

        vm.prank(freelancer);
        vm.expectRevert("Only client");

        escrow.approveMilestone(0);
    }

    function testClientCannotSubmitMilestone() public {
        vm.prank(client);
        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        token.mint(client, 300 * 1e6);

        vm.prank(client);
        token.approve(address(escrow), 300 * 1e6);

        vm.prank(client);
        escrow.fund();

        vm.prank(client);
        vm.expectRevert("Only freelancer");

        escrow.submitMilestone(
            0,
            "ipfs://fake-submission"
        );
    }

    function testCannotFundTwice() public {
        vm.prank(client);
        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        token.mint(client, 600 * 1e6);

        vm.prank(client);
        token.approve(address(escrow), 600 * 1e6);

        vm.prank(client);
        escrow.fund();

        vm.prank(client);
        vm.expectRevert("Already funded");

        escrow.fund();
    }

    function testCannotSubmitBeforeFunding() public {
        vm.prank(client);
        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        vm.prank(freelancer);
        vm.expectRevert("Pact not funded");

        escrow.submitMilestone(
            0,
            "ipfs://submission"
        );
    }

    function testCannotApproveMilestoneTwice() public {
        vm.prank(client);
        escrow.addMilestone(
            "UI Design",
            "Create responsive landing page design",
            300 * 1e6
        );

        token.mint(client, 300 * 1e6);

        vm.prank(client);
        token.approve(address(escrow), 300 * 1e6);

        vm.prank(client);
        escrow.fund();

        vm.prank(freelancer);
        escrow.submitMilestone(
            0,
            "ipfs://submission"
        );

        vm.prank(client);
        escrow.approveMilestone(0);

        vm.prank(client);
        vm.expectRevert();

        escrow.approveMilestone(0);
    }
}