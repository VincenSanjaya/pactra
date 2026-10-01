// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {PactEscrow} from "./PactEscrow.sol";

contract PactFactory {
    address[] public pacts;

    mapping(address => address[]) public clientPacts;
    mapping(address => address[]) public freelancerPacts;

    event PactCreated(
        address indexed pact,
        address indexed client,
        address indexed freelancer
    );

    function createPact(
        address _freelancer,
        address _paymentToken,
        string memory _projectTitle,
        string memory _projectDescription
    ) external returns (address) {
        PactEscrow pact = new PactEscrow(
            msg.sender,
            _freelancer,
            _paymentToken,
            _projectTitle,
            _projectDescription
        );

        address pactAddress = address(pact);

        pacts.push(pactAddress);

        clientPacts[msg.sender].push(pactAddress);
        freelancerPacts[_freelancer].push(pactAddress);

        emit PactCreated(
            pactAddress,
            msg.sender,
            _freelancer
        );

        return pactAddress;
    }

    function getPactCount() external view returns (uint256) {
        return pacts.length;
    }

    function getClientPacts(
        address _client
    ) external view returns (address[] memory) {
        return clientPacts[_client];
    }

    function getFreelancerPacts(
        address _freelancer
    ) external view returns (address[] memory) {
        return freelancerPacts[_freelancer];
    }
}