const levelsPrices = [0, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
const newDifficultyLevels = [1, 5, 9, 13];
const difficultiesNames = ["easy", "medium", "hard", "expert"];
const levelsCount = levelsPrices.length - 1;

module.exports = {
    port: 3000,
    leaderboardSize: 10,
    maxUsernameLength: 28,
    friendCallRightAnswerProbability: {"easy": 0.9, "medium": 0.6, "hard": 0.4, "expert": 0.25},
    levelsPrices: levelsPrices,
    levelsCount: levelsCount,
    newDifficultyLevels: newDifficultyLevels,
    difficultiesNames: difficultiesNames,
    leaderboardPath: './src/storage/leaderboard/leaderboard.json',
    questionsPath: './src/storage/questions/',
    friendCallTemplatesPath: "./src/storage/hints/friendCall/templates/",
}