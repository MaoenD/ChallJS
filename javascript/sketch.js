let playerHitSound;
let enemyDeathSound;
let shieldHitSound;
let shootEnemySound;
let gameOverSound;

let gameStarted = false;

let font;

let score = 0;
let gameOver = false;
let gameOverSoundPlayed = false;
let muted = false;

function preload() {
  playerHitSound = loadSound('sound/playerHit.wav');
  enemyDeathSound = loadSound('sound/enemyDeath.wav');
  shieldHitSound = loadSound('sound/shieldHit.wav');
  shootEnemySound = loadSound('sound/shootEnemy.wav');
  gameOverSound = loadSound('sound/gameOver.wav');

  font = loadFont('font/font.otf');
}

let soundButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Player(windowWidth / 2, windowHeight / 2);
  soundButton = createButton('Sounds');
  soundButton.position(windowWidth - 95, 20);
  soundButton.style('background-color', 'green');
  soundButton.style('color', 'white');
  soundButton.style('border-radius', '5px');
  soundButton.style('font-size', '16px');
  soundButton.style('padding', '10px');
  soundButton.style('border', 'none');
  soundButton.mousePressed(mute);
}

function windowResized() {
  soundButton.position(windowWidth - 95, 20);
  resizeCanvas(windowWidth, windowHeight);
  player.x = windowWidth / 2;
  player.y = windowHeight / 2;
}

function draw() {
  background(220);

  player.update();
  player.display();
  player.handleInput();

  if (!gameOver && !gameStarted) {
    startGame();
  } else if (!gameOver) {
    if (frameCount % ENEMY_INTERVAL === 0) {
      let numberOfEnemies = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numberOfEnemies; i++) {
        enemies.push(new Enemy(player.x, player.y));
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].update(player.x, player.y);
      enemies[i].display();
    }

    updateAndDisplayBullets();
    displayScore()
    displayLife();
  } else {
    displayGameOver();
    
    if (keyIsDown(82)) {
      restartGame();
    }
  }
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
  text("Score: " + score, windowWidth / 2 - 120, windowHeight / 2 - 80);
  text("G a m e   O v e r", windowWidth / 2 - 225, windowHeight / 2);
  textSize(30);
  text("Press R to restart", windowWidth / 2 - 125, windowHeight / 2 + 50);

  player.x = windowHeight / 2;
  player.y = windowWidth / 2 + 200;

  bullets = [];
  enemies = [];

  if (!gameOverSoundPlayed) {
    if (!muted) {
      gameOverSound.play();
    }
    gameOverSoundPlayed = true;
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
      if (!muted) {
        shieldHitSound.play();
      }
      player.lastShieldHitTime = millis();
      continue;
    }
    if (player.collideWithBullet(bullets[i])) {
      player.life--;
      if (!muted) {
        playerHitSound.play();
      }
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
        if (!muted) {
          enemyDeathSound.play();
        }
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        break;
      }
    }
  }
}

function mute() {
  if (muted) {
    soundButton.style('background-color', 'green');
    muted = false
  } else {
    soundButton.style('background-color', 'red');
    muted = true
  }
}

function startGame() {
  if (keyIsDown(32)) {
    gameStarted = true;
  }
  fill(0);
  textFont(font);
  textSize(60);
  text("Press SPACE to start", windowWidth / 2 - 200, windowHeight / 2);
}