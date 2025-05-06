import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, erc20Abi, getProvider, getSigner } from '../config';

export const getTokenInfo = async () => {
    try {
        const provider = await getProvider();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, erc20Abi, provider);

        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();

        return {
            name,
            symbol,
            decimals,
            totalSupply
        };
    } catch (error) {
        console.error('Error getting token info:', error);
        return {
            name: 'ASTR',
            symbol: 'ASTR',
            decimals: 18,
            totalSupply: ethers.parseUnits('0', 18)
        };
    }
};

export const getBalance = async (address: string) => {
    try {
        const provider = await getProvider();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, erc20Abi, provider);
        return await contract.balanceOf(address);
    } catch (error) {
        console.error('Error getting balance:', error);
        return ethers.parseUnits('0', 18);
    }
};

export const approveSpending = async (spender: string, amount: string) => {
    try {
        const signer = await getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, erc20Abi, signer);
        const tx = await contract.approve(spender, amount);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('Error approving spending:', error);
        throw new Error('Failed to approve token spending');
    }
};

export const transferTokens = async (to: string, amount: string) => {
    try {
        const signer = await getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, erc20Abi, signer);
        const tx = await contract.transfer(to, amount);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error('Error transferring tokens:', error);
        throw new Error('Failed to transfer tokens');
    }
}; 