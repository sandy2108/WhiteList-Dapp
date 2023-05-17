import React, { useState, useRef, useEffect } from 'react';

import { ethers } from 'ethers';
import { Contract } from 'ethers';

import {WHITELISTED_CONTRACT_ADDRESS,abi} from '../../constants/index';
import illustrator from '../../Assests/illustrator/Zip_drawkit_Sleep & Health/PNG/1.png';
import Image from 'next/image';

const Hero = () => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3ModalRef = useRef();

  const handleErrors = (err) => {
    console.error(err);
    // Additional error handling logic here
  };

  async function requestAccounts() {
    console.log("Requesting Account....")

    if (window.ethereum) {
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts[0]);
        // set wallet address and isConnected state here
        setWalletConnected(true);
      } catch (err) {
        console.log("error connecting...");
      }

    } else {
      console.log("Not detected");
    }

  }

  const addAddressToWhitelist = async (address) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const whitelistContract = new Contract(WHITELISTED_CONTRACT_ADDRESS,abi, signer);
      
        const tx = await whitelistContract.addAddressToWhiteList();
      setLoading(true);

      await tx.wait();
      setLoading(false);
      
      setJoinedWhitelist(true);
      
      
    } catch (error) {
      handleErrors(error);
    }
  }

  

  const checkIfAddressInWhiteList = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner();
      const whitelistContract = new Contract(WHITELISTED_CONTRACT_ADDRESS, abi, signer);
      const address = await signer.getAddress();
      const _joinedWhiteList = await whitelistContract.WhiteListedAddress(
        address
      );
      setJoinedWhitelist(_joinedWhiteList);
    }
    catch (error) {
      handleErrors(error);
    }
  }
  
  async function connectWal() {
    if(typeof window.ethereum !== 'undefined'){
      await requestAccounts();
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer= provider.getSigner();
    }
  }


  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className="leading-1 my-8 text-base">
           <p className='font-blod ml-10 p-2'>Thanks for joining the whitelist!</p>
          </div>
        );
      } else if (loading) {
        return <button className="ml-10 button p-2 text-black">Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className="ml-20 sm:ml-10 button p-2 text-black">
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWal} className="ml-10 button p-2 text-black">
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting its `current` value
      // The `current` value is persisted throughout as long as this page is open
      async function connectWallets() {
        if (typeof window.ethereum !== 'undefined') {
          await requestAccounts();
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const signer = provider.getSigner();
        }
      }

      connectWallets();
    }
  }, [walletConnected]);



  useEffect(() => {
    try {
      async function getWhitelist() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          WHITELISTED_CONTRACT_ADDRESS,
          abi, // Replace with the actual ABI
          provider
        );
  
        try {
          const countOfWhitelist = await contract.numAddressesWhitelisted();
          setNumberOfWhitelisted(countOfWhitelist);
        } catch (error) {
          // Handle the revert error and display an appropriate message
          if (error.code === 'CALL_EXCEPTION') {
            console.log('Transaction reverted without a reason string');
            // Perform additional error handling or show an error message to the user
          } else {
            console.error(error);
          }
        }
      }
  
      getWhitelist();
    } catch (err) {
      console.log(err);
    }
  }, []);
  

  return (
    <div className='w-full h-screen sm:h-full'>
      <div className='max-w-[1240px] mx-auto px-4 my-2 py-3 sm:my-20 sm:py-20  items-center justify-center'>
        <div className='grid lg:grid-cols-2 items-center justify-center '>
          <div>
            <h1 className='text-4xl my-10 px-2 mx-10 bg-gradient-to-r from-[#d832dd] to-[#fd8686] text-transparent bg-clip-text font-bold'>Welcome to the Crypto Devs </h1>
            <h2 className='text-lg my-5 px-2 mx-10 font-extrabold text-[#f0097e]'> Its an NFT collection for crypto and web3 developers.</h2>
            <h3 className='text-base my-5 px-2 mx-10 font-extrabold text-[#f0097e]'> {numberOfWhitelisted} Have already Joined the whiteList!.</h3>
            {renderButton()}
          </div>
          <div className='transparent my-2 mx-5 '>
            <div className=' items-center justify-center my-10 ml-5 px-20'>
              <Image src={illustrator}
                height="200"
                width="300"
                className=''
                alt="/"
              />
              <div className='items-center justify-center text-center mr-10 text-lg font-extrabold text-black'><p>Are You Bored ? </p></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero;
