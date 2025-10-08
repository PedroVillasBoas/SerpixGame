/* 
  particle.js
  Represents a particle in the game.
  Manages the particle's position, velocity, and rendering.
*/

class Particle {
  constructor(x, y, color, speed, size) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = Math.random() * size + 1;
    this.speed = speed;
    this.angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(this.angle) * Math.random() * this.speed;
    this.vy = (Math.sin(this.angle) * Math.random() * this.speed);
    this.lifespan = 100; // Time to live, in frames
    this.gravity = 0.05;
    this.friction = 0.98;
  }

  // Checking if particle should be removed
  isFinished() {
    return this.lifespan <= 0;
  }

  update(deltaTime) {
    this.lifespan--;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.vy += this.gravity;
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.lifespan / 100; // Fade out
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
