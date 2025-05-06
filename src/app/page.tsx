'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { getTokenInfo, getBalance, approveSpending, transferTokens } from '../utils/contract';
import { CONTRACT_ADDRESS } from '../config';
import { usePrivy } from '@privy-io/react-auth';

// Add type definition for window.ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}

// Type for MetaMask error
interface MetaMaskError extends Error {
    code: number;
}

export default function Home() {
    const { login, logout, authenticated, user, ready } = usePrivy();
    const [tokenInfo, setTokenInfo] = useState<any>(null);
    const [balance, setBalance] = useState<string>('0');
    const [amount, setAmount] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [selectedToken, setSelectedToken] = useState<string>('ASTR');
    const [exchangeAmount, setExchangeAmount] = useState<string>('');
    const [exchangeRate, setExchangeRate] = useState<number>(1.5);

    // Get wallet address from Privy user
    const walletAddress = user?.wallet?.address 
        ? `${user.wallet.address.substring(0, 4)}...${user.wallet.address.substring(user.wallet.address.length - 4)}`
        : "0x0000...0000";

    useEffect(() => {
        const initialize = async () => {
            try {
                await loadTokenInfo();
            } catch (err) {
                console.error('Initialization error:', err);
                setError('Failed to initialize application. Please check your network connection.');
            }
        };
        initialize();
    }, []);

    useEffect(() => {
        const loadWalletData = async () => {
            if (authenticated && user?.wallet) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const signer = await provider.getSigner();
                    const address = await signer.getAddress();
                    
                    // Get balance
                    const balance = await getBalance(address);
                    setBalance(ethers.formatUnits(balance, tokenInfo?.decimals || 18));
                } catch (err) {
                    console.error('Error loading wallet data:', err);
                    setError('Error loading wallet data. Please try again.');
                }
            }
        };
        loadWalletData();
    }, [authenticated, user, tokenInfo]);

    const loadTokenInfo = async () => {
        try {
            const info = await getTokenInfo();
            setTokenInfo(info);
        } catch (err) {
            console.error('Error loading token info:', err);
            setError('Error loading token information. Please try again later.');
        }
    };

    const handleTransfer = async () => {
        if (!amount || !recipient) {
            setError('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            // Convert amount to wei
            const amountInWei = ethers.parseUnits(amount, tokenInfo?.decimals || 18);
            
            // Transfer tokens
            const tx = await transferTokens(recipient, amountInWei.toString());
            console.log('Transfer successful:', tx);
            
            // Update balance
            const address = await signer.getAddress();
            const newBalance = await getBalance(address);
            setBalance(ethers.formatUnits(newBalance, tokenInfo?.decimals || 18));
            
            // Clear form
            setAmount('');
            setRecipient('');
        } catch (err) {
            console.error('Transfer error:', err);
            setError('Error transferring tokens. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleExchange = () => {
        if (!exchangeAmount) {
            setError('Please enter an amount to exchange');
            return;
        }
        // Here you would implement the actual exchange logic
        console.log(`Exchanging ${exchangeAmount} ${selectedToken}`);
    };

    // Show loading state while Privy is initializing
    if (!ready) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative flex items-center justify-center">
            {/* Nombre en la esquina superior izquierda */}
            <div className="absolute top-8 left-8 z-10">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    JAFED TEAM
                </span>
            </div>

            {/* Botón de wallet en la esquina superior derecha */}
            <div className="absolute top-8 right-8 z-10">
                {!authenticated ? (
                    <button
                        onClick={login}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Connect Wallet
                    </button>
                ) : (
                    <div className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg border border-gray-700">
                        <span className="text-sm text-green-400">
                            {walletAddress}
                        </span>
                        <button
                            onClick={logout}
                            className="text-sm text-red-400 hover:text-red-300 ml-2"
                        >
                            Disconnect
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full max-w-lg flex flex-col items-center justify-center mx-auto">
                {/* Header centrado */}
                <div className="flex justify-center items-center mb-8 w-full">
                    <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Nihon-Network
                    </h1>
                </div>

                {/* Search Panel (centrado) */}
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 w-full flex flex-col items-center">
                    
                    <div className="w-full flex flex-col items-center space-y-4">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-gradient-to-r from-blue-400 to-purple-500"

                            /*className="w-full bg-black-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"*/
                        >
                            Buscar
                        </button>
                    </div>
                    {/* Frase debajo del botón */}
                    <div className="mt-6 text-center text-base text-white/80 font-medium">
                        Verifica tus Certificados NFT o Participación en Eventos Educativos
                    </div>
                </div>
            </div>
        </main>
    );
}
