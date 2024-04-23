const GAME_WIDTH = 800;
const GAME_HEIGHT = 800;
const ENEMY_INTERVAL = 300;
const ENEMY_SPEED = 2;       
const ENEMY_SIZE = 50;
const MIN_DISTANCE_TO_PLAYER = 300;
const BULLET_SPEED = 5;

let player;
let enemies = [];
let bullets = []; 

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player(GAME_WIDTH / 2, GAME_HEIGHT / 2);
}

function draw() {
  background(220);
  player.display();
  player.handleInput();

  if (frameCount % ENEMY_INTERVAL === 0) {
    enemies.push(new Enemy(player.x, player.y));  
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update(player.x, player.y);
    enemies[i].display();
  }

  updateAndDisplayBullets();
}

function updateAndDisplayBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].update();
    bullets[i].display();
    
    if(player.collideWithBullet(bullets[i])) {
      bullets.splice(i, 1);
    }
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  handleInput() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
    }
    if (keyIsDown(UP_ARROW)) {
      this.y -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.y += 5;
    }
  }
  
  display() {
    fill(255);
    rect(this.x - 25, this.y - 25, 50, 50);
  }

  collideWithBullet(bullet) {
    return this.x < bullet.x + 30 && this.x + 30 > bullet.x && this.y < bullet.y + 30 && this.y + 30 > bullet.y;
  }
}

class Enemy {
  constructor(playerX, playerY) {
    this.x = random(GAME_WIDTH);
    this.y = random(GAME_HEIGHT);
    this.moveTowardsPlayer(playerX, playerY);
    this.lastShotTime = millis();
  }

  update(playerX, playerY) {
    const distanceToPlayer = dist(this.x, this.y, playerX, playerY);
    if (distanceToPlayer >= MIN_DISTANCE_TO_PLAYER) {
      this.moveTowardsPlayer(playerX, playerY);
    } else if (distanceToPlayer < MIN_DISTANCE_TO_PLAYER - 5){
      this.moveAwayFromPlayer(playerX, playerY);
    }

    if (millis() - this.lastShotTime > random(1000, 3000)) {
      this.shoot(playerX, playerY);
      this.lastShotTime = millis();
      console.log("Enemy shot");
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
  }

  display() {
    fill(255, 0, 0);
    rect(this.x - ENEMY_SIZE / 2, this.y - ENEMY_SIZE / 2, ENEMY_SIZE, ENEMY_SIZE);
  }
}

class Bullet {
  constructor(x, y, playerX, playerY) {
    this.x = x;
    this.y = y;
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
}