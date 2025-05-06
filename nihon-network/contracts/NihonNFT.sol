// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NihonNFT is ERC721, ERC721URIStorage, Ownable {
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
    }

    // Mapeo de tokenId a metadatos
    mapping(uint256 => DocumentMetadata) public documentMetadata;

    constructor() ERC721("Nihon Network Documents", "NND") Ownable(msg.sender) {}

    function safeMint(
        address to,
        string memory uri,
        string memory title,
        string memory documentType,
        string memory issuer,
        string memory ipfsHash
    ) public payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        documentMetadata[tokenId] = DocumentMetadata({
            title: title,
            documentType: documentType,
            issuer: issuer,
            timestamp: block.timestamp,
            ipfsHash: ipfsHash
        });
    }

    // Función para verificar la autenticidad de un documento
    function verifyDocument(uint256 tokenId) public view returns (bool) {
        return _exists(tokenId);
    }

    // Función para obtener los metadatos de un documento
    function getDocumentMetadata(uint256 tokenId) public view returns (
        string memory title,
        string memory documentType,
        string memory issuer,
        uint256 timestamp,
        string memory ipfsHash
    ) {
        require(_exists(tokenId), "Token does not exist");
        DocumentMetadata memory metadata = documentMetadata[tokenId];
        return (
            metadata.title,
            metadata.documentType,
            metadata.issuer,
            metadata.timestamp,
            metadata.ipfsHash
        );
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