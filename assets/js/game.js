/* 
  game.js
  Represents the game instance.
  Manages the game state, including players, ball, and UI.
  Also manages the particle system for visual effects.
*/

class Game {
  constructor(canvas, player1Name, player2Name) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    this.ui = new UI();
    this.storage = new StorageManager();
    this.input = new InputHandler();
    this.audio = new AudioManager();
    this.audio.loadSounds();

    this.particleSystem = new ParticleSystem();

    // Defining controls for both players
    const p1Controls = { left: "a", right: "d" };
    const p2Controls = { left: "ArrowLeft", right: "ArrowRight" };

    // Creating players
    this.player1 = new Player(
      player1Name,
      100,
      this.height / 2,
      "blue",
      p1Controls,
      this.width,
      this.height
    );
    this.player2 = new Player(
      player2Name,
      this.width - 100,
      this.height / 2,
      "red",
      p2Controls,
      this.width,
      this.height
    );

    // Initializing ball
    this.ball = new Ball(this.width, this.height);

    // Game state
    this.isGameOver = false;
    this.startTime = Date.now();
    this.elapsedTime = 0;
    this.lastTime = 0;
    this.gameLoop = this.gameLoop.bind(this);

    // Event Listeners for modals buttons
    document.getElementById('play-again-btn').addEventListener('click', () => this.resetGame());
    document.getElementById('home-screen-btn').addEventListener('click', () => { window.location.href = 'index.html'; });
  }

  // Game to initial state
  start() {
    this.ui.initialize(this.player1, this.player2);
    this.ui.addEvent("Game started!");
    this.audio.startMusic();
    this.gameLoop(0);
  }

  // Game Update loop
  update(deltaTime) {
    if (this.isGameOver) return;

    this.player1.update(this.input);
    this.player2.update(this.input);
    this.ball.update();
    this.particleSystem.update();

    this.checkCollisions();
    this.ui.updateScoreboard(this.player1, this.player2);

    this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
    this.ui.updateTimer(this.elapsedTime);
  }

  // Draws everything
  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.player1.draw(this.ctx);
    this.player2.draw(this.ctx);
    this.ball.draw(this.ctx);
    this.particleSystem.draw(this.ctx);
  }

  // Collision detection and handling
  checkCollisions() {
    // Player Head vs Ball
    if (this.isCircleCollision(this.player1, this.ball)) {
      this.particleSystem.emit(this.ball.x, this.ball.y, '#FFD700', 30, 4, 6);
      this.player1.grow();
      this.ball.reset();
      this.ui.addEvent(`${this.player1.name} ate the ball!`);
      this.audio.playSound('eat');
    }
    if (this.isCircleCollision(this.player2, this.ball)) {
      this.particleSystem.emit(this.ball.x, this.ball.y, '#FFD700', 30, 4, 6);
      this.player2.grow();
      this.ball.reset();
      this.ui.addEvent(`${this.player2.name} ate the ball!`);
      this.audio.playSound('eat');
    }

    // Player Head vs Opponent Body
    this.checkHeadToBodyCollision(this.player1, this.player2);
    this.checkHeadToBodyCollision(this.player2, this.player1);

    // Check for Game Over
    if (this.player1.lives <= 0 || this.player2.lives <= 0) {
      this.endGame();
    }
  }

  checkHeadToBodyCollision(p_head, p_body) {
    if (p_head.invincible) return; // If player is invincible, do nothing

    // Skip the first few body segments to avoid self-collision at the neck
    for (let i = 10; i < p_body.body.length; i++) {
      const segment = p_body.body[i];
      const dist = Math.hypot(p_head.x - segment.x, p_head.y - segment.y);
      if (dist < p_head.radius + p_body.radius) {
        this.particleSystem.emit(p_head.x, p_head.y, 'red', 50, 5, 5);
        p_head.loseLife();
        this.ui.addEvent(`${p_head.name} lost a life!`);
        this.audio.playSound('collide');
        // Breaking just to make sure only one life is lost on collision event
        break;
      }
    }
  }

  isCircleCollision(circle1, circle2) {
    const dist = Math.hypot(circle1.x - circle2.x, circle1.y - circle2.y);
    return dist < circle1.radius + circle2.radius;
  }

  endGame() {
    if (this.isGameOver) return; // Preventing multiple calls
    this.isGameOver = true;
    this.audio.stopMusic();

    const winner = this.player1.lives > 0 ? this.player1 : this.player2;
    this.ui.showGameOver(winner.name);
    this.audio.playSound('win');

    const result = {
      winner: winner.name,
      timeInSeconds: this.elapsedTime,
      timeFormatted: this.ui.stopwatch.textContent,
      p1Score: this.player1.score,
      p2Score: this.player2.score,
      p1Lives: this.player1.lives,
      p2Lives: this.player2.lives
    };

    this.storage.saveResult(result);
  }

  resetGame() {
      this.player1.reset(100, this.height / 2);
      this.player2.reset(this.width - 100, this.height / 2);
      this.ball.reset();
      
      this.ui.updateScoreboard(this.player1, this.player2);
      this.ui.hideGameOver();
      
      this.isGameOver = false;
      this.startTime = Date.now();
      this.audio.startMusic();
  }

  gameLoop(timestamp) {
      if (this.isGameOver) {
          // Keeping the animation frame running but not updating/drawing the Game State
          requestAnimationFrame(this.gameLoop);
          return;
      }

      const deltaTime = timestamp - this.lastTime;
      this.lastTime = timestamp;

      this.update(deltaTime);
      this.draw();

      requestAnimationFrame(this.gameLoop);
  }
}
