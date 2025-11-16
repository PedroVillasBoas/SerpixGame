/*
  Game.js (Server-Side)
  Manages the server-side game state, loop, and collision detection.
*/
import { Player } from "./Player.js";
import { Ball } from "./Ball.js";

export class Game {
  constructor(onGameOver, onStateChange, onGameEvent) {
    this.width = 900;
    this.height = 450;

    this.players = new Map(); // Using Map to store players by their socket.id
    this.ball = new Ball(this.width, this.height);

    this.isGameRunning = false;
    this.lastTime = 0;
    this.gameLoop = this.gameLoop.bind(this);

    // Callbacks to communicate back to index.js
    this.onGameOver = onGameOver; // (winner) => {}
    this.onStateChange = onStateChange; // (gameState) => {}
    this.onGameEvent = onGameEvent; // (eventName, payload) => {}
  }

  // Adding a Player to the game
  addPlayer(id, name, playerNumber) {
    const startX = playerNumber === 1 ? 100 : this.width - 100;
    const color = playerNumber === 1 ? "blue" : "red";
    const player = new Player(
      id,
      name,
      startX,
      this.height / 2,
      color,
      this.width,
      this.height
    );
    this.players.set(id, player);
    console.log(`Player ${name} (P${playerNumber}) added to game.`);
  }

  removePlayer(id) {
    this.players.delete(id);
    console.log(`Player ${id} removed from game.`);

    // If any player leaves, end the game
    if (this.players.size < 2 && this.isGameRunning) {
      this.stopGame("A player disconnected.");
    }
  }

  // Called by Socket.IO when Input is received
  handleInput(id, inputState) {
    const player = this.players.get(id);
    if (player) {
      player.inputState = inputState;
    }
  }

  startGame() {
    if (this.isGameRunning) return;
    if (this.players.size !== 2) {
      console.log("Waiting for 2 players to start.");
      return;
    }

    console.log("Starting game...");
    this.isGameRunning = true;
    this.lastTime = Date.now();
    this.gameLoop();
  }

  stopGame(reason) {
    if (!this.isGameRunning) return;
    this.isGameRunning = false;
    console.log(`Game stopped. Reason: ${reason}`);

    // Determining Winner (If any)
    const [p1, p2] = Array.from(this.players.values());
    let winner = null;
    if (p1 && p2) {
      winner = p1.lives > p2.lives ? p1 : p2;
    } else if (p1) {
      winner = p1; // p2 disconnected
    } else if (p2) {
      winner = p2; // p1 disconnected
    }

    this.onGameOver(winner ? winner.name : "No one");

    // Resetting Players for a New Game
    this.players.forEach((p) => p.reset(p.x, p.y)); // Resetting them at their current spots for a "Play Again"
    this.ball.reset();
  }

  gameLoop() {
    if (!this.isGameRunning) return;

    const now = Date.now();
    const deltaTime = (now - this.lastTime) / 16.666; // Normalizing to 60FPS
    this.lastTime = now;

    this.update(deltaTime);
    this.onStateChange(this.getGameState()); // Broadcast state

    // Using setTimeout for a Fixed Tick Rate
    setTimeout(this.gameLoop, 1000 / 60);
  }

  update(deltaTime) {
    // Updating all Players and the ball
    this.players.forEach((player) => player.update(deltaTime));
    this.ball.update(deltaTime);

    this.checkCollisions();
  }

  checkCollisions() {
    const [p1, p2] = Array.from(this.players.values());

    // It only works for 2 Players
    if (!p1 || !p2) return;

    // Player Head vs Ball
    if (this.isCircleCollision(p1, this.ball)) {
      this.handleBallEat(p1);
    }
    if (this.isCircleCollision(p2, this.ball)) {
      this.handleBallEat(p2);
    }

    // Player Head vs Enemy Body
    this.checkHeadToBodyCollision(p1, p2);
    this.checkHeadToBodyCollision(p2, p1);

    // Checking for Game Over
    if (p1.lives <= 0 || p2.lives <= 0) {
      this.stopGame("A player ran out of lives.");
    }
  }

  handleBallEat(player) {
    player.grow();
    this.ball.reset();

    // Emitting Event for Audio and Particles (Game Feel!!)
    this.onGameEvent("ballEat", {
      x: this.ball.x,
      y: this.ball.y,
      eater: player.name,
    });
  }

  checkHeadToBodyCollision(p_head, p_body) {
    if (p_head.invincible) return;

    // Skipping the First few Body segments
    for (let i = 10; i < p_body.body.length; i++) {
      const segment = p_body.body[i];
      const dist = Math.hypot(p_head.x - segment.x, p_head.y - segment.y);

      if (dist < p_head.radius + p_body.radius) {
        // loseLife() will return True if life was lost
        if (p_head.loseLife()) {
          // Emitting Event for Audio and Particles
          this.onGameEvent("playerHit", {
            x: p_head.x,
            y: p_head.y,
            victim: p_head.name,
          });
        }
        break; // Only one hit per frame
      }
    }
  }

  isCircleCollision(circle1, circle2) {
    const dist = Math.hypot(circle1.x - circle2.x, circle1.y - circle2.y);
    return dist < circle1.radius + circle2.radius;
  }

  // Creating a Snapshot of the Game State to send to Clients
  getGameState() {
    const playerStates = Array.from(this.players.values()).map((p) =>
      p.getState()
    );
    return {
      players: playerStates,
      ball: this.ball.getState(),
    };
  }
}
