/*
  input.js
  Handles user input for the game.
  Manages keyboard controls and input events.
*/

class InputHandler {
  constructor() {
    this.keys = new Set();
    window.addEventListener("keydown", (e) => this.keys.add(e.key));
    window.addEventListener("keyup", (e) => this.keys.delete(e.key));
  }

  isKeyPressed(key) {
    return this.keys.has(key);
  }
}