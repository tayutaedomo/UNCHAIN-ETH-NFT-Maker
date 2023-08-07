// deploy.js
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("Web3Mint");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  const txn = await nftContract.makeAnEpicNFT();
  await txn.wait();
  console.log("Minted NFT #1");

  const txn2 = await nftContract.makeAnEpicNFT();
  await txn2.wait();
  console.log("Minted NFT #2");
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
