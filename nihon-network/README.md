# Nihon Network - Smart Contract Deployment

Este proyecto contiene el contrato inteligente NihonNFT para la gestión de documentos en la red Astar.

## Requisitos Previos

- Node.js (v16 o superior)
- MetaMask instalado
- Fondos en ASTR en la red Astar
- Clave privada de una wallet con fondos

## Configuración

1. Instala las dependencias:
```bash
npm install
```

2. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:
```
PRIVATE_KEY=tu_clave_privada_de_metamask
ASTAR_API_KEY=tu_api_key_de_astar_explorer
```

## Despliegue del Contrato

1. Compila el contrato:
```bash
npx hardhat compile
```

2. Despliega el contrato en la red Astar:
```bash
npx hardhat run scripts/deploy.ts --network astar
```

## Características del Contrato

- Minting de NFTs con metadatos de documentos
- Verificación de documentos
- Precio fijo de 0.1 ASTR por NFT
- Almacenamiento de metadatos en la blockchain
- Funciones para verificar y obtener metadatos

## Estructura del Proyecto

- `contracts/`: Contiene el código fuente del contrato
- `scripts/`: Scripts de despliegue y pruebas
- `test/`: Tests del contrato
- `artifacts/`: Archivos compilados del contrato
- `cache/`: Cache de Hardhat

## Seguridad

- El contrato utiliza las mejores prácticas de OpenZeppelin
- Implementa controles de acceso y verificaciones de pago
- Incluye manejo seguro de fondos

## Licencia

MIT
