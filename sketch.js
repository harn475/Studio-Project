let catImages = [];
let player1 = null, player2 = null;
let selectingPlayer = 1; // 1 for Player 1, 2 for Player 2
let gameStarted = false;

function preload() {
  for (let i = 1; i <= 16; i++) {
    catImages.push(loadImage(`catdrawings/cat${i}.png`));
  }
}

function setup() {
  createCanvas(800, 400);
  showMenu();
}

function draw() {
  if (!gameStarted) return;

  background(220);

  if (player1 && player2) {
    image(player1.img, player1.x, player1.y, 50, 50);
    image(player2.img, player2.x, player2.y, 50, 50);
  }

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

  if (key === 'w') player1.y -= 10;
  if (key === 's') player1.y += 10;
  if (key === 'a') player1.x -= 10;
  if (key === 'd') player1.x += 10;

  if (keyCode === UP_ARROW) player2.y -= 10;
  if (keyCode === DOWN_ARROW) player2.y += 10;
  if (keyCode === LEFT_ARROW) player2.x -= 10;
  if (keyCode === RIGHT_ARROW) player2.x += 10;
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
        player1 = { img: catImages[i], x: 50, y: height / 3 };
        selectingPlayer = 2; // Switch to Player 2 selection
        showMenu(); // Update prompt
      } else if (selectingPlayer === 2 && !player2 && catImages[i] !== player1.img) {
        player2 = { img: catImages[i], x: 50, y: (2 * height) / 3 };
        startGame();
      }
    }
  }
}

function startGame() {
  gameStarted = true;
}
