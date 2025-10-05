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

        // Sorting criteria:
        // 1. Primary sort: Higher winner's score is better.
        // 2. Secondary sort (tie-breaker): Lower time is better.
        leaderboard.sort((a, b) => {
            const winnerAScore = a.winner === "Player 1" ? a.p1Score : a.p2Score;
            const winnerBScore = b.winner === "Player 1" ? b.p1Score : b.p2Score;

            // Score descending
            if (winnerBScore !== winnerAScore) {
                return winnerBScore - winnerAScore;
            }
            
            // Time ascending
            return a.timeInSeconds - b.timeInSeconds;
        });
        // Keeping only the top 14 scores
        const topScores = leaderboard.slice(0, 14);
        localStorage.setItem(this.key, JSON.stringify(topScores));
    }
}