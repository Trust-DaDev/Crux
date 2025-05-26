const toggle = document.getElementById('darkModeToggle');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');
const body = document.body;
const navbar = document.querySelector('nav');
const main = document.querySelector('main');
const sections = document.querySelectorAll('section');
const postContent = document.getElementById('postContent');
const createPostBtn = document.getElementById('createPost');
const postsContainer = document.getElementById('posts');
const welcomeDiv = document.getElementById('welcomeName');
const nameModal = document.getElementById('nameModal');
const nameInput = document.getElementById('nameInput');
const submitName = document.getElementById('submitName');

let darkMode = localStorage.getItem('darkMode') === 'true';

function applyMode() {
  if (darkMode) {
    body.classList.remove('bg-light', 'text-gray-800');
    body.classList.add('bg-black', 'text-gray-200');
    navbar.classList.remove('bg-white');
    navbar.classList.add('bg-gray-900');
    sections.forEach(sec => sec.classList.replace('bg-white', 'bg-gray-800'));
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
    welcomeDiv.style.color = '#ffffff';
    welcomeDiv.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.6)';
  } else {
    body.classList.add('bg-light', 'text-gray-800');
    body.classList.remove('bg-black', 'text-gray-200');
    navbar.classList.add('bg-white');
    navbar.classList.remove('bg-gray-900');
    sections.forEach(sec => sec.classList.replace('bg-gray-800', 'bg-white'));
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
    welcomeDiv.style.color = '#4b5563';
    welcomeDiv.style.textShadow = '0 0 5px rgba(0,0,0,0.15)';
  }
}

toggle.addEventListener('click', () => {
  darkMode = !darkMode;
  localStorage.setItem('darkMode', darkMode);
  applyMode();
});

applyMode();

if (!localStorage.getItem('username')) {
  nameModal.classList.remove('hidden');
} else {
  welcomeDiv.textContent = `Hi, ${localStorage.getItem('username')} 👋`;
  welcomeDiv.classList.remove('hidden');
  nameModal.classList.add('hidden');
}

submitName.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) {
    localStorage.setItem('username', name);
    welcomeDiv.textContent = `Hi, ${name} 👋`;
    welcomeDiv.classList.remove('hidden');
    nameModal.classList.add('hidden');
  }
});

createPostBtn.addEventListener('click', () => {
  const content = postContent.value.trim();
  if (!content) return alert('Please write something before posting.');
  const name = localStorage.getItem('username') || "Anonymous";

  const postEl = document.createElement('div');
  postEl.className = "bg-white shadow-md rounded-2xl p-6 space-y-3 transition-colors duration-500 relative";

  // Removed the 3 dots menu button and delete button HTML here:
  postEl.innerHTML = `
  <div class="flex justify-between items-center">
    <div class="text-sm font-bold text-gray-700 dark:text-gray-800 font-[Outfit]">${name}</div>
  </div>
  <div class="text-lg font-crux text-crux mt-1 post-content">${content}</div>
  
  <div class="flex flex-wrap items-center justify-between space-y-2 sm:space-y-0 gap-3">
    <div class="flex space-x-3">
      <span class="cursor-pointer text-xl hover:scale-110 transition">😀</span>
      <span class="cursor-pointer text-xl hover:scale-110 transition">❤️</span>
      <span class="cursor-pointer text-xl hover:scale-110 transition">🔥</span>
      <span class="cursor-pointer text-xl hover:scale-110 transition">👍</span>
    </div>
    <div class="flex-1 flex items-center gap-2">
      <input
        type="text"
        placeholder="Write a reply..."
        class="reply-input w-full text-sm bg-transparent font-[Outfit] text-gray-800 dark:text-gray-700 border-0 border-b-2 border-black dark:border-black focus:outline-none focus:border-blue-400 transition-colors"
      />
      <button
        class="reply-btn px-6 py-2 bg-crux text-white font-semibold font-[Outfit] rounded-full hover:bg-[#6f3ec1] transition"
      >Reply</button>
    </div>
  </div>

  <div class="replies space-y-2 mt-4"></div>
  `;

  postsContainer.prepend(postEl);
  postContent.value = '';

  // Reply logic
  const replyInput = postEl.querySelector('.reply-input');
  const replyBtn = postEl.querySelector('.reply-btn');
  const repliesContainer = postEl.querySelector('.replies');

  replyBtn.addEventListener('click', () => {
    const replyText = replyInput.value.trim();
    if (!replyText) return;

    const replierName = localStorage.getItem('username') || 'Anonymous';

    const replyEl = document.createElement('div');
    replyEl.className = "p-3 rounded-lg font-[Outfit] text-sm bg-gray-500 text-black dark:bg-gray-700 dark:text-gray-200 transition";

    const nameEl = document.createElement('div');
    nameEl.className = "font-bold text-xs mb-1";
    nameEl.textContent = replierName;

    const textEl = document.createElement('div');
    textEl.textContent = replyText;

    replyEl.appendChild(nameEl);
    replyEl.appendChild(textEl);

    repliesContainer.appendChild(replyEl);
    replyInput.value = '';
  });

  // Removed menu toggle and delete functionality code here

});


const walletConnected = localStorage.getItem("walletConnected");
if (walletConnected === "true") {
  document.getElementById("nameModal").style.display = "none";
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

  // Add more Web3 and contract interaction logic here if needed...
});
