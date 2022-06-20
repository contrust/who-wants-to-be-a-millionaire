const constrains = require('../configs/constains.js');
const leaderboard = require('./leaderboard.js');

function refreshGameState(req) {
    req.session.score = 0;
    req.session.isPlaying = false;
    req.session.isVictory = false;
    req.session.isFriendCallUsed = false;
    req.session.isFiftyFiftyUsed = false;
    req.session.currentLevel = 1;
    req.session.currentQuestionsSet = null;
    req.session.currentQuestion = null;
    req.session.isQuestionAnswered = false;
}

function endGame(req) {
    if (!req.session.isPlaying) return;
    req.session.isPlaying = false;
    if (req.session.milestoneLevel < req.session.currentLevel) {
        if (req.session.currentLevel >= 15) req.session.isVictory = true;
        else req.session.score = constrains.levelsPrices[Math.min(req.session.milestoneLevel, 15)];
        leaderboard.updateLeaderboard(req.session.username, req.session.score);
    } else req.session.score = 0;
}

module.exports = {
    refreshGameState: refreshGameState,
    endGame: endGame
}