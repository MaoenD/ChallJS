const ENEMY_INTERVAL = 250; // Interval between enemy spawns in frames
const ENEMY_SPEED = 2; // Speed of the enemies
const ENEMY_SIZE = 50; // Size of the enemies
const MIN_DISTANCE_TO_PLAYER = 250; // Minimum distance between the enemy and the player

let enemies = [];

class Enemy {
    constructor(playerX, playerY) {
      this.x = random(GAME_WIDTH);
      this.y = random(GAME_HEIGHT);
      this.lastShotTime = millis();
      this.moveTowardsPlayer(playerX, playerY);
    }
  
    update(playerX, playerY) {
      const distanceToPlayer = dist(this.x, this.y, playerX, playerY); // Calculate the distance between the enemy and the player
      if (distanceToPlayer >= MIN_DISTANCE_TO_PLAYER) {
        this.moveTowardsPlayer(playerX, playerY);
      } else if (distanceToPlayer < MIN_DISTANCE_TO_PLAYER - 5){
        this.moveAwayFromPlayer(playerX, playerY);
      }
  
      if (millis() - this.lastShotTime > random(1000, 3000) && !gameOver) { // Check if enough time has passed since the last shot
        this.shoot(playerX, playerY); // Shoot at the actual coordinate player
        this.lastShotTime = millis(); 
      }
    }

    constrain() {
      this.x = constrain(this.x, 0, GAME_WIDTH); // Constrain the enemy's x position to the game's width
      this.y = constrain(this.y, 0, GAME_HEIGHT); // Constrain the enemy's y position to the game's height
    }
  
    moveTowardsPlayer(playerX, playerY) {
      let dx = playerX - this.x; // Calculate the horizontal distance between the enemy and the player
      let dy = playerY - this.y;
      let angle = atan2(dy, dx);
      this.x += cos(angle) * ENEMY_SPEED; // Move the enemy towards the player horizontally
      this.y += sin(angle) * ENEMY_SPEED;
    }
  
    moveAwayFromPlayer(playerX, playerY) { // same as moveTowardsPlayer but inverse
      let dx = this.x - playerX;
      let dy = this.y - playerY;
      let angle = atan2(dy, dx);
      this.x += cos(angle) * ENEMY_SPEED;
      this.y += sin(angle) * ENEMY_SPEED;
    }
  
    shoot(playerX, playerY) {
      let bullet = new Bullet(this.x, this.y, playerX, playerY); // Create a new bullet at the enemy's position
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