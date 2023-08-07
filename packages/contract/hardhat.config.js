require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_URL,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY],
    },
  },
};
