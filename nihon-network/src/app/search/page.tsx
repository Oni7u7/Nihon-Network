'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { usePrivy } from '@privy-io/react-auth';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getTokenInfo, getBalance, approveSpending } from '../../utils/contract';
import { CONTRACT_ADDRESS } from '../../config';
import { uploadDocument, getDocument, verifyDocument } from '../../utils/startale';

// Add type definition for window.ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}

export default function SearchResults() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q');
    const { login, logout, authenticated, user, ready } = usePrivy();
    const [error, setError] = useState<string>('');
    const [showAddDocument, setShowAddDocument] = useState(false);
    const [newDocument, setNewDocument] = useState({
        title: '',
        type: '',
        issuer: '',
        amount: '0.1' // Cantidad fija en ASTR
    });
    const [loading, setLoading] = useState(false);
    const [tokenInfo, setTokenInfo] = useState<any>(null);

    // Get wallet address from Privy user
    const walletAddress = user?.wallet?.address 
        ? `${user.wallet.address.substring(0, 4)}...${user.wallet.address.substring(user.wallet.address.length - 4)}`
        : "0x0000...0000";

    useEffect(() => {
        const loadTokenInfo = async () => {
            try {
                const info = await getTokenInfo();
                setTokenInfo(info);
            } catch (err) {
                console.error('Error loading token info:', err);
                setError('Error loading token information');
            }
        };
        loadTokenInfo();
    }, []);

    // Mock documents data
    const mockDocuments = [
        {
            id: '0X4X8XJXKXLXOX9X0',
            title: 'Certificado de Participación - Evento Blockchain 2024',
            date: '2024-03-15',
            type: 'Certificado',
            issuer: 'Nihon Network'
        },
        {
            id: '0X5X9XKXLXMXPX0X1',
            title: 'Diploma de Desarrollo Web',
            date: '2024-02-20',
            type: 'Diploma',
            issuer: 'Nihon Academy'
        }
    ];

    // Filter documents based on search query
    const filteredDocuments = mockDocuments.filter(doc => 
        doc.id.toLowerCase() === searchQuery?.toLowerCase()
    );

    const handleAddDocument = async () => {
        if (!authenticated) {
            setError('Por favor conecta tu wallet primero');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Convertir la cantidad a wei
            const amountInWei = ethers.parseUnits(newDocument.amount, tokenInfo?.decimals || 18);

            // Aprobar el gasto
            await approveSpending(CONTRACT_ADDRESS, amountInWei.toString());

            // Subir el documento a Startale Cloud Service
            const metadata = {
                title: newDocument.title,
                type: newDocument.type,
                issuer: newDocument.issuer,
                walletAddress: user?.wallet?.address,
                timestamp: new Date().toISOString()
            };

            const uploadResponse = await uploadDocument(
                new File([JSON.stringify(metadata)], 'document.json', { type: 'application/json' }),
                metadata
            );

            if (!uploadResponse.success) {
                throw new Error(uploadResponse.error || 'Error al subir el documento');
            }

            // Cerrar el modal y resetear el formulario
            setShowAddDocument(false);
            setNewDocument({
                title: '',
                type: '',
                issuer: '',
                amount: '0.1'
            });

            // Mostrar mensaje de éxito
            alert('Documento agregado exitosamente');
        } catch (err) {
            console.error('Error al agregar documento:', err);
            setError('Error al procesar el pago o subir el documento. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyDocument = async (documentId: string) => {
        if (!authenticated || !user?.wallet?.address) {
            setError('Por favor conecta tu wallet primero');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const verifyResponse = await verifyDocument(documentId, user.wallet.address);

            if (!verifyResponse.success) {
                throw new Error(verifyResponse.error || 'Error al verificar el documento');
            }

            alert('Documento verificado exitosamente');
        } catch (err) {
            console.error('Error al verificar documento:', err);
            setError('Error al verificar el documento. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
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
        <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white relative">
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

            <div className="w-full max-w-4xl mx-auto mt-20">
                {/* Header centrado */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Resultados de Búsqueda
                    </h1>
                    {authenticated && (
                        <button
                            onClick={() => setShowAddDocument(true)}
                            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Agregar Documento
                        </button>
                    )}
                </div>

                {/* Search Panel */}
                <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 mb-8">
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            defaultValue={searchQuery || ''}
                            className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Link 
                            href="/"
                            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Volver
                        </Link>
                    </div>
                </div>

                {/* Modal para agregar documento */}
                {showAddDocument && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Agregar Nuevo Documento</h2>
                                <button
                                    onClick={() => setShowAddDocument(false)}
                                    className="text-white hover:text-gray-300"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Título del Documento
                                    </label>
                                    <input
                                        type="text"
                                        value={newDocument.title}
                                        onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Tipo de Documento
                                    </label>
                                    <input
                                        type="text"
                                        value={newDocument.type}
                                        onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Emisor
                                    </label>
                                    <input
                                        type="text"
                                        value={newDocument.issuer}
                                        onChange={(e) => setNewDocument({...newDocument, issuer: e.target.value})}
                                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Costo en ASTR
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={newDocument.amount}
                                            readOnly
                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                                        />
                                        <span className="text-white">ASTR</span>
                                    </div>
                                </div>
                                {error && (
                                    <div className="text-red-500 text-sm">{error}</div>
                                )}
                                <button
                                    onClick={handleAddDocument}
                                    disabled={loading}
                                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Procesando...' : 'Pagar y Agregar Documento'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                <div className="space-y-4">
                    {filteredDocuments.length > 0 ? (
                        filteredDocuments.map((doc) => (
                            <div key={doc.id} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                                <h3 className="text-xl font-semibold text-white mb-2">{doc.title}</h3>
                                <div className="grid grid-cols-2 gap-4 text-gray-300">
                                    <div>
                                        <p className="text-sm text-gray-400">ID del Documento</p>
                                        <p className="font-mono">{doc.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Fecha</p>
                                        <p>{doc.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Tipo</p>
                                        <p>{doc.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Emisor</p>
                                        <p>{doc.issuer}</p>
                                    </div>
                                </div>
                                {authenticated && (
                                    <div className="mt-4 flex items-center space-x-4">
                                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                                            Credencial Válida
                                        </button>
                                        <button 
                                            onClick={() => handleVerifyDocument(doc.id)}
                                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            Verificar Documento
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 text-center">
                            <h3 className="text-xl font-semibold text-white mb-2">No se encontraron resultados</h3>
                            <p className="text-gray-300">No se encontró ninguna credencial con el ID proporcionado.</p>
                            <p className="text-gray-400 mt-2">IDs válidos de ejemplo:</p>
                            <div className="mt-2 space-y-1">
                                {mockDocuments.map(doc => (
                                    <p key={doc.id} className="font-mono text-sm">{doc.id}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
} 