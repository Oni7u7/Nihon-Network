import { ethers } from 'ethers';

// Network configuration
export const NETWORK_CONFIG = {
    chainId: 123420001114,
    name: 'Astar',
    rpcUrl: 'https://soneium-minato.rpc.scs.startale.com',
    nativeCurrency: {
        name: 'ASTR',
        symbol: 'ASTR',
        decimals: 18
    }
};

// Contract address for the token
export const CONTRACT_ADDRESS = "0x2CAE934a1e84F693fbb78CA5ED3B0A6893259441";

// Initialize provider with network configuration
export const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum, {
            name: NETWORK_CONFIG.name,
            chainId: NETWORK_CONFIG.chainId
        });
    }
    throw new Error('MetaMask not found');
};

// Function to get signer for write operations
export const getSigner = async () => {
    const provider = getProvider();
    return await provider.getSigner();
};

// ERC20 ABI (minimal version for our needs)
export const erc20Abi = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address, uint256) returns (bool)",
    "function allowance(address, address) view returns (uint256)",
    "function approve(address, uint256) returns (bool)",
    "function transferFrom(address, address, uint256) returns (bool)"
]; 