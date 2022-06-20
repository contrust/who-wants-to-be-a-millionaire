const constrains = require("../configs/constains");

function updateDifficulty(req) {
    for (let i = 0; i < 4; i++) {
        if (req.session.currentLevel === constrains.newDifficultyLevels[i]){
            req.session.difficulty = constrains.difficultiesNames[i];
            break;
        }
    }
}

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
    updateDifficulty(req);
}

function endGame(req) {
    req.session.isPlaying = false;
}

module.exports = {
    refreshGameState: refreshGameState,
    endGame: endGame,
    updateDifficulty: updateDifficulty
}