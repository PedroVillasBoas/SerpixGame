/*
  InputHandler.js (Client-Side)
  Handles user input for the game.
  Manages keyboard controls and input events.
*/
export class InputHandler {
  constructor() {
    this.keys = new Set();

    this.handleKeyDown = (e) => this.keys.add(e.key);
    this.handleKeyUp = (e) => this.keys.delete(e.key);

    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);

    console.log("InputHandler attached to window.");
  }

  isKeyPressed(key) {
    return this.keys.has(key);
  }

  // Removing listeners when the game is over
  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
  }
}
