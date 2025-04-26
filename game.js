// Pixel-Art Treasure Hunt Explorer for Oliver
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

const assets = {};
const assetNames = ["grass", "dirt", "lava", "player", "key", "chest"];
let assetsLoaded = 0;
const keys = [];
let player = { x: 32, y: 32, vx: 0, vy: 0, grounded: false };
let collectedKeys = 0;

function loadAssets(callback) {
  assetNames.forEach(name => {
    const img = new Image();
    img.src = `assets/${name}.png`;
    img.onload = () => {
      assetsLoaded++;
      if (assetsLoaded === assetNames.length) callback();
    };
    assets[name] = img;
  });
}

function drawMap() {
  keys.length = 0;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      let char = map[y][x];
      if (char === "#") ctx.drawImage(assets.grass, x * tileSize, y * tileSize, tileSize, tileSize);
      if (char === "L") ctx.drawImage(assets.lava, x * tileSize, y * tileSize, tileSize, tileSize);
      if (char === "k") {
        ctx.drawImage(assets.key, x * tileSize, y * tileSize, tileSize, tileSize);
        keys.push({ x: x * tileSize, y: y * tileSize });
      }
      if (char === "T") ctx.drawImage(assets.chest, x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function drawPlayer() {
  ctx.drawImage(assets.player, player.x, player.y, tileSize, tileSize);
}

function update() {
  player.vy += 1.5;
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
      collectedKeys++;
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

loadAssets(loop);
