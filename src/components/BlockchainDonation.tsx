'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { FaWallet, FaEthereum, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';

// Extend Window interface to include ethereum property
declare global {
  interface Window {
    ethereum?: {
      request: (request: { 
        method: string, 
        params?: Array<{ chainId: string } | string | number> 
      }) => Promise<string>;
      isMetaMask?: boolean;
      chainId?: string;
      on: (event: string, callback: (...args: Array<string>) => void) => void;
      removeListener: (event: string, callback: (...args: Array<string>) => void) => void;
    }
  }
}

// Detailed ABI for debugging
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "getTotalDonations",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "string", "name": "_message", "type": "string"}],
    "name": "donate",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDonorCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract Addresses for Different Networks
const CONTRACT_ADDRESSES = {
  sepolia: '0x8612b3453cD132b00a1032BCa6b921fF32920417', // Your Sepolia contract address
  ethereum: '0x...' // Your Ethereum contract address
};

// Network Configuration Type
type NetworkConfig = {
  name: string;
  chainId: number;
  rpcUrl: string;
  currency: string;
  explorerUrl: string;
  contractAddress: string;
  icon: React.ReactNode;
};

// Supported Networks Configuration
const SUPPORTED_NETWORKS: { [key: string]: NetworkConfig } = {
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/1edc45f2ccb448189e3db9a33bf9848e',
    currency: 'ETH',
    explorerUrl: 'https://sepolia.etherscan.io',
    contractAddress: CONTRACT_ADDRESSES.sepolia,
    icon: <FaEthereum className="text-blue-500" />
  },
  ethereum: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://mainnet.infura.io/v3/1edc45f2ccb448189e3db9a33bf9848e',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    contractAddress: CONTRACT_ADDRESSES.ethereum,
    icon: <FaEthereum className="text-blue-500" />
  }
};

// Unused variables handling
// eslint-disable-next-line @typescript-eslint/no-unused-va

// Comprehensive error handling type
type ErrorDetails = {
  code?: number;
  message: string;
};

// Error handling type
type ErrorHandler = (error: ErrorDetails) => void;

// Define a specific type for the event listener
type EthereumChainId = string;

// Add a more comprehensive type for Ethereum chain parameters
type EthereumChainParams = {
  chainId: string;
  chainName?: string;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
  blockExplorerUrls?: string[];
};

