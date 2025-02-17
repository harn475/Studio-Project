let catImages = [];
let player1, player2;
let selectedCats = [null, null];
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
  text("Choose your cat!", width / 2, 50);
  
  for (let i = 0; i < 16; i++) {
    let x = (i % 4) * 100 + 150;
    let y = floor(i / 4) * 100 + 100;
    if (catImages[i]) {
      image(catImages[i], x, y, 80, 80);
    }
  }
}

function mousePressed() {
  if (gameStarted || (selectedCats[0] && selectedCats[1])) return;
  
  for (let i = 0; i < 16; i++) {
    let x = (i % 4) * 100 + 150;
    let y = floor(i / 4) * 100 + 100;
    
    if (mouseX > x && mouseX < x + 80 && mouseY > y && mouseY < y + 80) {
      if (!selectedCats[0]) {
        selectedCats[0] = catImages[i];
      } else if (!selectedCats[1]) {
        selectedCats[1] = catImages[i];
        startGame();
      }
    }
  }
}

function startGame() {
  player1 = { img: selectedCats[0], x: 50, y: height / 3 };
  player2 = { img: selectedCats[1], x: 50, y: (2 * height) / 3 };
  gameStarted = true; // Fixed typo
}
