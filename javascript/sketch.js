const GAME_WIDTH = 800;
const GAME_HEIGHT = 800;


let playerHitSound;
let enemyDeathSound;
let shieldHitSound;
let shootEnemySound;
let gameOverSound;

let font;

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
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player(GAME_WIDTH / 2, GAME_HEIGHT / 2);
}

function draw() {
  background(220);

  player.update();
  player.display();
  player.handleInput();

  if (frameCount % ENEMY_INTERVAL === 0 && !gameOver) {
    enemies.push(new Enemy(player.x, player.y));
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update(player.x, player.y);
    enemies[i].display();
  }

  updateAndDisplayBullets();
  displayLife();
}

function displayLife() {
  fill(0);
  textSize(50);
  textFont('Courier New');
  if (player.life === 3) {
    text("❤️❤️❤️", 10, 60);
  } else if (player.life === 2) {
    text("❤️❤️", 10, 60);
  } else if (player.life === 1) {
    text("❤️", 10, 60);
  }
}

function displayGameOver() {
  fill(0);
  textFont(font);
  textSize(60);
  text("G a m e   O v e r", GAME_WIDTH / 2 - 225, GAME_HEIGHT / 2);
  textSize(30);
  text("Press R to restart", GAME_WIDTH / 2 - 125, GAME_HEIGHT / 2 + 50);

  player.x = GAME_HEIGHT / 2;
  player.y = GAME_WIDTH / 2 + 200;

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
  player.x = GAME_WIDTH / 2;
  player.y = GAME_HEIGHT / 2;
  player.life = 3;
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
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (bullets[j] && bullets[j].isPlayerBullet && enemies[i] && enemies[i].collideWithBullet(bullets[j])) {
        enemyDeathSound.play();
        enemies.splice(i, 1); 
        bullets.splice(j, 1);
        break;
      }
    }
  }
}
