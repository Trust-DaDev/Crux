import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@6.8.1/+esm";

// Initialize the coin sound effect
const coinSound = new Audio('./coin.mp3'); // Make sure this path is correct

function onWalletConnected(account) {
  const popup = document.getElementById("popup");
  const continueBtn = document.getElementById("continueBtn");
  const addressDisplay = document.getElementById("walletAddress");

  // Show connected account in popup
  addressDisplay.textContent = `Connected wallet: ${account}`;

  // Show the popup
  popup.classList.remove("hidden");
  continueBtn.focus();

  // ✅ Store connection state
  localStorage.setItem("walletConnected", "true");
  localStorage.setItem("userWallet", account);

  // Play retro coin sound
  coinSound.play().catch((e) => {
    console.warn("Sound playback failed:", e);
  });

  // Continue button click handler
  continueBtn.addEventListener("click", () => {
  const name = document.getElementById("nameInput")?.value?.trim();
  if (name) {
    localStorage.setItem("username", name);
  }
  window.location.href = "./home.html";
});


  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !popup.classList.contains("hidden")) {
      window.location.href = "./home.html";
    }
  });
}

window.onload = () => {
      const btn = document.getElementById("connectBtn");

      btn.onclick = async () => {
        const nameInput = document.getElementById("nameInput");
        const name = nameInput?.value?.trim();

        if (!name) {
          const namePopup = document.getElementById("namePopup");
          namePopup.classList.remove("hidden");

          document.body.classList.add("vibrate");
          setTimeout(() => document.body.classList.remove("vibrate"), 300);

          vibrateSound.play().catch(() => {});
          return;
        }

        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          if (!accounts || accounts.length === 0) return alert("No account found!");

          const account = accounts[0];
          btn.innerText = "☑ " + account.slice(0, 6) + "..." + account.slice(-4);

          localStorage.setItem("username", name);
          onWalletConnected(account);
        } catch (error) {
          console.error("Connection failed", error);
          alert("Connection failed!");
        }
      };
}
document.getElementById("closeNamePopup").onclick = () => {
  document.getElementById("namePopup").classList.add("hidden");
};

     const cursor = document.getElementById("cursor");
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animate() {
  currentX += (mouseX - currentX) * 0.15;
  currentY += (mouseY - currentY) * 0.15;
  cursor.style.left = currentX + "px";
  cursor.style.top = currentY + "px";
  requestAnimationFrame(animate);
}

animate();
