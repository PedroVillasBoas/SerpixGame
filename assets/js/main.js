/*
  main.js
  Entry point for the game.
  Initializes and starts the game loop.
*/

window.addEventListener('load', function() {
    const canvas = document.getElementById('gameCanvas');
    canvas.width = 900;
    canvas.height = 450;

    // Retrieve player names from URL
    const urlParams = new URLSearchParams(window.location.search);
    const p1Name = urlParams.get('p1') || 'Player 1';
    const p2Name = urlParams.get('p2') || 'Player 2';
    
    const game = new Game(canvas, p1Name, p2Name);
    game.start();
});