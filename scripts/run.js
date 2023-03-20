const main = async () => {
    const [owner, randomPerson, randomPerson2] = await hre.ethers.getSigners();
    const cookieContractFactory = await hre.ethers.getContractFactory("CookiePortal");
    const cookieContract = await cookieContractFactory.deploy({
      value: hre.ethers.utils.parseEther("0.15"),
    });
    await cookieContract.deployed();

    console.log("Contract deployed to:", cookieContract.address);
    console.log("Contract deployed by:", owner.address);

    let contractBalance = await hre.ethers.provider.getBalance(
      cookieContract.address
    );
    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );

    let addresses = [];

    let cookieCount;
    cookieCount = await cookieContract.getTotalCookies();

    let cookieTxn = await cookieContract.cookie("A message");
    await cookieTxn.wait();
    addresses.push(owner.address);

    cookieCount = await cookieContract.getTotalCookies();

    cookieTxn = await cookieContract.connect(randomPerson).cookie("A second message!");
    await cookieTxn.wait();
    addresses.push(randomPerson.address);

    cookieTxn = await cookieContract.connect(randomPerson2).cookie("A third message!");
    await cookieTxn.wait();
    addresses.push(randomPerson2.address);

    cookieCount = await cookieContract.getTotalCookies();

    let allCookies =  await cookieContract.getAllCookies();
    console.log(allCookies);

    console.log("The addresses that have sent you cookies are: ", addresses);

    console.log(
      "Contract balance:",
      hre.ethers.utils.formatEther(contractBalance)
    );
  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0); // exit Node process without error
    } catch (error) {
      console.log(error);
      process.exit(1); // exit Node process while indicating 'Uncaught Fatal Exception' error
    }
  };
  
  runMain();