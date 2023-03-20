// SPDX-License-Identifier: GPL-3.0

pragma solidity >= 0.5.0 < 0.9.0;

import "hardhat/console.sol";

contract CookiePortal {
    uint totalCookies;

    //Function to generate a random number b/w 1-99 if the variable number is 100
    function random(uint number) public view returns(uint){
        return uint(keccak256(abi.encodePacked(block.timestamp,block.difficulty,  
        msg.sender))) % number;
    }

    event NewCookie(address indexed from, uint256 timestamp, string message);

    struct Cookie {
        address sender; // The address of the user who sent a cookie.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user.
    }

    Cookie[] cookies;

    mapping(address => uint256) public lastCookieSent; //Mapping of address to an int

    function cookie(string memory _message) public {

        //Method to prevent users spamming the server with cookies and try to win Goerli Ether
        require(lastCookieSent[msg.sender] + 15 minutes < block.timestamp, "Wait 15 minutes before sending a cookie again!"); //15 minutes before a user can send cookies again

        lastCookieSent[msg.sender] = block.timestamp; //Updating timestamp of the current address (user) with the current time

        totalCookies = totalCookies + 1;
        console.log("%s sent you a cookie w/ message %s", msg.sender, _message);

        cookies.push(Cookie(msg.sender, _message, block.timestamp));

        uint256 chance = random(100);

        if (chance < 10) { //Calculating only 10% chance to send a user fake ETH
            uint256 prize = 0.01 ether;
            require(prize <= address(this).balance, "Contract does not have enough ether!");
        
            (bool success, ) = (msg.sender).call{value: prize}(""); //Add ETH (10% chance) to the user's balance.
                                                                            // This is the method to send fake ether to the user's address
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewCookie(msg.sender, block.timestamp, _message);

    }

    function getAllCookies() public view returns (Cookie[] memory) {
        return cookies;
    }

   function getTotalCookies() public view returns (uint) {
    console.log("You have %d cookie(s)!", totalCookies);

    return totalCookies;
   }

    constructor() payable {
        console.log("Yo yo, I am a contract and I am smart.");
    }
}