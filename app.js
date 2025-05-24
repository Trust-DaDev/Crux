const walletConnected = localStorage.getItem("walletConnected");
if (walletConnected === "true") {
  // Hide name modal
  document.getElementById("nameModal").style.display = "none";

  // Optionally use wallet address instead of name
  const walletAddress = localStorage.getItem("userWallet");
  document.getElementById("welcomeName").textContent = `Welcome ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  document.getElementById("welcomeName").classList.remove("hidden");
}



const contractAddress = "0x8dAb63341E31f95D02A54cC2826945772073FBBa"; 
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

window.addEventListener('DOMContentLoaded', async () => {
  const modal = document.getElementById('nameModal');
  const nameInput = document.getElementById('nameInput');
  const submitBtn = document.getElementById('submitName');
  const welcomeDiv = document.getElementById('welcomeName');

  function showWelcome(name) {
    welcomeDiv.textContent = `Welcome ${name}`;
    welcomeDiv.classList.remove('hidden');
    modal.style.display = 'none';
  }

  function showModal() {
    welcomeDiv.classList.add('hidden');
    modal.style.display = 'flex';
  }

  // Initialize web3 and contract if wallet connected
  async function initWeb3AndContract() {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed!');
      return false;
    }
    try {
      web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        return false; // no wallet connected
      }
      userAccount = accounts[0];
      contract = new web3.eth.Contract(contractABI, contractAddress);

      // Optional: show account on UI somewhere
      const accountDiv = document.getElementById('account');
      if (accountDiv) accountDiv.textContent = userAccount;

      return true;
    } catch (err) {
      console.error('Error initializing web3:', err);
      return false;
    }
  }

  async function checkConnectionAndName() {
    const walletConnected = await initWeb3AndContract();
    const savedName = localStorage.getItem('username');
    if (!walletConnected || !savedName) {
      showModal();
    } else {
      showWelcome(savedName);
    }
  }

  submitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert('Please enter your name.');
      return;
    }
    if (name.length > 25) {
      alert('Name cannot exceed 25 characters.');
      return;
    }
    localStorage.setItem('username', name);
    showWelcome(name);
  });

  if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length === 0) {
        showModal();
      } else {
        userAccount = accounts[0];
        await initWeb3AndContract();
        const savedName = localStorage.getItem('username');
        if (savedName) {
          showWelcome(savedName);
        } else {
          showModal();
        }
      }
    });
  }

  await checkConnectionAndName();

  // You can continue to add your post creation and event listening code here...
});
