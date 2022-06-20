const express = require("express");
const constrains = require("../configs/constains");
const question = require("../controllers/question.js");
const {getQuestions} = require("../storage/objects");
const {endGame} = require("../controllers/game");
const {updateCurrentQuestion} = require("../controllers/question");
const {renderScoreAfterEnd} = require("./common");

let router = express.Router();

router.get("/", (req, res) => {
    res.json(req.session.currentQuestion);
});

router.post("/answer", (req, res) => {
    let success = false;
    if (!req.session.isQuestionAnswered){
        success = question.answerCurrentQuestion(req);
        if (success){
            if (constrains.newDifficultyLevels.includes(req.session.currentLevel))
                req.session.currentQuestionsSet = [...getQuestions(req.session.difficulty)];
            updateCurrentQuestion(req);
        } else {
            endGame(req);
            renderScoreAfterEnd(req);
        }
    }
    res.json({"success": success && req.session.isPlaying});
});

module.exports = router;