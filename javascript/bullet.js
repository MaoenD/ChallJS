const BULLET_SPEED = 7; // Speed of the bullets

let bullets = [];

// Class for bullets fired by the player
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
  
    // Update the bullet's position
    update() {
      this.x += cos(this.angle) * this.speed;
      this.y += sin(this.angle) * this.speed;
    }
  
    // Display the bullet on the screen
    display() {
      fill(0, 0, 255);
      rect(this.x, this.y, 10, 10);
    }
  
    collideWithShield(bounds) { // Check if the bullet collides with the shield
      let xRel = this.x - bounds.x; // Calculate the relative position of the bullet to the shield horizontally
      let yRel = this.y - bounds.y;
      let xRot = xRel * cos(-bounds.angle) - yRel * sin(-bounds.angle); // Rotate the relative position of the bullet to the shield
      let yRot = xRel * sin(-bounds.angle) + yRel * cos(-bounds.angle);
  
      if (xRot >= -bounds.width / 2 && xRot <= bounds.width / 2 &&
          yRot >= -bounds.height / 2 && yRot <= bounds.height / 2) { // Check if the rotated position of the bullet is within the shield's bounds
        return true;
      }
      return false;
    }
  
    // Reverse the bullet's direction
    reverse() {
      this.angle += PI;
    }
  }