export default function BlockchainDonation() {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [donationAmount, setDonationAmount] = useState<string>('0.01');
  const [totalDonations, setTotalDonations] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [donationMethod, setDonationMethod] = useState<'blockchain' | 'cash'>('blockchain');
  const [cashDonationDetails, setCashDonationDetails] = useState({
    name: '',
    email: '',
    amount: '',
    message: ''
  });
  const [networkInfo, setNetworkInfo] = useState<{
    chainId: string | null,
    networkName: string | null
  }>({
    chainId: null,
    networkName: null
  });
  const [currentContractAddress, setCurrentContractAddress] = useState<string>(CONTRACT_ADDRESSES.sepolia);

  // Enhanced Donation Receipt Type
  type DonationReceipt = {
    transactionHash: string;
    amount: string;
    timestamp: number;
    donorAddress: string;
    networkName: string;
  };

  // Donation receipt state
  const [donationReceipt, setDonationReceipt] = useState<DonationReceipt | null>(null);

  // Comprehensive Error Handler with useCallback
  const handleError: ErrorHandler = useCallback((error: ErrorDetails) => {
    // Log the error for debugging purposes
    console.error('Blockchain Donation Error:', error);
    setError(error.message);
  }, []);

  // Comprehensive Network Validation
  const validateNetwork = async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork();
      const expectedChainId = network.chainId;
      
      // Supported network chain IDs
      const SEPOLIA_CHAIN_ID = BigInt(11155111);
      
      if (expectedChainId !== SEPOLIA_CHAIN_ID) {
        throw new Error(`Incorrect network. Please switch to Sepolia Testnet.`);
      }
      
      return {
        chainId: expectedChainId.toString(),
        networkName: 'Sepolia Testnet'
      };
    } catch (error) {
      console.error('Network Validation Error:', error);
      throw error;
    }
  };

  // Account Change Handler
  const handleAccountsChanged = useCallback((...accounts: string[]) => {
    if (accounts.length > 0) {
      // Set the first account as the current account
      setAccount(accounts[0]);
    } else {
      // No accounts connected, reset the account state
      setAccount(null);
    }
  }, []);

  // Network Change Handler
  const handleNetworkChanged = useCallback((chainId: EthereumChainId) => {
    // Convert chainId to a number and find corresponding network
    const numericChainId = parseInt(chainId, 16);
    const networkName = Object.values(SUPPORTED_NETWORKS).find(
      network => network.chainId === numericChainId
    )?.name || 'Unknown Network';

    setNetworkInfo({
      chainId: chainId,
      networkName: networkName
    });

    // Update contract address based on network
    const newContractAddress = Object.values(SUPPORTED_NETWORKS).find(
      network => network.chainId === numericChainId
    )?.contractAddress || CONTRACT_ADDRESSES.sepolia;

    setCurrentContractAddress(newContractAddress);
  }, []);

  // Account and Network Change Listener
  useEffect(() => {
    // Check if ethereum is available
    if (!window.ethereum) return;

    // Event listeners


    const handleNetworkChangedWrapper = (...args: [string]) => {
      handleNetworkChanged(...args);
    };

    // Add event listeners
    window.ethereum.on('accountsChanged', handleNetworkChangedWrapper);
    window.ethereum.on('chainChanged', handleNetworkChangedWrapper);

    // Cleanup function to remove listeners
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleNetworkChangedWrapper);
      window.ethereum?.removeListener('chainChanged', handleNetworkChangedWrapper);
    };
  }, [handleNetworkChanged, handleError]);

  // Automatic Network Switch Function
  const switchToSepoliaNetwork = async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed');
      return false;
    }

    try {
      // Request to switch to Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }]
      });
      return true;
    } catch (switchError: unknown) {
      // If network not found, add the Sepolia network
      if (switchError && typeof switchError === 'object' && 'code' in switchError && (switchError as ErrorDetails).code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7',
              chainName: 'Sepolia Testnet',
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'ETH',
                decimals: 18
              },
              rpcUrls: ['https://sepolia.infura.io/v3/'],
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            } as EthereumChainParams]
          });
          return true;
        } catch (error: unknown) {
          setError('Failed to add Sepolia Network. Please add manually.');
          return false;
        }
      } else {
        setError('Failed to switch to Sepolia Network');
        return false;
      }
    }
  };

  // Comprehensive Wallet Connection
  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Ensure MetaMask is available
      if (!window.ethereum) {
        setError('MetaMask not detected. Please install MetaMask.');
        setIsLoading(false);
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Validate and switch to Sepolia Network
      const networkSwitched = await switchToSepoliaNetwork();
      if (!networkSwitched) {
        setIsLoading(false);
        return;
      }

      // Set connected account
      if (accounts.length > 0) {
        setAccount(accounts[0]);

        // Get balance
        if (!window.ethereum) {
          throw new Error('Ethereum provider not found. Please install MetaMask.');
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceWei = await provider.getBalance(accounts[0]);
        const balanceEth = ethers.formatEther(balanceWei);
        setBalance(balanceEth);

        // Set network info
        setNetworkInfo({
          chainId: '0xaa36a7',
          networkName: 'Sepolia Testnet'
        });

        // Set current contract address
        setCurrentContractAddress(CONTRACT_ADDRESSES.sepolia);
      }
    } catch (error: unknown) {
      handleError(error as ErrorDetails);
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced Blockchain Donation Handler
  const handleBlockchainDonation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate wallet connection
      if (!account) {
        throw new Error('Please connect your wallet first');
      }

      // Validate donation amount
      const parsedAmount = parseFloat(donationAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error('Invalid donation amount. Please enter a positive number.');
      }

      // Provider and network validation
      if (!window.ethereum) {
        throw new Error('Ethereum provider not found. Please install MetaMask.');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Validate network
      const networkInfo = await validateNetwork(provider);

      // Create contract instance with CURRENT contract address
      const contract = new ethers.Contract(
        currentContractAddress, 
        CONTRACT_ABI, 
        signer
      );

      // Perform donation
      const tx = await contract.donate(`Donation on ${networkInfo.networkName}`, {
        value: ethers.parseEther(donationAmount)
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Create donation receipt
      const donationReceipt: DonationReceipt = {
        transactionHash: receipt.hash,
        amount: donationAmount,
        timestamp: Date.now(),
        donorAddress: account,
        networkName: networkInfo.networkName
      };

      // Update states
      setDonationReceipt(donationReceipt);
      setTotalDonations((prevTotal) => 
        (parseFloat(prevTotal) + parsedAmount).toString()
      );

      // Reset donation amount
      setDonationAmount('0.01');

    } catch (err: unknown) {
      // Detailed error handling
      let errorMessage = 'An unexpected error occurred';
      
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Specific error type handling
        if (err.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds. Please check your wallet balance.';
        } else if (err.message.includes('user rejected transaction')) {
          errorMessage = 'Transaction was cancelled by user.';
        } else if (err.message.includes('network')) {
          errorMessage = 'Please connect to the Sepolia Testnet.';
        }
      }

      setError(errorMessage);
      console.error('Donation Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Cash Donation Handler
  const handleCashDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/donations/cash', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cashDonationDetails)
      });

      if (!response.ok) {
        throw new Error('Cash donation submission failed');
      }

      // Parse response and store donation receipt
      const receiptData = await response.json();
      setDonationReceipt(receiptData);

      // Optional: Log donation receipt for debugging
      console.log('Donation Receipt:', receiptData);

      // Handle successful donation (e.g., show thank you message, reset form)
      alert('Thank you for your donation!');
      setCashDonationDetails({
        name: '',
        email: '',
        amount: '',
        message: ''
      });
    } catch (error: unknown) {
      // Log the specific error details
      console.error('Cash Donation Error:', error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch total donations with useCallback to stabilize the function
  const fetchTotalDonations = useCallback(async (provider?: ethers.BrowserProvider) => {
    try {
      // Use provided provider or create a new one
      const currentProvider = provider || (window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null);
      
      if (!currentProvider) {
        throw new Error('Ethereum provider not found. Please install MetaMask.');
      }

      console.group('Donation Fetch Diagnostics');
      console.log('Contract Address:', currentContractAddress);
      // Add more diagnostic logging as needed
      console.groupEnd();
    } catch (error: unknown) {
      handleError(error as ErrorDetails);
    }
  }, [currentContractAddress, handleError]);

  useEffect(() => {
    if (account) {
      fetchTotalDonations();
    }
  }, [account, fetchTotalDonations]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-black/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center text-white">
          Donate to Support Farmers
        </h2>
        
        {/* Network Connection Guide */}
        {error && error.includes('contract') && (
          <div className="text-center mt-4">
            <button 
              onClick={() => setError(null)}
              className="text-blue-400 underline text-sm hover:text-blue-300 transition"
            >
              Need help connecting to networks?
            </button>
          </div>
        )}
        
        {/* Donation Method Selector */}
        <div className="flex justify-center mb-4 space-x-2">
          <button
            onClick={() => setDonationMethod('blockchain')}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${donationMethod === 'blockchain' ? 'bg-blue-500/70 text-white' : 'bg-white/20 text-white/70'}`}
          >
            <FaEthereum className="inline mr-1 sm:mr-2" /> Blockchain
          </button>
          <button
            onClick={() => setDonationMethod('cash')}
            className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-sm sm:text-base ${donationMethod === 'cash' ? 'bg-green-500/70 text-white' : 'bg-white/20 text-white/70'}`}
          >
            <FaMoneyBillWave className="inline mr-1 sm:mr-2" /> Cash
          </button>
        </div>

        {/* Blockchain Donation Form */}
        {donationMethod === 'blockchain' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            {/* Network Warning */}
            {networkInfo.networkName && (
              <div className="mb-4 text-center">
                <p className="text-white/70 text-sm sm:text-base">
                  Connected to {networkInfo.networkName}
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-4 text-center flex items-center justify-center">
                <FaExclamationTriangle className="mr-2" />
                {error}
              </div>
            )}

            {!account ? (
              <button 
                onClick={connectWallet}
                disabled={isLoading}
                className={`w-full btn btn-primary flex items-center justify-center text-sm sm:text-base ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaWallet className="mr-1 sm:mr-2" /> 
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-3 sm:p-4">
                  <p className="text-white/70 text-sm sm:text-base">Connected Wallet:</p>
                  <p className="text-white text-xs sm:text-sm truncate">{account}</p>
                  <p className="text-white/70 mt-2 text-sm sm:text-base">Balance: {balance} ETH</p>
                </div>

                <div>
                  <label className="block text-white/70 mb-2 text-sm sm:text-base">
                    Donation Amount (ETH)
                  </label>
                  <input 
                    type="number" 
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full bg-white/20 text-white border border-white/20 rounded-lg p-2 text-sm sm:text-base"
                    min="0.01"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>

                <button 
                  onClick={handleBlockchainDonation}
                  disabled={isLoading}
                  className={`w-full btn btn-secondary flex items-center justify-center text-sm sm:text-base ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FaEthereum className="mr-1 sm:mr-2" /> 
                  {isLoading ? 'Processing...' : 'Donate Now'}
                </button>

                <div className="text-center mt-4">
                  <p className="text-white/70 text-sm sm:text-base">
                    Total Donations: {totalDonations} ETH
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cash Donation Form */}
        {donationMethod === 'cash' && (
          <form onSubmit={handleCashDonation} className="space-y-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-white/70">Full Name</label>
              <input
                type="text"
                id="name"
                value={cashDonationDetails.name}
                onChange={(e) => setCashDonationDetails({...cashDonationDetails, name: e.target.value})}
                required
                className="mt-1 block w-full bg-white/20 text-white border border-white/20 rounded-lg p-2 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-white/70">Email</label>
              <input
                type="email"
                id="email"
                value={cashDonationDetails.email}
                onChange={(e) => setCashDonationDetails({...cashDonationDetails, email: e.target.value})}
                required
                className="mt-1 block w-full bg-white/20 text-white border border-white/20 rounded-lg p-2 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-xs sm:text-sm font-medium text-white/70">Donation Amount ($)</label>
              <input
                type="number"
                id="amount"
                value={cashDonationDetails.amount}
                onChange={(e) => setCashDonationDetails({...cashDonationDetails, amount: e.target.value})}
                min="1"
                required
                className="mt-1 block w-full bg-white/20 text-white border border-white/20 rounded-lg p-2 text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-white/70">Optional Message</label>
              <textarea
                id="message"
                value={cashDonationDetails.message}
                onChange={(e) => setCashDonationDetails({...cashDonationDetails, message: e.target.value})}
                rows={2}
                className="mt-1 block w-full bg-white/20 text-white border border-white/20 rounded-lg p-2 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-500/70 text-white py-2 rounded hover:bg-green-600/70 transition duration-300 backdrop-blur-sm"
            >
              {isLoading ? 'Processing...' : 'Donate Cash'}
            </button>
          </form>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-center text-sm sm:text-base">
            <strong className="font-bold">Error: </strong>
            <span className="block">{error}</span>
          </div>
        )}
        
        <div className="text-center mt-4">
          <p className="text-white/80 mb-2">
            &quot;Empowering farmers through blockchain technology&quot;
          </p>
          <p className="text-white/80">
            &quot;Every donation brings hope and sustainable change&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
