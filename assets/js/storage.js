/*
  storage.js
  Handles saving and retrieving game data from local storage.
*/

class StorageManager {
    constructor(key = 'snakePongLeaderboard') {
        this.key = key;
    }

    getLeaderboard() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : [];
    }

    saveResult(result) {
        const leaderboard = this.getLeaderboard();
        leaderboard.push(result);
        // Sorting by time (fastest first)
        leaderboard.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
        // Keeping only the top 14 scores
        const topScores = leaderboard.slice(0, 14);
        localStorage.setItem(this.key, JSON.stringify(topScores));
    }
}