const gameState = require("./game.js");
const randomArray = require("../utils/random/array.js");
const constrains = require('../configs/constains.js');
const storageObjects = require("../storage/objects");

function updateCurrentLevel(req){
    req.session.currentLevel++;
    req.session.score = constrains.levelsPrices[req.session.currentLevel - 1];
    updateCurrentQuestion(req);
}

function updateDifficulty(req){
    if (req.session.currentLevel === 1) {
        req.session.difficulty = "easy";
        req.session.currentQuestionsSet = [...storageObjects.getQuestions(req.session.difficulty)];
    }
    else if (req.session.currentLevel === 5){
        req.session.difficulty = "normal";
        req.session.currentQuestionsSet = [...storageObjects.getQuestions(req.session.difficulty)];
    }
    else if (req.session.currentLevel === 9) {
        req.session.difficulty = "hard";
        req.session.currentQuestionsSet = [...storageObjects.getQuestions(req.session.difficulty)];
    }
    else if (req.session.currentLevel === 13) {
        req.session.difficulty = "expert";
        req.session.currentQuestionsSet = [...storageObjects.getQuestions(req.session.difficulty)];
    }
}

function answerCurrentQuestion(req){
    req.session.isQuestionAnswered = true;
    return req.session.currentQuestion["answerIndex"] === req.body["answerIndex"];
}

function updateCurrentQuestion(req) {
    if (req.session.currentLevel > constrains.levelsCount ||
        req.session.currentQuestionsSet !== null &&
        req.session.currentQuestionsSet.length === 0) {
        gameState.endGame(req);
    } else {
        updateDifficulty(req);
        req.session.currentQuestion = randomArray.popRandomArrayElement(req.session.currentQuestionsSet);
        req.session.isQuestionAnswered = false;
    }
}

module.exports = {
    answerCurrentQuestion: answerCurrentQuestion,
    updateCurrentQuestion: updateCurrentQuestion,
    updateCurrentLevel: updateCurrentLevel,
    updateDifficulty: updateDifficulty
}