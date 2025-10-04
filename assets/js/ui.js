/*
  ui.js
  Handles user interface updates and interactions.
  Manages score display, timers, and event logs.
*/

class UI {
  constructor() {
    // Player 1 elements
    this.p1Name = document.getElementById("p1-name");
    this.p1Lives = document.getElementById("p1-lives");
    this.p1Score = document.getElementById("p1-score");
    this.p1Card = document.getElementById("p1-score-card");

    // Player 2 elements
    this.p2Name = document.getElementById("p2-name");
    this.p2Lives = document.getElementById("p2-lives");
    this.p2Score = document.getElementById("p2-score");
    this.p2Card = document.getElementById("p2-score-card");

    // Game Over Modal elements
    this.gameOverModal = document.getElementById('game-over-modal');
    this.winnerMessage = document.getElementById('winner-message');

    // Other elements
    this.stopwatch = document.getElementById("stopwatch");
    this.eventsList = document.getElementById("events-list");
  }

  initialize(player1, player2) {
    this.p1Name.textContent = player1.name;
    this.p2Name.textContent = player2.name;
    this.updateScoreboard(player1, player2);
  }

  updateScoreboard(player1, player2) {
    this.p1Lives.textContent = player1.lives;
    this.p1Score.textContent = player1.score;
    this.p2Lives.textContent = player2.lives;
    this.p2Score.textContent = player2.score;

    // Example of dynamic style change
    this.p1Card.classList.remove("highlight");
    this.p2Card.classList.remove("highlight");
    if (player1.score > player2.score) {
      this.p1Card.classList.add("highlight");
    } else if (player2.score > player1.score) {
      this.p2Card.classList.add("highlight");
    }
  }

  updateTimer(seconds) {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    this.stopwatch.textContent = `${mins}:${secs}`;
  }

  addEvent(message) {
    const li = document.createElement("li");
    li.textContent = message;
    this.eventsList.prepend(li);
    if (this.eventsList.children.length > 5) {
      this.eventsList.removeChild(this.eventsList.lastChild);
    }
  }

  showGameOver(winnerName) {
      this.winnerMessage.textContent = `${winnerName} wins!`;
      this.gameOverModal.style.display = 'flex';
  }

  hideGameOver() {
      this.gameOverModal.style.display = 'none';
  }
}