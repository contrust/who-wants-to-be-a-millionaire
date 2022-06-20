const levelsPrices = [0, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const levelsCount = levelsPrices.length;

module.exports = {
    port: 3000,
    leaderboardSize: 10,
    maxUsernameLength: 28,
    friendCallRightAnswerProbability: {"easy": 0.9, "normal": 0.6, "hard": 0.4, "expert": 0.25},
    levelsPrices: levelsPrices,
    levelsCount: levelsCount,
    leaderboardPath: './src/storage/leaderboard/leaderboard.json',
    questionsPath: './src/storage/questions/',
    friendCallTemplatesPath: "./src/storage/hints/friendCall/templates/",
}