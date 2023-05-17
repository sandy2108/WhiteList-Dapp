import React, { useState , useRef} from 'react'

import {providers,Contract,ethers} from 'ethers';
const Navbar = () => {
  
  const [walletaddress , setwalletaddress]= useState("");
  const [connectWallet,setconnectWallet]=useState(false);
  const [isConnected,setisConnected] =useState(false);
  const middleCutAddress = walletaddress.toString().substring(0, 5) + "..." + walletaddress.toString().substring(walletaddress.toString().length - 5);


  
  
  
  
  async function requestAccounts(){
    console.log("Requesting Account....")

    if(window.ethereum){
      console.log("detected");
      try {
        const accounts = await window.ethereum.request({
          method:"eth_requestAccounts",
        });
        console.log(accounts[0]);
        setwalletaddress(accounts[0]);
        setisConnected(true);
      } catch (err){
        console.log("error connecting...");
      }
      
    }
    else{
      console.log("Not detected");
    }
    
  }

  async function connectWallets() {
    if(typeof window.ethereum !== 'undefined'){
      await requestAccounts();
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer= provider.getSigner();
    }
  }

  return (
    <div>
        <nav className=' w-full h-[80px] shadow-xl bg-gradient-to-r from-[#acb6e5]  to-[#86fde8]'>
        <div className='flex items-center justify-between px-5 my-5 mx-auto max-w-[1240px]'>
          <div className='font-bold text-center text-4xl'>
            <p>SANDY</p>
          </div>
          <div className='text-center text-2xl font-bold'>

                
             {
              isConnected ? (<button className='rounded-full button p-2 text-black'>{middleCutAddress}</button>) :
              (<button onClick={connectWallets} className='button p-2 text-black'>Connect Wallet!</button>)
             }
             
          </div>
          
        </div>
      </nav>
    </div>
  )
}

export default Navbar