const GAME_WIDTH = 1000;
const GAME_HEIGHT = 800;
const ENEMY_INTERVAL = 240;  // 4 secondes à 60 FPS

let player;
let enemy = [];

function setup() {
  createCanvas(GAME_WIDTH, GAME_HEIGHT);
  player = new Player();
}

function draw() {
  background(220);
  player.display();
  player.handleInput();

  // Génère un ennemi toutes les 4 secondes en utilisant frameCount
  if (frameCount % ENEMY_INTERVAL === 0) {
    enemy.push(new Enemy());
  }

  for (let i = 0; i < enemy.length; i++) {
    enemy[i].display();
  }

  console.log("Frame count is: " + frameCount);
}

class Player {
  constructor() {
    this.x = GAME_WIDTH / 2;
    this.y = GAME_HEIGHT / 2;
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
    ellipse(this.x, this.y, 50, 50);
  }
}

class Enemy {
  constructor() {
    this.x = random(GAME_WIDTH);
    this.y = random(GAME_HEIGHT);
  }

  update() {}

  display() {
    fill(255, 0, 0);
    rect(this.x, this.y, 50, 50);
  }


}
