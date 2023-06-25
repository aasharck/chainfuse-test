import React, { useEffect, useState } from 'react';
// reactstrap components
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

import './index.scss';
function HomePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState([])
  const [isSigned, setIsSigned] = useState(false);

  useEffect(() => {
    // Check if Metamask is installed
    if (typeof window.ethereum == 'undefined') {
      alert('No Metamask!');
    } else {
      checkIfWalletIsConnected();
    }
  }, []);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    try {
      if (!ethereum) {
        alert('Please install Metamask');
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      setAccounts(accounts)
      if (accounts.length !== 0) {
        setIsConnected(true);
      } else {
        console.log('No Accounts found');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      // Request access to the user's Metamask wallet
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect to wallet:', error);
    }
  };

  const signWithMetamask = async () =>{
    const { ethereum } = window;
    const provider = new ethers.BrowserProvider(ethereum)
    const signer = await provider.getSigner();
    let message = "Hello, Chainfuse"
    let signature = await signer.signMessage(message);

    let address = ethers.verifyMessage(message, signature);
    
    if(address.toLowerCase() === accounts[0].toLowerCase()){
      console.log("successfully connected")
      setIsSigned(true)
    }

  }

  return (
    <Row className="padding-32">
      <Col xs="4" className="">
        {' '}
        <img src={require('assets/img/logo.png')} />{' '}
      </Col>
      <Col xs="4" className="logo">
        <Link to="/" className="margin-12">
          HOME
        </Link>{' '}
        <span>/</span>
        <Link to="/about" className="margin-12">
          ABOUT
        </Link>{' '}
        <span>/</span>
        <Link to="/loginpage" className="margin-12">
          LOGIN
        </Link>
      </Col>
      <Col xs="4" className="logo">
        {!isConnected ? <a className="margin-12" onClick={connectWallet}>
          Connect Wallet
        </a> : (!isSigned ? <a className="margin-12" onClick={signWithMetamask}>Sign with Metamask</a> : <a className="margin-12">Connected</a>)
         }
      </Col>
    </Row>
  );
}

export default HomePage;
