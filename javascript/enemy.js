const ENEMY_INTERVAL = 250;
const ENEMY_SPEED = 2;
const ENEMY_SIZE = 50;
const MIN_DISTANCE_TO_PLAYER = 300;

let enemies = [];


class Enemy {
    constructor(playerX, playerY) {
      this.x = random(windowWidth);
      this.y = random(windowHeight);
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
      if (!muted) {
          shootEnemySound.play();
      }
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