const main = async () => {
    const [deployer] = await hre.ethers.getSigners();
    const accountBalance = await deployer.getBalance();
  
    console.log("Deploying contracts with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString());
  
    const cookieContractFactory = await hre.ethers.getContractFactory("CookiePortal");
    const cookieContract = await cookieContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.15"),
    });
    await cookieContract.deployed();
    console.log(hre.ethers.utils.parseEther("0.15"))
  
    console.log("CookiePortal address: ", cookieContract.address);
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