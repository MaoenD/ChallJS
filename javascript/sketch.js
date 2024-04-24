let playerHitSound;
let enemyDeathSound;
let shieldHitSound;
let shootEnemySound;
let gameOverSound;

let font;

let score = 0;
let gameOver = false;
let gameOverSoundPlayed = false;

function preload() {
  playerHitSound = loadSound('sound/playerHit.wav');
  enemyDeathSound = loadSound('sound/enemyDeath.wav');
  shieldHitSound = loadSound('sound/shieldHit.wav');
  shootEnemySound = loadSound('sound/shootEnemy.wav');
  gameOverSound = loadSound('sound/gameOver.wav');

  font = loadFont('font/font.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(windowWidth / 2, windowHeight / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  player.x = windowWidth / 2;
  player.y = windowHeight / 2;
}

function draw() {
  background(220);

  player.update();
  player.display();
  player.handleInput();

  if (frameCount % ENEMY_INTERVAL === 0 && !gameOver) {
    let numberOfEnemies = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numberOfEnemies; i++) {
      enemies.push(new Enemy(player.x, player.y));
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update(player.x, player.y);
    enemies[i].display();
  }

  updateAndDisplayBullets();
  displayScore()
  displayLife();
}

function displayScore() {
  fill(0);
  textSize(40);
  text("Score: " + score, 10, 35);
}

function displayLife() {
  fill(0);
  textSize(50);
  textFont('Courier New');
  if (player.life === 3) {
    text("❤️❤️❤️", 10, 85);
  } else if (player.life === 2) {
    text("❤️❤️", 10, 85);
  } else if (player.life === 1) {
    text("❤️", 10, 85);
  }
}

function displayGameOver() {
  fill(0);
  textFont(font);
  textSize(60);
  text("G a m e   O v e r", windowWidth / 2 - 225, windowHeight / 2);
  textSize(30);
  text("Press R to restart", windowWidth / 2 - 125, windowHeight / 2 + 50);

  player.x = windowHeight / 2;
  player.y = windowWidth / 2 + 200;

  bullets = [];
  enemies = [];

  if (!gameOverSoundPlayed) {
    gameOverSound.play();
    gameOverSoundPlayed = true;
  }

  if (keyIsDown(82)) {
    restartGame();
    console.log("Restarting game");
  }
}

function restartGame() {
  player.x = windowWidth / 2;
  player.y = windowHeight / 2;
  player.life = 3;
  score = 0;
  gameOver = false;
  gameOverSoundPlayed = false;
}

function updateAndDisplayBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();

    if (bullets[i].collideWithShield(player.getShieldBounds())) {
      bullets[i].reverse();
      bullets[i].isPlayerBullet = true;
      shieldHitSound.play();
      player.lastShieldHitTime = millis();
      continue;
    }
    if (player.collideWithBullet(bullets[i])) {
      player.life--;
      playerHitSound.play();
      bullets.splice(i, 1);
      continue; 
    }

    if (bullets[i].x < 0 || bullets[i].x > windowWidth || bullets[i].y < 0 || bullets[i].y > windowHeight) {
      bullets.splice(i, 1);
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (bullets[j] && bullets[j].isPlayerBullet && enemies[i] && enemies[i].collideWithBullet(bullets[j])) {
        enemyDeathSound.play();
        enemies.splice(i, 1); 
        bullets.splice(j, 1);
        score++;
        break;
      }
    }
  }
}
