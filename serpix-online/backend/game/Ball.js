/*
  Ball.js (Server-Side)
  Manages the ball's state, position, and physics.
*/
export class Ball {
  constructor(canvasWidth, canvasHeight, radius = 8) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.radius = radius;
    this.speed = 5;
    this.reset();
  }

  reset() {
    this.x = this.canvasWidth / 2;
    this.y = this.canvasHeight / 2;

    // Random initial velocity
    let angle = Math.random() * 2 * Math.PI;
    this.vx = Math.cos(angle);
    this.vy = Math.sin(angle);
  }

  update(deltaTime) {
    if (!deltaTime) return;

    this.x += this.vx * this.speed * deltaTime;
    this.y += this.vy * this.speed * deltaTime;

    // Bouncing off map walls
    if (this.x - this.radius < 0) {
      this.x = this.radius; // Clamp position
      this.vx *= -1;
    }
    if (this.x + this.radius > this.canvasWidth) {
      this.x = this.canvasWidth - this.radius; // Clamp position
      this.vx *= -1;
    }
    if (this.y - this.radius < 0) {
      this.y = this.radius; // Clamp position
      this.vy *= -1;
    }
    if (this.y + this.radius > this.canvasHeight) {
      this.y = this.canvasHeight - this.radius; // Clamp position
      this.vy *= -1;
    }
  }

  // Helper method to get state for broadcasting
  getState() {
    return {
      x: this.x,
      y: this.y,
      radius: this.radius,
    };
  }
}
