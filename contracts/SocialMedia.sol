// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SocialMedia {
    struct Post {
        uint id;
        string content;
        address author;
        uint timestamp;
    }

    uint public postCount = 0;
    mapping(uint => Post) public posts;

    event PostCreated(uint id, string content, address author, uint timestamp);

    function createPost(string memory _content) public {
        postCount++;
        posts[postCount] = Post(postCount, _content, msg.sender, block.timestamp);
        emit PostCreated(postCount, _content, msg.sender, block.timestamp);
    }

    function getPost(uint _id) public view returns (Post memory) {
        return posts[_id];
    }
}
