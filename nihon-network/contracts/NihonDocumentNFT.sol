// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NihonDocumentNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Precio del NFT en ASTR
    uint256 public constant MINT_PRICE = 0.1 ether;

    // Estructura para almacenar metadatos del documento
    struct DocumentMetadata {
        string title;
        string documentType;
        string issuer;
        uint256 timestamp;
        string ipfsHash;
        bool isVerified;
        address verifiedBy;
    }

    // Mapeo de tokenId a metadatos
    mapping(uint256 => DocumentMetadata) public documentMetadata;
    
    // Mapeo de hash IPFS a tokenId para evitar duplicados
    mapping(string => uint256) public ipfsHashToTokenId;
    
    // Mapeo de direcciones autorizadas para verificar documentos
    mapping(address => bool) public authorizedVerifiers;

    // Eventos
    event DocumentMinted(uint256 indexed tokenId, address indexed owner, string ipfsHash);
    event DocumentVerified(uint256 indexed tokenId, address indexed verifier);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    constructor() ERC721("Nihon Network Documents", "NND") Ownable(msg.sender) {
        // El propietario es automáticamente un verificador autorizado
        authorizedVerifiers[msg.sender] = true;
    }

    function safeMint(
        address to,
        string memory uri,
        string memory title,
        string memory documentType,
        string memory issuer,
        string memory ipfsHash
    ) public payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(ipfsHashToTokenId[ipfsHash] == 0, "Document already minted");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        documentMetadata[tokenId] = DocumentMetadata({
            title: title,
            documentType: documentType,
            issuer: issuer,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash,
            isVerified: false,
            verifiedBy: address(0)
        });
        
        ipfsHashToTokenId[ipfsHash] = tokenId;
        
        emit DocumentMinted(tokenId, to, ipfsHash);
    }

    // Función para verificar la autenticidad de un documento
    function verifyDocument(uint256 tokenId) public {
        require(_exists(tokenId), "Token does not exist");
        require(authorizedVerifiers[msg.sender], "Not authorized to verify");
        require(!documentMetadata[tokenId].isVerified, "Document already verified");
        
        documentMetadata[tokenId].isVerified = true;
        documentMetadata[tokenId].verifiedBy = msg.sender;
        
        emit DocumentVerified(tokenId, msg.sender);
    }

    // Función para obtener los metadatos de un documento
    function getDocumentMetadata(uint256 tokenId) public view returns (
        string memory title,
        string memory documentType,
        string memory issuer,
        uint256 timestamp,
        string memory ipfsHash,
        bool isVerified,
        address verifiedBy
    ) {
        require(_exists(tokenId), "Token does not exist");
        DocumentMetadata memory metadata = documentMetadata[tokenId];
        return (
            metadata.title,
            metadata.documentType,
            metadata.issuer,
            metadata.timestamp,
            metadata.ipfsHash,
            metadata.isVerified,
            metadata.verifiedBy
        );
    }

    // Función para agregar un verificador autorizado
    function addVerifier(address verifier) public onlyOwner {
        require(!authorizedVerifiers[verifier], "Already authorized");
        authorizedVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    // Función para remover un verificador autorizado
    function removeVerifier(address verifier) public onlyOwner {
        require(authorizedVerifiers[verifier], "Not authorized");
        authorizedVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    // Función para retirar los fondos recaudados
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Override de las funciones necesarias
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 