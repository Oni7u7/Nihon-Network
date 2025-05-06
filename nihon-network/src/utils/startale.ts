import { STARTALE_CONFIG } from '../config';

interface StartaleResponse {
    success: boolean;
    data?: any;
    error?: string;
}

export const uploadDocument = async (file: File, metadata: any): Promise<StartaleResponse> => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('metadata', JSON.stringify(metadata));

        const response = await fetch(`${STARTALE_CONFIG.apiUrl}/storage/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STARTALE_CONFIG.apiKey}`,
                'Project-ID': STARTALE_CONFIG.projectId
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to upload document');
        }

        const data = await response.json();
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error uploading document:', error);
        return {
            success: false,
            error: 'Failed to upload document'
        };
    }
};

export const getDocument = async (documentId: string): Promise<StartaleResponse> => {
    try {
        const response = await fetch(`${STARTALE_CONFIG.apiUrl}/storage/${documentId}`, {
            headers: {
                'Authorization': `Bearer ${STARTALE_CONFIG.apiKey}`,
                'Project-ID': STARTALE_CONFIG.projectId
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch document');
        }

        const data = await response.json();
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error fetching document:', error);
        return {
            success: false,
            error: 'Failed to fetch document'
        };
    }
};

export const verifyDocument = async (documentId: string, walletAddress: string): Promise<StartaleResponse> => {
    try {
        const response = await fetch(`${STARTALE_CONFIG.apiUrl}/verification/verify`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STARTALE_CONFIG.apiKey}`,
                'Project-ID': STARTALE_CONFIG.projectId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentId,
                walletAddress
            })
        });

        if (!response.ok) {
            throw new Error('Failed to verify document');
        }

        const data = await response.json();
        return {
            success: true,
            data
        };
    } catch (error) {
        console.error('Error verifying document:', error);
        return {
            success: false,
            error: 'Failed to verify document'
        };
    }
}; 