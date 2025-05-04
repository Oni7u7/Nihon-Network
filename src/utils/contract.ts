import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, getProvider, getSigner } from '../config';

// ABI for ERC20 token
const ERC20_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)"
];

export async function getTokenInfo() {
    try {
        const provider = getProvider();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);

        // Try to get contract information with fallback values
        const name = await contract.name().catch(() => 'Unknown Token');
        const symbol = await contract.symbol().catch(() => 'UNK');
        const decimals = await contract.decimals().catch(() => 18);
        const totalSupply = await contract.totalSupply().catch(() => ethers.parseUnits('0', 18));

        return {
            name,
            symbol,
            decimals,
            totalSupply
        };
    } catch (error) {
        console.error('Error getting token info:', error);
        // Return default values if there's an error
        return {
            name: 'Unknown Token',
            symbol: 'UNK',
            decimals: 18,
            totalSupply: ethers.parseUnits('0', 18)
        };
    }
}

export async function getBalance(address: string) {
    try {
        const provider = getProvider();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, provider);
        return await contract.balanceOf(address).catch(() => ethers.parseUnits('0', 18));
    } catch (error) {
        console.error('Error getting balance:', error);
        return ethers.parseUnits('0', 18);
    }
}

export async function approveSpending(spender: string, amount: string) {
    try {
        const signer = await getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, signer);
        const tx = await contract.approve(spender, amount);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('Error approving spending:', error);
        throw new Error('Failed to approve token spending');
    }
}

export async function transferTokens(to: string, amount: string) {
    try {
        const signer = await getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, ERC20_ABI, signer);
        const tx = await contract.transfer(to, amount);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('Error transferring tokens:', error);
        throw new Error('Failed to transfer tokens');
    }
} 