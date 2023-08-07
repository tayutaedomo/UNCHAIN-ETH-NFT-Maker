// run.js
const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("Web3Mint");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  const txn = await nftContract.makeAnEpicNFT(
    "poker",
    "bafybeibewfzz7w7lhm33k2rmdrk3vdvi5hfrp6ol5vhklzzepfoac37lry"
  );
  await txn.wait();
  const returnedTokenUri = await nftContract.tokenURI(0);
  console.log("Token URI:", returnedTokenUri);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
