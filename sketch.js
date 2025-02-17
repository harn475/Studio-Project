let catImages = [];
let player1 = null, player2 = null;
let selectingPlayer = 1;
let gameStarted = false;
let boosts = [];
let normalSpeed = 10;
let boostedSpeed = 25; // More noticeable jump
let boostDuration = 2000; 

function preload() {
  for (let i = 1; i <= 16; i++) {
    catImages.push(loadImage(`catdrawings/cat${i}.png`));
  }
}

function setup() {
  createCanvas(800, 400);
  showMenu();
  setInterval(spawnBoost, 3000);
}

function draw() {
  if (!gameStarted) return;

  background(220);

  if (player1 && player2) {
    image(player1.img, player1.x, player1.y, 50, 50);
    image(player2.img, player2.x, player2.y, 50, 50);
  }

  fill(255, 204, 0);
  for (let boost of boosts) {
    ellipse(boost.x, boost.y, 20, 20);
  }

  checkBoostCollision(player1);
  checkBoostCollision(player2);

  if (player1.x >= width - 50) {
    noLoop();
    alert("Player 1 Wins!");
  }
  if (player2.x >= width - 50) {
    noLoop();
    alert("Player 2 Wins!");
  }
}

function keyPressed() {
  if (!gameStarted) return;

  let speed1 = player1.boostActive ? boostedSpeed : normalSpeed;
  let speed2 = player2.boostActive ? boostedSpeed : normalSpeed;

  if (key === 'w') player1.y -= speed1;
  if (key === 's') player1.y += speed1;
  if (key === 'a') player1.x -= speed1;
  if (key === 'd') player1.x += speed1;

  if (keyCode === UP_ARROW) player2.y -= speed2;
  if (keyCode === DOWN_ARROW) player2.y += speed2;
  if (keyCode === LEFT_ARROW) player2.x -= speed2;
  if (keyCode === RIGHT_ARROW) player2.x += speed2;
}

function showMenu() {
  background(200);
  textAlign(CENTER);
  textSize(20);
  
  if (selectingPlayer === 1) {
    text("Player 1, choose your cat!", width / 2, 50);
  } else if (selectingPlayer === 2) {
    text("Player 2, choose your cat!", width / 2, 50);
  }

  for (let i = 0; i < 16; i++) {
    let x = (i % 4) * 100 + 150;
    let y = floor(i / 4) * 100 + 100;
    
    if (catImages[i]) {
      image(catImages[i], x, y, 80, 80);
    }
  }
}

function mousePressed() {
  if (gameStarted) return;
  
  for (let i = 0; i < 16; i++) {
    let x = (i % 4) * 100 + 150;
    let y = floor(i / 4) * 100 + 100;

    if (mouseX > x && mouseX < x + 80 && mouseY > y && mouseY < y + 80) {
      if (selectingPlayer === 1 && !player1) {
        player1 = { img: catImages[i], x: 50, y: height / 3, boostActive: false };
        selectingPlayer = 2;
        showMenu();
      } else if (selectingPlayer === 2 && !player2 && catImages[i] !== player1.img) {
        player2 = { img: catImages[i], x: 50, y: (2 * height) / 3, boostActive: false };
        startGame();
      }
    }
  }
}

function startGame() {
  gameStarted = true;
}

function spawnBoost() {
  if (!gameStarted) return;
  let newBoost = { x: random(100, width - 100), y: random(50, height - 50) };
  boosts.push(newBoost);

  setTimeout(() => {
    boosts = boosts.filter(b => b !== newBoost);
  }, 5000);
}

function checkBoostCollision(player) {
  if (!player) return;

  for (let i = boosts.length - 1; i >= 0; i--) {
    let boost = boosts[i];
    let d = dist(player.x, player.y, boost.x, boost.y);
    if (d < 25) { 
      activateBoost(player);
      boosts.splice(i, 1);
    }
  }
}

function activateBoost(player) {
  player.boostActive = true;
  setTimeout(() => {
    player.boostActive = false;
  }, boostDuration);
}
