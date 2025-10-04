/* 
  setup.js
  Handles the setup screen functionality.
  Manages player name input, form submission, and leaderboard display.
*/

document.addEventListener("DOMContentLoaded", function () {
  const setupForm = document.getElementById("setup-form");
  const leaderboardBtn = document.getElementById("leaderboard-btn");
  const leaderboardModal = document.getElementById("leaderboard-modal");
  const closeBtn = document.querySelector(".close-btn");
  const leaderboardBody = document.querySelector("#leaderboard-table tbody");

  // Instantiating storage manager to get/add data
  const storage = new StorageManager();

  // Form submission logic
  if (setupForm) {
    setupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const p1Name = encodeURIComponent(
        document.getElementById("player1").value
      );
      const p2Name = encodeURIComponent(
        document.getElementById("player2").value
      );
      window.location.href = `game.html?p1=${p1Name}&p2=${p2Name}`;
    });
  }

  // Modal control logic
  leaderboardBtn.addEventListener("click", () => {
    populateLeaderboard(storage.getLeaderboard());
    leaderboardModal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    leaderboardModal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == leaderboardModal) {
      leaderboardModal.style.display = "none";
    }
  });

  // Populating the leaderboard table
  function populateLeaderboard(data) {
    leaderboardBody.innerHTML = "";
    if (data.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.textContent = "No scores yet. Play a game!";
      cell.style.textAlign = "center";
      row.appendChild(cell);
      leaderboardBody.appendChild(row);
      return;
    }
    data.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${entry.winner}</td>
                <td>${entry.timeFormatted}</td>
                <td>${entry.p1Score}</td>
                <td>${entry.p2Score}</td>
            `;
      leaderboardBody.appendChild(row);
    });
  }
});