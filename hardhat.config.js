require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    goerli: {
      url: process.env.QUICK_NODE_API,
      accounts: [process.env.GOERLI_PRIVATE_KEY]
    },
    // mainnet: {
    //   url: process.env.QUICK_NODE_API,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
};


// Deploying contracts with account:  0x75077666eB63DeC393B99649231767a901944b5A
// Account balance:  200000000000000000
// CookiePortal address:  0xa3e438b824cFC42ea5FEF998d54Dbd7d5BF3a41e