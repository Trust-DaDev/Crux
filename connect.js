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




