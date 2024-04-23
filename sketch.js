const GAME_WIDTH = 800;
const GAME_HEIGHT = 800;
const ENEMY_INTERVAL = 250;
const ENEMY_SPEED = 2;
const ENEMY_SIZE = 50;
const MIN_DISTANCE_TO_PLAYER = 300;
const BULLET_SPEED = 7;
const SHIELD_WIDTH = 10;
const SHIELD_HEIGHT = 100;
const SHIELD_OFFSET = 35;

let player;
let enemies = [];
let bullets = [];

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
  text("G a m e   O v e r", GAME_WIDTH / 2 - 250, GAME_HEIGHT / 2);
  textSize(30);
  text("Press R to restart", GAME_WIDTH / 2 - 150, GAME_HEIGHT / 2 + 50);

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

class Player {r
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 3;
    this.width = 50;
    this.height = 50;
    this.speed = 3;
    this.lastShieldHitTime = 0;
  }

  handleInput() {
    if(gameOver) return;

    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= this.speed;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += this.speed;
    }
  }

  update() {
    if(this.life === 0) {
      gameOver = true;
      displayGameOver();
    }

    this.x = constrain(this.x, 0 + this.width / 2, GAME_WIDTH - this.width / 2);
    this.y = constrain(this.y, 0 + this.height / 2, GAME_HEIGHT - this.height / 2);
  }

  display() {
    let angle = atan2(mouseY - this.y, mouseX - this.x);
    
    push();
    translate(this.x, this.y);
    rotate(angle);
    this.shield();
    fill(255);
    rect(-this.width / 2, -this.height / 2, this.width, this.height);
    pop();
  }

  shield() {
    if (millis() - this.lastShieldHitTime < 500) {
      if (millis() % 100 < 50) {
        fill(0, 0, 255, 0);
      } else {
        fill(0, 0, 255, 100);
      }
    } else {
      fill(0, 0, 255, 100);
    }
    rect(SHIELD_OFFSET, -SHIELD_HEIGHT / 2, SHIELD_WIDTH, SHIELD_HEIGHT);
  }

  getShieldBounds() {
    let angle = atan2(mouseY - this.y, mouseX - this.x);
    let centerX = this.x + cos(angle) * SHIELD_OFFSET;
    let centerY = this.y + sin(angle) * SHIELD_OFFSET;
    return { x: centerX, y: centerY, width: SHIELD_WIDTH, height: SHIELD_HEIGHT, angle: angle };
  }

  collideWithBullet(bullet) {
    let distance = dist(this.x, this.y, bullet.x, bullet.y);
    return distance < this.width / 2;
  }
}

class Enemy {
  constructor(playerX, playerY) {
    this.x = random(GAME_WIDTH);
    this.y = random(GAME_HEIGHT);
    this.lastShotTime = millis();
    this.moveTowardsPlayer(playerX, playerY);
  }

  update(playerX, playerY) {
    const distanceToPlayer = dist(this.x, this.y, playerX, playerY);
    if (distanceToPlayer >= MIN_DISTANCE_TO_PLAYER) {
      this.moveTowardsPlayer(playerX, playerY);
    } else if (distanceToPlayer < MIN_DISTANCE_TO_PLAYER - 5){
      this.moveAwayFromPlayer(playerX, playerY);
    }

    if (millis() - this.lastShotTime > random(1000, 3000) && !gameOver) {
      this.shoot(playerX, playerY);
      this.lastShotTime = millis();
    }
  }

  moveTowardsPlayer(playerX, playerY) {
    let dx = playerX - this.x;
    let dy = playerY - this.y;
    let angle = atan2(dy, dx);
    this.x += cos(angle) * ENEMY_SPEED;
    this.y += sin(angle) * ENEMY_SPEED;
  }

  moveAwayFromPlayer(playerX, playerY) {
    let dx = this.x - playerX;
    let dy = this.y - playerY;
    let angle = atan2(dy, dx);
    this.x += cos(angle) * ENEMY_SPEED;
    this.y += sin(angle) * ENEMY_SPEED;
  }

  shoot(playerX, playerY) {
    let bullet = new Bullet(this.x, this.y, playerX, playerY);
    bullets.push(bullet);
    shootEnemySound.play();
  }

  display() {
    fill(255, 0, 0);
    rect(this.x - ENEMY_SIZE / 2, this.y - ENEMY_SIZE / 2, ENEMY_SIZE, ENEMY_SIZE);
  }

  collideWithBullet(bullet) {
    let distance = dist(this.x, this.y, bullet.x, bullet.y);
    return distance < ENEMY_SIZE / 2;
  }
}

class Bullet {
  constructor(x, y, playerX, playerY) {
    this.x = x;
    this.y = y;
    this.isPlayerBullet = false;
    let dx = playerX - this.x;
    let dy = playerY - this.y;
    this.angle = atan2(dy, dx);
    this.speed = BULLET_SPEED;
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
  }

  display() {
    fill(0, 0, 255);
    rect(this.x, this.y, 10, 10);
  }

  collideWithShield(bounds) {
    let xRel = this.x - bounds.x;
    let yRel = this.y - bounds.y;
    let xRot = xRel * cos(-bounds.angle) - yRel * sin(-bounds.angle);
    let yRot = xRel * sin(-bounds.angle) + yRel * cos(-bounds.angle);

    if (xRot >= -bounds.width / 2 && xRot <= bounds.width / 2 &&
        yRot >= -bounds.height / 2 && yRot <= bounds.height / 2) {
      return true;
    }
    return false;
  }

  reverse() {
    this.angle += PI;
  }
}
