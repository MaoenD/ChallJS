const SHIELD_WIDTH = 10;
const SHIELD_HEIGHT = 100;
const SHIELD_OFFSET = 35;

let player;


class Player {r
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.life = 3;
      this.width = 50;
      this.height = 50;
      this.speed = 3;
      this.lastShieldHitTime = 0;
      this.lastDashTime = 0;
    }

    handleInput() {
      if (gameOver) return;
  
      this.ax = 0;
      this.ay = 0;
      let finalSpeed = this.speed

      if (this.canDash() && keyIsDown(SHIFT)) {
        finalSpeed += 100
        this.lastDashTime = millis() / 1000;
      }
  
      if (keyIsDown(LEFT_ARROW) || keyIsDown(81) || keyIsDown(74)) {
          this.ax = -finalSpeed;
      }
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) || keyIsDown(76)) {
          this.ax = finalSpeed;
      }
      if (keyIsDown(UP_ARROW) || keyIsDown(90) || keyIsDown(73) || keyIsDown(73)) {
          this.ay = -finalSpeed;
      }
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83) || keyIsDown(75)) {
          this.ay = finalSpeed;
      }
  
      this.x += this.ax;
      this.y += this.ay;
  }
  
  
    update() {
      fill(210);
      rect(150, 150, windowWidth - 300, windowHeight - 300);
  
      if(this.life === 0) {
        gameOver = true;
        displayGameOver();
      }
  
      this.x = constrain(this.x, this.width / 2 + 150, windowWidth - this.width / 2 - 150);
      this.y = constrain(this.y, this.height / 2 + 150, windowHeight - this.height / 2 - 150);
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

    canDash() {
      let currentTime = millis() / 1000;
      let timeSinceLastDash = currentTime - this.lastDashTime;
      return timeSinceLastDash >= 4;
    }
  }