const GAME_HEIGHT = 800; // Game height
const GAME_WIDTH = 800; // Game width

let playerHitSound;
let enemyDeathSound;
let shieldHitSound;
let shootEnemySound;
let dashPlayerSound;
let gameOverSound;

let gameStarted = false;

let font;

let score = 0;
let bestscore = 0;
let gameOver = false;
let gameOverSoundPlayed = false;
let muted = false;
let soundButton;


function preload() { // Load the game sounds and font
  playerHitSound = loadSound('sound/playerHit.wav');
  enemyDeathSound = loadSound('sound/enemyDeath.wav');
  shieldHitSound = loadSound('sound/shieldHit.wav');
  shootEnemySound = loadSound('sound/shootEnemy.wav');
  dashPlayerSound = loadSound('sound/dashPlayer.wav');
  gameOverSound = loadSound('sound/gameOver.wav');

  font = loadFont('font/font.otf');
}

function setup() { // Setup (only 1 time) the game canvas and create the player object
  createCanvas(GAME_HEIGHT, GAME_WIDTH);
  player = new Player(GAME_HEIGHT / 2, GAME_WIDTH / 2);
  soundButton = createButton('Sounds');
  soundButton.position(GAME_WIDTH - 95, 730);
  soundButton.style('background-color', 'green');
  soundButton.style('color', 'white');
  soundButton.style('border-radius', '5px');
  soundButton.style('font-size', '16px');
  soundButton.style('padding', '10px');
  soundButton.style('border', 'none');
  soundButton.mousePressed(mute);
}

function draw() { // Update and display the game objects
  background(220);

  player.update();
  player.display();
  player.handleInput();

  if (!gameOver && !gameStarted) {
    startGame();
  } else if (!gameOver) {
    if (frameCount % ENEMY_INTERVAL === 0) { // Create a new enemy every ENEMY_INTERVAL frames
      let numberOfEnemies = Math.floor(Math.random() * 3) + 1; // Random number of enemies between 1 and 3
      for (let i = 0; i < numberOfEnemies; i++) { // Create the enemies
        enemies.push(new Enemy(player.x, player.y));
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) { // Update and display the enemies
      enemies[i].update(player.x, player.y);
      enemies[i].display();
      enemies[i].constrain(); // Constrain the enemies to the game's bounds
    }

    updateAndDisplayBullets(); // Update and display the bullets
    displayScore()
    displayLife();
  } else {
    displayGameOver();
    if (keyIsDown(82)) { // Press R to restart the game
      restartGame();
    }
  }
}

function startGame() { // Display the start screen
  if (keyIsDown(32)) {
    gameStarted = true; // Start the game when the space key is pressed
  }
  fill(0);
  textFont(font);
  textSize(40);
  text("Press SPACE to start", GAME_WIDTH / 2 - 215 , GAME_HEIGHT / 2 - 150);
}

function restartGame() { // Restart the game
  player.x = GAME_WIDTH / 2;
  player.y = GAME_HEIGHT / 2;
  player.life = 3;
  score = 0;
  gameOver = false;
  gameOverSoundPlayed = false;
}

function displayScore() { // Display the score on the screen
  fill(0);
  textSize(40);
  textAlign(LEFT, CENTER) 
  text("Score:" + score + "/" + bestscore, 10, 100);
}

function displayLife() { // Display the player's life on the screen
  fill(0);
  textSize(50);
  textFont('Courier New');
  if (player.life === 3) {
    text("❤️❤️❤️", 10, 50);
  } else if (player.life === 2) {
    text("❤️❤️", 10, 50);
  } else if (player.life === 1) {
    text("❤️", 10, 50);
  }
}

function displayGameOver() { // Display the game over screen
  fill(0);
  textFont(font);
  textSize(40);
  textAlign(CENTER, CENTER)
  text("Score: " + score, GAME_HEIGHT / 2 , GAME_HEIGHT / 2 - 150);
  textSize(60)
  fill(255, 0, 0)
  text("Game  Over", GAME_HEIGHT / 2 , GAME_HEIGHT / 2);
  fill(0);
  textSize(30);
  text("Press R to restart", GAME_HEIGHT / 2, GAME_WIDTH / 2 + 75);

  player.x = GAME_HEIGHT / 2;
  player.y = GAME_WIDTH / 2 + 200;

  bullets = []; // Clear the bullets and enemies arrays
  enemies = [];

  if (!gameOverSoundPlayed) {
    if (!muted) {
      gameOverSound.play();
    }
    gameOverSoundPlayed = true;
  }
}

function updateAndDisplayBullets() { // Update and display the bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].display();

    if (!bullets[i].isPlayerBullet && bullets[i].collideWithShield(player.getShieldBounds())) { // Check if the bullet collides with the shield
      bullets[i].reverse(); // Reverse the bullet's direction if hit the shield
      bullets[i].isPlayerBullet = true; // Change the bullet's type to player bullet
      if (!muted) { // Play the shield hit sound
        shieldHitSound.play();
      }
      player.lastShieldHitTime = millis(); // Set the last shield hit time to the current time
      continue;
    }

    if (!bullets[i].isPlayerBullet && player.collideWithBullet(bullets[i])) { // Check if the bullet collides with the player
      player.life--; // Decrease the player's life
      if (!muted) {
        playerHitSound.play();
      }
      bullets.splice(i, 1); // Remove the bullet from the array
      continue;
    }

    if (bullets[i].x < 0 || bullets[i].x > GAME_WIDTH || bullets[i].y < 0 || bullets[i].y > GAME_HEIGHT) { // Check if the bullet is out of bounds
      bullets.splice(i, 1);
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) { // Look all enemies of the list
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (bullets[j].isPlayerBullet && enemies[i].collideWithBullet(bullets[j])) { // Check if the enemy collides with the player's bullet
        if (!muted) {
          enemyDeathSound.play();
        }
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;

        if (score > bestscore) { // Update the best score if score is greater than the best score
          bestscore = score;
        }
  
        break;
      }
    }
  }
}

function mute() { // Mute or unmute the game sounds
  if (muted) {
    soundButton.style('background-color', 'green');
    muted = false
  } else {
    soundButton.style('background-color', 'red');
    muted = true
  }
}