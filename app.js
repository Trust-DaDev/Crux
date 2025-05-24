// this for welcome +name
function applyMode() {
  if (darkMode) {
    body.classList.remove('bg-light', 'text-gray-800');
    body.classList.add('bg-black', 'text-gray-200');

    navbar.classList.remove('bg-white');
    navbar.classList.add('bg-gray-900');

    sections.forEach(sec => {
      sec.classList.remove('bg-white');
      sec.classList.add('bg-gray-800');
    });

    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');

    // Dark mode welcome name color and shadow
    welcomeDiv.style.color = '#ffffff';  // white
    welcomeDiv.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.6)';
  } else {
    body.classList.add('bg-light', 'text-gray-800');
    body.classList.remove('bg-black', 'text-gray-200');

    navbar.classList.add('bg-white');
    navbar.classList.remove('bg-gray-900');

    sections.forEach(sec => {
      sec.classList.add('bg-white');
      sec.classList.remove('bg-gray-800');
    });

    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');

    // Light mode welcome name color and shadow
    welcomeDiv.style.color = '#4b5563'; // Tailwind gray-600
    welcomeDiv.style.textShadow = '0 0 5px rgba(0,0,0,0.15)';
  }
}


window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('nameModal');
  const nameInput = document.getElementById('nameInput');
  const submitBtn = document.getElementById('submitName');
  const welcomeDiv = document.getElementById('welcomeName');

  // Check if name is in localStorage
  const savedName = localStorage.getItem('username');
  if (savedName) {
    modal.style.display = 'none';
    showWelcome(savedName);
  } else {
    modal.style.display = 'flex'; // show modal
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
    modal.style.display = 'none';
    showWelcome(name);
  });

  function showWelcome(name) {
    welcomeDiv.textContent = `Welcome ${name}`;
    welcomeDiv.classList.remove('hidden');
  }
});



const contractAddress = "0x8dAb63341E31f95D02A54cC2826945772073FBBa"; // your deployed address
const contractABI = [/* ABI here, same as before */];

let web3;
let contract;
let userAccount;

// Initialize on load
window.addEventListener("DOMContentLoaded", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed!");
    return;
  }

  web3 = new Web3(window.ethereum);

  try {
    // Request accounts or get the current selected one
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    userAccount = accounts[0];

    // Initialize contract
    contract = new web3.eth.Contract(contractABI, contractAddress);

    // Show user account somewhere, e.g. a div#account
    document.getElementById("account").textContent = userAccount;

    // Listen for PostCreated event to update UI live
    contract.events.PostCreated({ fromBlock: 'latest' })
      .on('data', (event) => {
        const post = event.returnValues;
        addPostToFeed(post);
      })
      .on('error', console.error);

  } catch (error) {
    console.error(error);
    alert("Failed to connect wallet");
  }
});

// Add a post element dynamically to the posts feed
function addPostToFeed(post) {
  const feed = document.getElementById("postsFeed");
  const postEl = document.createElement("div");
  postEl.className = "border rounded p-4 my-2 bg-white text-gray-900";
  postEl.innerHTML = `
    <p><strong>${post.author.slice(0,6)}...${post.author.slice(-4)}</strong> @ ${new Date(post.timestamp * 1000).toLocaleString()}</p>
    <p class="mt-2">${post.content}</p>
  `;
  feed.prepend(postEl); // add to top
}

// Handle new post creation
document.getElementById("createPost").addEventListener("click", async () => {
  const content = document.getElementById("postContent").value.trim();
  if (!content) return alert("Post cannot be empty.");

  try {
    document.getElementById("loading").classList.remove("hidden");
    await contract.methods.createPost(content).send({ from: userAccount });
    document.getElementById("postContent").value = ""; // clear input
    // No need to manually add post here, event listener will do it
  } catch (err) {
    console.error(err);
    alert("Failed to create post.");
  } finally {
    document.getElementById("loading").classList.add("hidden");
  }
});
