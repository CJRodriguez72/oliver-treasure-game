
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 32;
const map = [
  "........................",
  "........................",
  "........................",
  ".......k...............T",
  ".....................####",
  "...k.................####",
  "########....####....#####",
  "#######L#######L#########"
];

const images = {};
const keys = [];
let player = { x: 32, y: 32, vx: 0, vy: 0, grounded: false };
let collectedKeys = 0;

function loadImages() {
  const assets = {
    grass: "#228B22",
    dirt: "#8B4513",
    lava: "#FF4500",
    key: "yellow",
    treasure: "gold",
    player: "#00f"
  };
  for (let name in assets) {
    images[name] = assets[name]; // Using colors instead of actual images
  }
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawMap() {
  keys.length = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let char = map[y][x];
      if (char === "#") drawTile(x, y, images.grass);
      if (char === "L") drawTile(x, y, images.lava);
      if (char === "k") {
        drawTile(x, y, images.key);
        keys.push({ x: x * tileSize, y: y * tileSize });
      }
      if (char === "T") drawTile(x, y, images.treasure);
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = images.player;
  ctx.fillRect(player.x, player.y, tileSize, tileSize);
}

function update() {
  player.vy += 1.5; // gravity
  player.x += player.vx;
  player.y += player.vy;

  if (player.y > canvas.height) {
    player.x = 32; player.y = 32; collectedKeys = 0;
    alert("You fell in lava! Try again!");
  }

  player.grounded = false;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let tile = map[y][x];
      if (tile === "#" || tile === "L") {
        let tx = x * tileSize, ty = y * tileSize;
        if (player.x < tx + tileSize && player.x + tileSize > tx &&
            player.y < ty + tileSize && player.y + tileSize > ty) {
          if (tile === "L") {
            player.x = 32; player.y = 32; collectedKeys = 0;
            alert("You touched lava! Be careful!");
            return;
          }
          if (player.vy > 0) {
            player.y = ty - tileSize;
            player.vy = 0;
            player.grounded = true;
          }
        }
      }
    }
  }

  keys.forEach((k, i) => {
    if (player.x < k.x + tileSize && player.x + tileSize > k.x &&
        player.y < k.y + tileSize && player.y + tileSize > k.y) {
      keys.splice(i, 1);
      collectedKeys += 1;
      if (collectedKeys === 3) alert("You collected all keys! Go to the treasure!");
    }
  });
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  drawPlayer();
  update();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.vx = -5;
  if (e.key === "ArrowRight") player.vx = 5;
  if (e.key === " " && player.grounded) player.vy = -18;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.vx = 0;
});

loadImages();
loop();
