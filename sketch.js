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
let player1Pawprints = [];
let player2Pawprints = [];
let clickCount = 0;

function preload() {
  for (let i = 1; i <= 16; i++) {
    catImages.push(loadImage(`catdrawings/cat${i}.png`));
  }
  catfood = loadImage("catfood.png");
  pawprint = loadImage("pawprint.png");
}

function setup() {
  createCanvas(800, 400);
  showMenu();
  setInterval(spawnBoost, 3000);
}

function draw() {
  
  if (!gameStarted) return;

  background(207, 253, 188);

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

  image(catfood, width - 160, height / 2 - 125, 200, 200);
}

function keyPressed() {
  if (!gameStarted) return;

  let speed1 = player1.boostActive ? boostedSpeed : normalSpeed;
  let speed2 = player2.boostActive ? boostedSpeed : normalSpeed;

  if (key === 'w') {
    player1.y -= speed1;
    if (clickCount % 2 === 1) { 
      // Pawprint behind player
      player1Pawprints.push({
        x: player1.x + 25, // Center of the player
        y: player1.y + 25 + 25, // Offset behind player
        angle: random(-PI / 4, PI / 4)
      });
    }
  }
  if (key === 's') {
    player1.y += speed1;
    if (clickCount % 2 === 1) { 
      player1Pawprints.push({
        x: player1.x + 25, // Center of the player
        y: player1.y + 25 - 25, // Offset behind player
        angle: random(-PI / 4, PI / 4)
      });
    }
  }
  if (key === 'a') {
    player1.x -= speed1;
    if (clickCount % 2 === 1) { 
      player1Pawprints.push({
        x: player1.x + 25 + 25, // Offset behind player
        y: player1.y + 25, // Center of the player
        angle: random(-PI / 4, PI / 4)
      });
    }
  }
  if (key === 'd') {
    player1.x += speed1;
    if (clickCount % 2 === 1) { 
      player1Pawprints.push({
        x: player1.x + 25 - 25, // Offset behind player
        y: player1.y + 25, // Center of the player
        angle: random(-PI / 4, PI / 4)
      });
    }
  }

  if (keyCode === UP_ARROW) {
    player2.y -= speed2;
    if (clickCount % 2 === 1) { 
      player2Pawprints.push({
        x: player2.x + 25,
        y: player2.y + 25 + 25,
        angle: random(-PI / 4, PI / 4)
      });
    }
  }
  if (keyCode === DOWN_ARROW) {
    player2.y += speed2;
    if (clickCount % 2 === 1) { 
      player2Pawprints.push({
        x: player2.x + 25,
        y: player2.y + 25 - 25,
        angle: random(-PI / 4, PI / 4)
      });
    }
  }
  if (keyCode === LEFT_ARROW) {
    player2.x -= speed2;
    if (clickCount % 2 === 1) { 
      player2Pawprints.push({
        x: player2.x + 25 + 25,
        y: player2.y + 25,
        angle: random(-PI / 4, PI / 4)
      });
    }
  }
  if (keyCode === RIGHT_ARROW) {
    player2.x += speed2;
    if (clickCount % 2 === 1) { 
      player2Pawprints.push({
        x: player2.x + 25 - 25,
        y: player2.y + 25,
        angle: random(-PI / 4, PI / 4)
      });
    }
  }

  clickCount++; // Increase the click counter with each key press
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
