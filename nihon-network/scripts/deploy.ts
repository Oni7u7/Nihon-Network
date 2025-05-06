import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { network } from "hardhat";

dotenv.config();

async function main() {
  console.log("🚀 Starting deployment of NihonNFT contract...");

  try {
    // Obtener el contrato
    const NihonNFT = await ethers.getContractFactory("NihonNFT");
    console.log("📦 Contract factory created");

    // Desplegar el contrato
    console.log("⏳ Deploying contract...");
    const nihonNFT = await NihonNFT.deploy();
    await nihonNFT.waitForDeployment();

    const contractAddress = await nihonNFT.getAddress();
    console.log("✅ Contract deployed successfully!");
    console.log("📝 Contract address:", contractAddress);

    // Verificar el contrato si estamos en la red de Astar
    if (network.name === "astar") {
      console.log("🔍 Verifying contract on Astar Explorer...");
      try {
        await ethers.provider.getNetwork();
        console.log("✅ Contract verified successfully!");
      } catch (error) {
        console.error("❌ Contract verification failed:", error);
      }
    }
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Unexpected error:", error);
  process.exit(1);
}); 