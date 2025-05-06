import { ethers } from 'ethers';
import { ASTR_TOKEN_ABI } from './abis/astr-token';

// Configuración de la red Astar
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

// Dirección del contrato ASTR (dirección nativa de ASTR)
export const CONTRACT_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';

// Configuración de Startale Cloud Service
export const STARTALE_CONFIG = {
    apiUrl: 'https://api.scs.startale.com',
    projectId: process.env.NEXT_PUBLIC_STARTALE_PROJECT_ID || '',
    apiKey: process.env.NEXT_PUBLIC_STARTALE_API_KEY || '',
    storageBucket: process.env.NEXT_PUBLIC_STARTALE_BUCKET || 'nihon-network'
};

// Función para obtener el proveedor de MetaMask
export const getProvider = async () => {
    if (typeof window === 'undefined') {
        throw new Error('MetaMask is not available in this environment');
    }

    if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
    }

    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        
        // Verificar la red actual
        const network = await provider.getNetwork();
        
        // Si no estamos en la red de Astar, solicitamos el cambio
        if (network.chainId !== BigInt(NETWORK_CONFIG.chainId)) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: `0x${NETWORK_CONFIG.chainId.toString(16)}`,
                        chainName: NETWORK_CONFIG.name,
                        nativeCurrency: NETWORK_CONFIG.nativeCurrency,
                        rpcUrls: [NETWORK_CONFIG.rpcUrl],
                        blockExplorerUrls: ['https://astar.subscan.io/']
                    }]
                });
            } catch (error) {
                console.error('Error adding Astar network:', error);
                throw new Error('Failed to add Astar network to MetaMask');
            }
        }

        return provider;
    } catch (error) {
        console.error('Error initializing provider:', error);
        throw new Error('Failed to initialize MetaMask provider');
    }
};

// Función para obtener el signer
export const getSigner = async () => {
    try {
        const provider = await getProvider();
        return await provider.getSigner();
    } catch (error) {
        console.error('Error getting signer:', error);
        throw new Error('Failed to get signer');
    }
};

// Función para obtener el contrato ASTR
export const getASTRContract = async () => {
    try {
        const signer = await getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ASTR_TOKEN_ABI, signer);
        
        // Verificar que el contrato está correctamente inicializado
        try {
            await contract.name();
            return contract;
        } catch (error) {
            console.error('Error verifying contract:', error);
            throw new Error('Failed to verify contract');
        }
    } catch (error) {
        console.error('Error getting contract:', error);
        throw new Error('Failed to get contract');
    }
};

// Función para obtener el balance de ASTR
export const getBalance = async (address: string) => {
    try {
        const provider = await getProvider();
        return await provider.getBalance(address);
    } catch (error) {
        console.error('Error getting balance:', error);
        throw new Error('Failed to get balance');
    }
};

// Función para transferir ASTR
export const transferASTR = async (to: string, amount: string) => {
    try {
        const signer = await getSigner();
        const tx = await signer.sendTransaction({
            to,
            value: ethers.parseEther(amount)
        });
        return await tx.wait();
    } catch (error) {
        console.error('Error transferring ASTR:', error);
        throw new Error('Failed to transfer ASTR');
    }
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