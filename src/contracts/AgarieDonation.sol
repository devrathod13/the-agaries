// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AgarieDonation {
    // Struct to store donor information
    struct Donor {
        address donorAddress;
        uint256 totalDonated;
        string message;
        uint256 timestamp;
    }

    // State variables
    address public owner;
    uint256 public totalDonations;
    uint256 public donorCount;
    mapping(address => Donor) public donors;
    Donor[] public donorList;

    // Events
    event DonationReceived(
        address indexed donor, 
        uint256 amount, 
        string message, 
        uint256 timestamp
    );
    event Withdrawal(
        address indexed owner, 
        uint256 amount, 
        uint256 timestamp
    );

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Donation function with optional message
    function donate(string memory _message) public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        // Update donor information
        Donor storage donor = donors[msg.sender];
        
        // If this is a new donor, increment donor count
        if (donor.totalDonated == 0) {
            donorCount++;
        }

        // Update donor details
        donor.donorAddress = msg.sender;
        donor.totalDonated += msg.value;
        donor.message = _message;
        donor.timestamp = block.timestamp;

        // Add to donor list
        donorList.push(donor);

        // Update total donations
        totalDonations += msg.value;

        // Emit donation event
        emit DonationReceived(
            msg.sender, 
            msg.value, 
            _message, 
            block.timestamp
        );
    }

    // Function to get total donations
    function getTotalDonations() public view returns (uint256) {
        return totalDonations;
    }

    // Function to get donor count
    function getDonorCount() public view returns (uint256) {
        return donorCount;
    }

    // Withdrawal function for owner
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance > 0, "No funds to withdraw");

        uint256 balance = address(this).balance;
        
        // Transfer funds to owner
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");

        // Emit withdrawal event
        emit Withdrawal(owner, balance, block.timestamp);
    }

    // Fallback function to receive ETH
    receive() external payable {
        donate("Donation via fallback");
    }
}
