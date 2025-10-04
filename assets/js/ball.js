/* 
  ball.js
  Represents the ball in the game.
  Manages position, movement, and rendering for the ball instance.
*/

class Ball {
  constructor(canvasWidth, canvasHeight, radius = 8) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.radius = radius;
    this.reset();
  }

  reset() {
    this.x = this.canvasWidth / 2;
    this.y = this.canvasHeight / 2;

    // Random initial velocity
    let angle = Math.random() * 2 * Math.PI;
    this.vx = Math.cos(angle) * 4;
    this.vy = Math.sin(angle) * 4;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off map walls
    if (this.x - this.radius < 0 || this.x + this.radius > this.canvasWidth) {
      this.vx *= -1;
    }
    if (this.y - this.radius < 0 || this.y + this.radius > this.canvasHeight) {
      this.vy *= -1;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.closePath();
  }
}