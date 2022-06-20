const gameState = require("./game.js");
const randomArray = require("../utils/random/array.js");
const constrains = require('../configs/constains.js');


function answerCurrentQuestion(req){
    let success = req.session.currentQuestion["answerIndex"] === req.body["answerIndex"];
    req.session.isQuestionAnswered = true;
    if (success){
        req.session.currentLevel++;
        req.session.score = constrains.levelsPrices[req.session.currentLevel - 1];
        gameState.updateDifficulty(req);
    }
    if (req.session.currentLevel > constrains.levelsCount) {
        gameState.endGame(req);
    }
    return success;
}

function updateCurrentQuestion(req) {
    req.session.currentQuestion = randomArray.popRandomArrayElement(req.session.currentQuestionsSet);
    req.session.isQuestionAnswered = false;
}

module.exports = {
    answerCurrentQuestion: answerCurrentQuestion,
    updateCurrentQuestion: updateCurrentQuestion,
}