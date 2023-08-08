import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Web3Storage } from "web3.storage";
import Web3Mint from "../../utils/Web3Mint.json";
import useMintCounts from "../../hooks/useMintCounts";
import ImageLogo from "./image.svg";
import "./NftUploader.css";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const API_KEY = process.env.REACT_APP_WEB3_STORAGE_TOKEN;

const NftUploader = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount:", currentAccount);

  const { currentMintCount, maxMintCount, fetchAndUpdateMintCount } = useMintCounts(CONTRACT_ADDRESS, Web3Mint.abi);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);

      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

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
      console.log(error);
    }
  };

  const imageToNFT = async (e) => {
    const client = new Web3Storage({ token: API_KEY });
    const image = e.target;
    console.log(image);
    const rootCid = await client.put(image.files, {
      name: 'experiment',
      maxRetries: 3,
    });
    const res = await client.get(rootCid);
    const files = await res.files();
    for (const file of files) {
      console.log("file.cid", file.cid);
      askContractToMintNft(file.cid);
    }
  };

  const askContractToMintNft = async (ipfs) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum); // v5
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        const nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
        console.log("Mining...please wait");
        await nftTxn.wait();
        console.log(`Mined, see transaction: https://sepolia.etherscan.io/tx/${nftTxn.hash}`);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
    fetchAndUpdateMintCount();
  }, []);

  return (
    <div className="outerBox">
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}
      <div className="title">
        <h2>NFTアップローダー</h2>
        <p>JpegかPngの画像ファイル</p>
      </div>
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png"  onChange={imageToNFT} />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input className="nftUploadInput" type="file" accept=".jpg , .jpeg , .png" onChange={imageToNFT} />
      </Button>
      <p>
        これまでに作成された {currentMintCount} / {maxMintCount} NFT
      </p>
    </div>
  );
};

export default NftUploader;