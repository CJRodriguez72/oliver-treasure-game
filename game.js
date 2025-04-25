
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let position = { x: 50, y: 50 };
let jetpackCollected = false;
let message = document.getElementById("message");

const treasure = { x: 250, y: 50, width: 30, height: 30 };
const jetpack = { x: 150, y: 100, width: 20, height: 20 };
const cliff = { x: 200, y: 0, width: 10, height: 200 };

function draw() {
  ctx.clearRect(0, 0, 400, 200);

  // Explorer
  ctx.fillStyle = "blue";
  ctx.fillRect(position.x, position.y, 20, 20);

  // Cliff
  ctx.fillStyle = "brown";
  ctx.fillRect(cliff.x, cliff.y, cliff.width, cliff.height);

  // Jetpack
  if (!jetpackCollected) {
    ctx.fillStyle = "gray";
    ctx.fillRect(jetpack.x, jetpack.y, jetpack.width, jetpack.height);
  }

  // Treasure
  ctx.fillStyle = "gold";
  ctx.fillRect(treasure.x, treasure.y, treasure.width, treasure.height);
}

function checkCollisions() {
  if (
    !jetpackCollected &&
    position.x < jetpack.x + jetpack.width &&
    position.x + 20 > jetpack.x &&
    position.y < jetpack.y + jetpack.height &&
    position.y + 20 > jetpack.y
  ) {
    jetpackCollected = true;
    message.textContent = "You got the Jetpack! Now cross the cliff!";
  }

  if (
    !jetpackCollected &&
    position.x + 20 > cliff.x &&
    position.x < cliff.x + cliff.width
  ) {
    position.x = cliff.x - 21;
    message.textContent = "You need the Jetpack to cross the cliff!";
  }

  if (
    position.x < treasure.x + treasure.width &&
    position.x + 20 > treasure.x &&
    position.y < treasure.y + treasure.height &&
    position.y + 20 > treasure.y
  ) {
    message.textContent = "You found the treasure! You're amazing, Oliver!";
  }
}

function updatePosition(e) {
  if (e.key === "ArrowRight") position.x += 10;
  if (e.key === "ArrowLeft") position.x -= 10;
  if (e.key === "ArrowUp") position.y -= 10;
  if (e.key === "ArrowDown") position.y += 10;
  checkCollisions();
  draw();
}

window.addEventListener("keydown", updatePosition);
draw();
