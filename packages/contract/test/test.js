const { assert } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Web3Mint", () => {
  const ipfsCID = "bafkreievxssucnete4vpthh3klylkv2ctll2sk2ib24jvgozyg62zdtm2y";

  async function deployWeb3MintFixture() {
    const Mint = await ethers.getContractFactory("Web3Mint");
    const mintContract = await Mint.deploy();
    await mintContract.deployed();

    const [owner, addr1] = await ethers.getSigners();
    return { mintContract, owner, addr1 };
  }

  describe("mintIpfsNFT", async () => {
    it("should return the nft", async () => {
      const { mintContract, owner, addr1 } = await loadFixture(
        deployWeb3MintFixture
      );
      const nftName = "poker";
      await mintContract.connect(owner).mintIpfsNFT(nftName, ipfsCID);
      await mintContract.connect(addr1).mintIpfsNFT(nftName, ipfsCID);

      assert.equal(
        await mintContract.tokenURI(0),
        "data:application/json;base64,eyJuYW1lIjogInBva2VyIC0tIE5GVCAjOiAwIiwgImRlc2NyaXB0aW9uIjogIkFuIGVwaWMgTkZUIiwgImltYWdlIjogImlwZnM6Ly9iYWZrcmVpZXZ4c3N1Y25ldGU0dnB0aGgza2x5bGt2MmN0bGwyc2syaWIyNGp2Z296eWc2MnpkdG0yeSJ9"
      );
      assert.equal(
        await mintContract.tokenURI(1),
        "data:application/json;base64,eyJuYW1lIjogInBva2VyIC0tIE5GVCAjOiAxIiwgImRlc2NyaXB0aW9uIjogIkFuIGVwaWMgTkZUIiwgImltYWdlIjogImlwZnM6Ly9iYWZrcmVpZXZ4c3N1Y25ldGU0dnB0aGgza2x5bGt2MmN0bGwyc2syaWIyNGp2Z296eWc2MnpkdG0yeSJ9"
      );
    });

    it("should fail to mint a new NFT if the max supply is reached", async function () {
      const { mintContract } = await loadFixture(deployWeb3MintFixture);
      const maxSupply = 1;
      await mintContract.setMaxSupply(maxSupply);

      const nftName = "poker";
      await mintContract.mintIpfsNFT(nftName, ipfsCID);

      try {
        await mintContract.mintIpfsNFT(nftName, ipfsCID);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Max supply reached");
      }
    });
  });

  describe("maxSupply", async () => {
    it("should return max NFT supply", async function () {
      const { mintContract } = await loadFixture(deployWeb3MintFixture);
      assert.equal(await mintContract.maxSupply(), 50);
    });
  });

  describe("setMaxSupply", async () => {
    it("should allow owner to set max supply", async () => {
      const { mintContract, owner } = await loadFixture(deployWeb3MintFixture);
      await mintContract.connect(owner).setMaxSupply(100);
      assert.equal(await mintContract.maxSupply(), 100);
    });

    it("should not allow non-owner to set max supply", async () => {
      const { mintContract, addr1 } = await loadFixture(deployWeb3MintFixture);
      try {
        await mintContract.connect(addr1).setMaxSupply(100);
        assert.fail("Should have thrown an error");
      } catch (error) {
        assert.include(error.message, "Ownable: caller is not the owner");
      }
    });
  });

  describe("totalSupply", async () => {
    it("should return total minted NFTs", async () => {
      const { mintContract, owner, addr1 } = await loadFixture(
        deployWeb3MintFixture
      );
      const nftName = "poker";
      await mintContract.connect(owner).mintIpfsNFT(nftName, ipfsCID);
      await mintContract.connect(addr1).mintIpfsNFT(nftName, ipfsCID);
      assert.equal(await mintContract.totalSupply(), 2);
    });
  });
});
