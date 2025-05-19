const hre = require("hardhat");

async function main() {
  const SocialMedia = await hre.ethers.getContractFactory("SocialMedia");
  const social = await SocialMedia.deploy();

  await social.waitForDeployment();


  console.log(`✅ SocialMedia deployed to: ${social.target}`);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
