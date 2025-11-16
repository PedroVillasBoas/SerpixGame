/*
  Player.js (Server-Side)
  Manages a single player's state (position, body, score, lives).
*/
export class Player {
  constructor(
    id, // Socket.id
    name,
    startX,
    startY,
    color,
    canvasWidth,
    canvasHeight
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.radius = 10;
    this.speed = 3.5;
    this.angle = Math.random() * 2 * Math.PI;
    this.turnSpeed = 0.05;

    this.invincible = false;
    this.invincibilityDuration = 2000;
    this.lastHitTime = 0;

    // This state is sent from the Client!
    this.inputState = { left: false, right: false };

    this.reset(startX, startY);
  }

  reset(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.lives = 3;
    this.score = 0;
    this.body = []; // Stores historical positions for the Snake body
    this.maxLength = 20;
    this.invincible = false;
    this.lastHitTime = 0;
  }

  update(deltaTime) {
    // Checking if invincibility period has expired
    if (
      this.invincible &&
      Date.now() - this.lastHitTime > this.invincibilityDuration
    ) {
      this.invincible = false;
    }

    // Handling Input
    // Turning based on the InputState
    if (this.inputState.left) {
      this.angle -= this.turnSpeed * deltaTime;
    }
    if (this.inputState.right) {
      this.angle += this.turnSpeed * deltaTime;
    }

    // Moving Head
    this.x += Math.cos(this.angle) * this.speed * deltaTime;
    this.y += Math.sin(this.angle) * this.speed * deltaTime;

    // Screen Wrap
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.x > this.canvasWidth) this.x = 0;
    if (this.y < 0) this.y = this.canvasHeight;
    if (this.y > this.canvasHeight) this.y = 0;

    // Adding current Head position to the beginning of the Body history
    this.body.unshift({ x: this.x, y: this.y });

    // Trimming the body array to the max length
    if (this.body.length > this.maxLength) {
      this.body.pop();
    }
  }

  grow() {
    this.maxLength += 10;
    this.score++;
  }

  loseLife() {
    if (this.invincible) return false; // Didn't lose a life because of invincibility

    this.lives--;
    this.invincible = true;
    this.lastHitTime = Date.now();
    return true; // Successfully lost a life
  }

  // Helper method to GET State for Broadcasting
  getState() {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      color: this.color,
      radius: this.radius,
      lives: this.lives,
      score: this.score,
      body: this.body,
      invincible: this.invincible,
    };
  }
}
