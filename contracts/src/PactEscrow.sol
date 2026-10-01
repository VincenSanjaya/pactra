// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PactEscrow is ReentrancyGuard {
    enum PactStatus {
        Active,
        Completed,
        Cancelled
    }

    enum MilestoneStatus {
        Pending,
        Submitted,
        RevisionRequested,
        Approved
    }

    struct Milestone {
        string title;
        string requirement;
        uint256 amount;
        string submissionURI;
        MilestoneStatus status;
    }

    address public client;
    address public freelancer;

    IERC20 public paymentToken;

    string public projectTitle;
    string public projectDescription;

    uint256 public totalAmount;
    uint256 public releasedAmount;

    PactStatus public pactStatus;

    Milestone[] public milestones;

    bool public funded;

    event MilestoneAdded(
        uint256 indexed milestoneId,
        string title,
        uint256 amount
    );

    event PactFunded(
        address indexed client,
        uint256 amount
    );

    event MilestoneSubmitted(
        uint256 indexed milestoneId,
        string submissionURI
    );

    event RevisionRequested(
        uint256 indexed milestoneId
    );

    event MilestoneApproved(
        uint256 indexed milestoneId,
        uint256 amount
    );

    event PactCompleted();

    constructor(
        address _client,
        address _freelancer,
        address _paymentToken,
        string memory _projectTitle,
        string memory _projectDescription
    ) {
        require(_client != address(0), "Invalid client");
        require(_freelancer != address(0), "Invalid freelancer");
        require(_paymentToken != address(0), "Invalid token");
        require(_client != _freelancer, "Client cannot be freelancer");

        client = _client;
        freelancer = _freelancer;
        paymentToken = IERC20(_paymentToken);

        projectTitle = _projectTitle;
        projectDescription = _projectDescription;

        pactStatus = PactStatus.Active;
    }

    function addMilestone(
        string memory _title,
        string memory _requirement,
        uint256 _amount
    ) external {
        require(msg.sender == client, "Only client");
        require(pactStatus == PactStatus.Active, "Pact not active");
        require(!funded, "Pact already funded");
        require(_amount > 0, "Amount must be greater than zero");

        milestones.push(
            Milestone({
                title: _title,
                requirement: _requirement,
                amount: _amount,
                submissionURI: "",
                status: MilestoneStatus.Pending
            })
        );

        totalAmount += _amount;

        emit MilestoneAdded(
            milestones.length - 1,
            _title,
            _amount
        );
    }

    function getMilestoneCount() external view returns (uint256) {
        return milestones.length;
    }

    function fund() external nonReentrant {
        require(msg.sender == client, "Only client");
        require(totalAmount > 0, "No milestones");
        require(!funded, "Already funded");

        funded = true;

        emit PactFunded(
            msg.sender,
            totalAmount
        );

        bool success = paymentToken.transferFrom(
            msg.sender,
            address(this),
            totalAmount
        );

        require(success, "Funding failed");
    }

    function submitMilestone(
        uint256 _milestoneId,
        string memory _submissionURI
    ) external {
        require(msg.sender == freelancer, "Only freelancer");
        require(funded, "Pact not funded");
        require(pactStatus == PactStatus.Active, "Pact not active");
        require(_milestoneId < milestones.length, "Invalid milestone");

        Milestone storage milestone = milestones[_milestoneId];

        require(
            milestone.status == MilestoneStatus.Pending ||
                milestone.status == MilestoneStatus.RevisionRequested,
            "Milestone cannot be submitted"
        );

        require(
            bytes(_submissionURI).length > 0,
            "Submission required"
        );

        milestone.submissionURI = _submissionURI;
        milestone.status = MilestoneStatus.Submitted;

        emit MilestoneSubmitted(
            _milestoneId,
            _submissionURI
        );
    }

    function requestRevision(
        uint256 _milestoneId
    ) external {
        require(msg.sender == client, "Only client");
        require(pactStatus == PactStatus.Active, "Pact not active");
        require(_milestoneId < milestones.length, "Invalid milestone");

        Milestone storage milestone = milestones[_milestoneId];

        require(
            milestone.status == MilestoneStatus.Submitted,
            "Milestone not submitted"
        );

        milestone.status = MilestoneStatus.RevisionRequested;

        emit RevisionRequested(_milestoneId);
    }

    function approveMilestone(
        uint256 _milestoneId
    ) external nonReentrant {
        require(msg.sender == client, "Only client");
        require(funded, "Pact not funded");
        require(pactStatus == PactStatus.Active, "Pact not active");
        require(_milestoneId < milestones.length, "Invalid milestone");

        Milestone storage milestone = milestones[_milestoneId];

        require(
            milestone.status == MilestoneStatus.Submitted,
            "Milestone not submitted"
        );

        uint256 paymentAmount = milestone.amount;

        milestone.status = MilestoneStatus.Approved;
        releasedAmount += paymentAmount;

        if (releasedAmount == totalAmount) {
            pactStatus = PactStatus.Completed;
            emit PactCompleted();
        }

        emit MilestoneApproved(
            _milestoneId,
            paymentAmount
        );

        bool success = paymentToken.transfer(
            freelancer,
            paymentAmount
        );

        require(success, "Payment failed");
    }
}