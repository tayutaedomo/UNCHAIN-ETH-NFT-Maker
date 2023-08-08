import { useState } from "react";
import { ethers } from "ethers";

const FETCH_TIMEOUT = 10000; // 10 seconds

const useMintCounts = (contractAddress, abi) => {
  const [currentMintCount, setCurrentMintCount] = useState(0);
  const [maxMintCount, setMaxMintCount] = useState(0);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  const fetchMintCounts = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const connectedContract = new ethers.Contract(
          contractAddress,
          abi,
          provider
        );
        const mintCount = await connectedContract.totalSupply();
        const maxCount = await connectedContract.maxSupply();
        setCurrentMintCount(mintCount.toNumber());
        setMaxMintCount(maxCount.toNumber());
        console.log("Mint counts: ", mintCount.toNumber(), maxCount.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAndUpdateMintCount = async () => {
    const currentTime = Date.now();
    if (currentTime - lastFetchTime > FETCH_TIMEOUT) {
      await fetchMintCounts();
      setLastFetchTime(currentTime);
    }
  };

  return { currentMintCount, maxMintCount, fetchAndUpdateMintCount };
};

export default useMintCounts;
