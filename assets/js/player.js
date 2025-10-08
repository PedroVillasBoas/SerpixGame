/* 
  player.js
  Represents a unique player in the game.
  Manages position, movement, body segments, lives, and score for each player instance.
*/
class Player {
  constructor(
    name,
    startX,
    startY,
    color,
    controls,
    canvasWidth,
    canvasHeight
  ) {
    this.name = name;                           // Player name
    this.color = color;                         // Body and Head colors
    this.controls = controls;                   // { left: 'ArrowLeft', right: 'ArrowRight' }
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.radius = 10;                           // Head radius
    this.speed = 3;                             // Movement speed
    this.angle = Math.random() * 2 * Math.PI;
    this.turnSpeed = 0.05;                      // Turning speed

    this.invincible = false;
    this.invincibilityDuration = 2000;          // 2 seconds
    this.lastHitTime = 0;


    this.reset(startX, startY);
  }

  reset(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.lives = 3;
    this.score = 0;
    this.body = [];           // Stores historical positions for the body
    this.maxLength = 20;      // Initial length in points
    this.isColliding = false; // To prevent multiple life losses from one collision
    this.invincible = false;
    this.lastHitTime = 0;
  }

  update(inputHandler) {
    // Checking if invincibility period has expired
    if (this.invincible && Date.now() - this.lastHitTime > this.invincibilityDuration) {
      this.invincible = false;
    }

    // Handles turning
    if (inputHandler.isKeyPressed(this.controls.left)) {
      this.angle -= this.turnSpeed;
    }
    if (inputHandler.isKeyPressed(this.controls.right)) {
      this.angle += this.turnSpeed;
    }

    // Move Head
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;

    // Screen Wrap
    if (this.x < 0) this.x = this.canvasWidth;
    if (this.x > this.canvasWidth) this.x = 0;
    if (this.y < 0) this.y = this.canvasHeight;
    if (this.y > this.canvasHeight) this.y = 0;

    // Adds current Head position to the beginning of the Body history
    this.body.unshift({ x: this.x, y: this.y });

    // Trim the body array to the max length
    if (this.body.length > this.maxLength) {
      this.body.pop();
    }
  }

  grow() {
    this.maxLength += 10; // Increase length by 10 points
    this.score++;
  }

  loseLife() {
    if (!this.isColliding) {
      this.lives--;
      this.invincible = true;
      this.lastHitTime = Date.now();
    }
  }

  draw(ctx) {
    // Snake flashes if it's invincible
    if (this.invincible) {
        ctx.globalAlpha = (Math.floor(Date.now() / 100) % 2 === 0) ? 0.5 : 1;
    }

    // Draws Body segments
    ctx.fillStyle = this.color;
    // The number of visible segments depends on the sampling interval
    const segmentInterval = 5;
    for (let i = 0; i < this.body.length; i += segmentInterval) {
      const pos = this.body[i];
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draws Head (slightly larger and different color)
    ctx.fillStyle = `hsl(${this.color === "blue" ? 240 : 0}, 100%, 70%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 2, 0, Math.PI * 2);
    ctx.fill();

    // Reset opacity to default
    ctx.globalAlpha = 1.0;
  }
}
