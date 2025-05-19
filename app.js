

const contractAddress = "0x8dAb63341E31f95D02A54cC2826945772073FBBa"; // Replace with actual deployed contract address
const contractABI = [
  {
    "inputs": [{"internalType":"string","name":"_content","type":"string"}],
    "name":"createPost",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs": [{"internalType":"uint256","name":"_id","type":"uint256"}],
    "name":"getPost",
    "outputs": [
      {
        "components":[
          {"internalType":"uint256","name":"id","type":"uint256"},
          {"internalType":"string","name":"content","type":"string"},
          {"internalType":"address","name":"author","type":"address"},
          {"internalType":"uint256","name":"timestamp","type":"uint256"}
        ],
        "internalType":"struct SocialMedia.Post",
        "name":"",
        "type":"tuple"
      }
    ],
    "stateMutability":"view",
    "type":"function"
  }
];

let web3;
let contract;
let userAccount;

window.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connect");
  const accountDiv = document.getElementById("account");

  connectBtn.addEventListener("click", async () => {
    console.log("Connect button clicked.");

    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is detected:", window.ethereum);

      try {
        web3 = new Web3(window.ethereum);

        // Request wallet connection
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        userAccount = accounts[0];
        console.log("Connected account:", userAccount);

        document.getElementById("account").textContent = userAccount;

        // Initialize the contract instance here (make sure contractAddress is set!)
        contract = new web3.eth.Contract(contractABI, contractAddress);

      } catch (error) {
        console.error("Error during wallet connection:", error);
        alert("❌ Failed to connect wallet: " + error.message);
      }
    } else {
      alert("❌ MetaMask is not installed or not detected.");
    }
  });
});

  document.getElementById("createPost").addEventListener("click", async () => {
    const content = document.getElementById("postContent").value;
    if (!content || !contract || !userAccount) return;

    try {
      await contract.methods.createPost(content).send({ from: userAccount });
      alert("✅ Post created!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create post.");
    }
  });


  document.getElementById("viewPost").addEventListener("click", async () => {
    const id = document.getElementById("postId").value;
    if (!id || !contract) return;

    try {
      const post = await contract.methods.getPost(id).call();
      document.getElementById("postOutput").innerText = `
Post #${post.id}
By: ${post.author}
Content: ${post.content}
Timestamp: ${new Date(post.timestamp * 1000).toLocaleString()}
      `;
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch post.");
    }
  });

document.getElementById("createPost").addEventListener("click", async () => {
  const content = document.getElementById("postContent").value;
  if (!content || !contract || !userAccount) return;

  document.getElementById("loading").classList.remove("hidden");

  try {
    await contract.methods.createPost(content).send({ from: userAccount });
    alert("✅ Post created!");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to create post.");
  } finally {
    document.getElementById("loading").classList.add("hidden");
  }
});



document.getElementById("viewPost").addEventListener("click", async () => {
  const id = document.getElementById("postId").value;
  if (!id || !contract) {
    alert("❌ Please enter a valid Post ID.");
    return;
  }

  try {
    const post = await contract.methods.getPost(id).call();
    if (!post.id) {
      alert("❌ Post not found.");
      return;
    }

    document.getElementById("postOutput").innerText = `
Post #${post.id}
By: ${post.author}
Content: ${post.content}
Timestamp: ${new Date(post.timestamp * 1000).toLocaleString()}
    `;
  } catch (err) {
    console.error(err);
    alert("❌ Failed to fetch post.");
  }
});



// const networkId = await web3.eth.net.getId();
// let contractAddress;

// if (networkId === 1) { // Mainnet
//   contractAddress = "MAINNET_CONTRACT_ADDRESS";
// } else if (networkId === 4) { // Rinkeby Testnet
//   contractAddress = "RINKEBY_CONTRACT_ADDRESS";
// } else {
//   alert("Unsupported network. Please switch to Ethereum Mainnet or Rinkeby Testnet.");
// }
// contract = new web3.eth.Contract(contractABI, contractAddress);
