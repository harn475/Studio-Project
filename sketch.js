let catImages = [];
let player1 = null, player2 = null;
let selectingPlayer = 1;
let gameStarted = false;
let boosts = [];
let normalSpeed = 10;
let boostedSpeed = 25;
let boostDuration = 2000;
let catfood;
let pawprint;
let cattree1;
let cattree2;
let cattree3;
let cattree4;
let player1Pawprints = [];
let player2Pawprints = [];
let clickCount = 0;

let catTreeBounds = [];  // This will hold the boundaries of each tree.

function preload() {
  for (let i = 1; i <= 16; i++) {
    catImages.push(loadImage(`catdrawings/cat${i}.png`));
  }
  catfood = loadImage("catfood.png");
  pawprint = loadImage("pawprint.png");
  cattree1 = loadImage("cattree1.png");
  cattree2 = loadImage("cattree2.png");
  cattree3 = loadImage("cattree3.png");
  cattree4 = loadImage("cattree4.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  showMenu();
  setInterval(spawnBoost, 3000);

  // Adjusted boundaries based on new positions and sizes
  catTreeBounds.push({ x: width * 0.3, y: height * 0.6, w: 200, h: 200 });  // Updated for tree 1
  catTreeBounds.push({ x: width * 0.2, y: height * 0.25, w: 150, h: 150 });  // Updated for tree 2
  catTreeBounds.push({ x: width * 0.6, y: height * 0.4, w: 150, h: 150 });  // Updated for tree 3
}

function draw() {
  if (!gameStarted) return;

  background(207, 253, 188);

  image(cattree1, width * 0.3, height * 0.6, 200, 200);
  image(cattree2, width * 0.2, height * 0.25, 150, 150);
  image(cattree3, width * 0.6, height * 0.4, 150, 150);

  text("Collect the boosts!", 50, 50, 50);

  if (player1 && player2) {
    image(player1.img, player1.x, player1.y, 50, 50);
    image(player2.img, player2.x, player2.y, 50, 50);

    // Draw pawprints for player 1
    for (let i = 0; i < player1Pawprints.length; i++) {
      let p = player1Pawprints[i];
      let size = random(15, 25);
      let opacity = map(i, 0, player1Pawprints.length, 255, 50);
      push();
      translate(p.x, p.y);
      rotate(p.angle);
      tint(255, opacity);
      image(pawprint, -size / 2, -size / 2, size, size);
      pop();
    }

    // Draw pawprints for player 2
    for (let i = 0; i < player2Pawprints.length; i++) {
      let p = player2Pawprints[i];
      let size = random(15, 25);
      let opacity = map(i, 0, player2Pawprints.length, 255, 50);
      push();
      translate(p.x, p.y);
      rotate(p.angle);
      tint(255, opacity);
      image(pawprint, -size / 2, -size / 2, size, size);
      pop();
    }
  }

  fill(188, 156, 86);
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

  image(catfood, width * 0.80, height / 2 - 100, 200, 200);
}

function keyPressed() {
  if (!gameStarted) return;

  let speed1 = player1.boostActive ? boostedSpeed : normalSpeed;
  let speed2 = player2.boostActive ? boostedSpeed : normalSpeed;

  let move1 = { x: player1.x, y: player1.y };
  let move2 = { x: player2.x, y: player2.y };

  if (key === 'w') move1.y -= speed1;
  if (key === 's') move1.y += speed1;
  if (key === 'a') move1.x -= speed1;
  if (key === 'd') move1.x += speed1;

  if (keyCode === UP_ARROW) move2.y -= speed2;
  if (keyCode === DOWN_ARROW) move2.y += speed2;
  if (keyCode === LEFT_ARROW) move2.x -= speed2;
  if (keyCode === RIGHT_ARROW) move2.x += speed2;

  if (!checkTreeCollision(move1, player1)) player1 = { ...player1, x: move1.x, y: move1.y };
  if (!checkTreeCollision(move2, player2)) player2 = { ...player2, x: move2.x, y: move2.y };

  // Pawprint handling
  if (clickCount % 2 === 1) {
    if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
      player1Pawprints.push({
        x: player1.x + 25, 
        y: player1.y + 25 + 25, 
        angle: random(-PI / 4, PI / 4)
      });
    }

    if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      player2Pawprints.push({
        x: player2.x + 25, 
        y: player2.y + 25 + 25, 
        angle: random(-PI / 4, PI / 4)
      });
    }
  }

  clickCount++;
}

function checkTreeCollision(move, player) {
  for (let tree of catTreeBounds) {
    if (move.x + 50 > tree.x && move.x < tree.x + tree.w && move.y + 50 > tree.y && move.y < tree.y + tree.h) {
      return true; // There's a collision, prevent movement
    }
  }
  return false; // No collision, allow movement
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
  }, 6000);
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
