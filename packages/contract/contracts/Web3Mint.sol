// Web3Mint.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./libraries/Base64.sol";

contract Web3Mint is ERC721Enumerable, Ownable {
    struct NftAttributes {
        string name;
        string imageURL;
    }
    NftAttributes[] public web3Nfts;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 private _maxSupply = 50;

    constructor() ERC721("NFT", "nft") {
        console.log("This is my NFT contract.");
    }

    function maxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    function setMaxSupply(uint256 value) public onlyOwner {
        _maxSupply = value;
    }

    function mintIpfsNFT(string memory name, string memory imageURI) public {
        uint256 newItemId = _tokenIds.current();
        require(newItemId < _maxSupply, "Max supply reached");

        _safeMint(msg.sender, newItemId);
        web3Nfts.push(NftAttributes({ name: name, imageURL: imageURI }));
        console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);

        _tokenIds.increment();
    }

    function tokenURI(uint256 _tokenId) public override view returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        web3Nfts[_tokenId].name,
                        ' -- NFT #: ',
                        Strings.toString(_tokenId),
                        '", "description": "An epic NFT", "image": "ipfs://',
                        web3Nfts[_tokenId].imageURL,
                        '"}'
                    )
                )
            )
        );
        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        return output;
    }
}
