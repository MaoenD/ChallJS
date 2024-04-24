const SHIELD_WIDTH = 10; // Width of the shield
const SHIELD_HEIGHT = 100; // Height of the shield
const SHIELD_OFFSET = 35; // Offset of the shield from the player

let player;

class Player { // Class that represents the player
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

  
    handleInput() { //Function that handles the player's input
      if (gameOver) return;
  
      this.ax = 0;
      this.ay = 0;
      let finalSpeed = this.speed

      if (this.canDash() && keyIsDown(SHIFT)) { // Check if the player can dash and if the shift key is pressed
        finalSpeed += 100
        dashPlayerSound.play();
        this.lastDashTime = millis() / 1000;
      }
  
      if (keyIsDown(LEFT_ARROW) || keyIsDown(81) || keyIsDown(74)) { // Check if the left arrow key, 'Q' key, or 'J' key is pressed
          this.ax = -finalSpeed;
      }
      if (keyIsDown(RIGHT_ARROW) || keyIsDown(68) || keyIsDown(76)) { // Check if the right arrow key, 'D' key, or 'L' key is pressed
          this.ax = finalSpeed;
      }
      if (keyIsDown(UP_ARROW) || keyIsDown(90) || keyIsDown(73)) { // Check if the up arrow key, 'Z' key, or 'I' key is pressed
          this.ay = -finalSpeed;
      }
      if (keyIsDown(DOWN_ARROW) || keyIsDown(83) || keyIsDown(75)) { // Check if the down arrow key, 'S' key, or 'K' key is pressed
          this.ay = finalSpeed;
      }
  
      this.x += this.ax; // Move the player based on the input
      this.y += this.ay; // Move the player based on the input
    }

    update() { // Update player position and check if it is out of bounds
      fill(210);
      rect(150, 150, GAME_WIDTH - 300, GAME_WIDTH - 300);
  
      if(this.life === 0) {
        gameOver = true;
        displayGameOver();
      }
  
      this.x = constrain(this.x, this.width / 2 + 150, GAME_WIDTH - this.width / 2 - 150); // Constrain the player's x position to the game's width
      this.y = constrain(this.y, this.height / 2 + 150, GAME_HEIGHT - this.height / 2 - 150);
    }
  
    display() {  // Display the player on the screen
      let angle = atan2(mouseY - this.y, mouseX - this.x);
      
      push();
      translate(this.x, this.y);
      rotate(angle);
      this.shield();
      fill(255);
      rect(-this.width / 2, -this.height / 2, this.width, this.height);
      pop();
    }
  
    shield() { // Display the player's shield on the screen and blink it if it was hit recently
      if (millis() - this.lastShieldHitTime < 500) { // Check if the shield was hit in the last 500 milliseconds
        if (millis() % 100 < 50) { 
          fill(0, 0, 255, 0); // blink shield
        } else {
          fill(0, 0, 255, 100); // base color (RGB alpha)
        }
      } else {
        fill(0, 0, 255, 100); // base color
      }
      rect(SHIELD_OFFSET, -SHIELD_HEIGHT / 2, SHIELD_WIDTH, SHIELD_HEIGHT);
    }
  
    getShieldBounds() { // Get the player's shield bounds for collision detection
      let angle = atan2(mouseY - this.y, mouseX - this.x);
      let centerX = this.x + cos(angle) * SHIELD_OFFSET;
      let centerY = this.y + sin(angle) * SHIELD_OFFSET;
      return { x: centerX, y: centerY, width: SHIELD_WIDTH, height: SHIELD_HEIGHT, angle: angle };
    }
  
    collideWithBullet(bullet) { // Check if the player collides with a bullet
      let distance = dist(this.x, this.y, bullet.x, bullet.y);
      return distance < this.width / 2;
    }

    canDash() { // Check if player can dash
      let currentTime = millis() / 1000;
      let timeSinceLastDash = currentTime - this.lastDashTime;
      return timeSinceLastDash >= 4;
    }
  }