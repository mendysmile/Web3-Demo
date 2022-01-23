// Task 1: Initial setup
// We want to connect to the Kovan testnet (explorer: https://kovan.etherscan.io/)
// If this is your first time doing this, go to https://infura.io/ to register an account and create a project.

require("dotenv").config();
const Web3 = require("web3");
const rpcURL = `https://kovan.infura.io/v3/${process.env.projectID}`;

// import private key
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKey = process.env.privateKey;
const provider = new HDWalletProvider(privateKey, rpcURL);
const web3 = new Web3(provider);

async function main() {
  // See if the account is recovered from private key successfully
  const accounts = await web3.eth.getAccounts();
  console.log(`Account: ${accounts[0]}\n`);

  await keypress();

  // Task 2: Get ETH balance of an address
  // Double check if the amount is correct here: https://kovan.etherscan.io/address/0x0af2cAEd76f88117AF9683C15233CbC682Fc030c

  const balanceInWei = await web3.eth.getBalance(accounts[0]);
  const balanceInETH = web3.utils.fromWei(balanceInWei, "ether");
  console.log(`There's ${balanceInETH} ETH in the address ${accounts[0]}\n`);

  await keypress();

  // Task 3: Set up smart contract
  // 1. Go to https://remix.ethereum.org/ and deploy a Storage contract
  // 2. Copy ABI and contract address after deployment succeed
  // 3. Run this script

  const abi = [
    {
      inputs: [],
      name: "retrieve",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "num",
          type: "uint256",
        },
      ],
      name: "store",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const contractAddress = "0xF4913e58570FD7fD8fB0487104a72f231a20476C";

  const contract = new web3.eth.Contract(abi, contractAddress);
  console.log("Smart contract functions: ", contract.methods);

  await keypress();

  // Task 4: Interact with the smart contract
  // Set the contract value to 700

  const initialValue = await contract.methods.retrieve().call();
  console.log("\nInitial value:", initialValue);

  const newValue = 700;
  console.log(`Setting the value to ${newValue}...`);
  const txReceipt = await contract.methods
    .store(newValue)
    .send({ from: accounts[0] });

  const updatedValue = await contract.methods.retrieve().call();
  console.log("Value afterwards:", updatedValue);

  await keypress();

  // View receipt of the transaction we just sent
  console.log("\nTransaction receipt:", txReceipt);
}

main();

const keypress = async () => {
  process.stdin.setRawMode(true);
  return new Promise((resolve) =>
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
};
