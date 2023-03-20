import React from "react";
import { ethers } from "ethers";
import './App.css';
import { motion } from "framer-motion";
import abi from "./utils/CookiePortal.json";
// import BigNumber from "bignumber";

function App() {

  const [currentAccount, setCurrentAccount] = React.useState("");
  const [cookieCount, setCookieCount] = React.useState("Send a cookie to update!");
  const [cookieTransaction, setCookieTransaction] = React.useState("");
  const [loading, setLoading] = React.useState("");
  const [cookieNotice, setCookieNotice] = React.useState("");
  const [allCookies, setAllcookies] = React.useState([]);
  const contractAddress = "0xdbEbcd28147601F47753E40721dA90829aCEFF98"; //This is the contract address
  const contractABI = abi.abi; //This fetches the abi code of the contract to set a pathway for communications
  let count = 0;

  async function checkIfWalletIsConnected() {

    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    } else {
      console.log("We have the ethereum object", ethereum);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const CookiePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

      const cookies = await CookiePortalContract.getAllCookies();

      count = await CookiePortalContract.getTotalCookies();
      setCookieCount(count.toNumber());

      let cookiesCleaned = [];

        cookies.forEach(cookie => {
          cookiesCleaned.push({
            address: cookie.sender,
            timestamp: new Date(cookie.timestamp * 1000),
            message: cookie.message
          });
        });

      setAllcookies(cookiesCleaned);

    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if(accounts.length != 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found.");
    }

  }

  //This connects the wallet to the website.
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const sendCookie = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const CookiePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        // const cookies = await CookiePortalContract.getAllCookies();

        count = await CookiePortalContract.getTotalCookies();
        setCookieCount(count.toNumber());
        // let eecount = BigNumber(count)
        console.log("Retrieved total cookie count...", count.toNumber());

        let cookieTxn = await CookiePortalContract.cookie("A message");
        console.log("Mining...", cookieTxn.hash);
        setLoading("Loading...")

        await cookieTxn.wait();
        console.log("Mined -- ", cookieTxn.hash);
        setCookieTransaction(cookieTxn);
        setCookieNotice("Yayy, I got your cookie! 🍪");
        setLoading("");

        count = await CookiePortalContract.getTotalCookies();
        // let ecount = BigNumber(count);
        console.log("Retrieved total cookie count...", count.toNumber());
        setCookieCount(count.toNumber());

        // let cookiesCleaned = [];

        // cookies.forEach(cookie => {
        //   cookiesCleaned.push({
        //     address: cookie.sender,
        //     timestamp: new Date(cookie.timestamp * 1000),
        //     message: cookie.message
        //   });
        // });

        // setAllcookies(cookiesCleaned);
        // console.log(cookiesCleaned[0].address)

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }

    setCookieNotice("");
}

  /*
  * This runs our function when the page loads.
  */
  React.useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">

        <div className="cookiecount">
          Total cookies in my jar :: {cookieCount} 🍪
        </div>
        
          <div className="cookienotice">
            {cookieNotice}
          </div>

        <div className="header">
        🍪 Hey there!
        </div>

        <div className="bio">
        I am Farhan Ansari, an aspiring web and blockchain developer. I love cookies, send me some by connecting your ether wallet!
        </div>

        <button className="cookieButton" onClick={sendCookie}>
          Send a cookie 🍪
        </button>

        {loading != "" && (
        <div className="loading">
          Processing transaction... 💲
        </div>
      )}

        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="walletButton" onClick={connectWallet}>
            Connect Wallet 💲
          </button>
        )}

        <br></br>

        <h3>Previous Transactions and Messages:</h3>

        {allCookies.map((cookie, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px", borderRadius: "10px" }}>
              <div>Address: {cookie.address}</div>
              <div>Time: {cookie.timestamp.toString()}</div>
              <div>Message: {cookie.message}</div>
            </div>)
        })}

      </div>
    </div>
  );
}

export default App;