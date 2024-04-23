const BULLET_SPEED = 7;

let bullets = [];

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