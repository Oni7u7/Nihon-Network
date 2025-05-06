const API_URL = "https://soneium-minato.rpc.scs.startale.com";
const API_KEY = "Jrtgb0uQEvPhaBG5kH3fCi3cdWbcBcDv";

interface RpcPayload {
    id: number;
    jsonrpc: string;
    method: string;
    params?: any[];
}

export const getBlockNumber = async (): Promise<number> => {
    const payload: RpcPayload = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_blockNumber",
    };

    try {
        const response = await fetch(`${API_URL}?apikey=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return parseInt(data.result, 16);
    } catch (error) {
        console.error('Error fetching block number:', error);
        throw error;
    }
};

export const getBlockInfo = async (blockNumber: number): Promise<any> => {
    const payload: RpcPayload = {
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [`0x${blockNumber.toString(16)}`, true],
    };

    try {
        const response = await fetch(`${API_URL}?apikey=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching block info:', error);
        throw error;
    }
}; 