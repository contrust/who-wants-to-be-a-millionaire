const express = require("express");
const question = require("../controllers/question.js");

let router = express.Router();

router.get("/", (req, res) => {
    res.json(req.session.currentQuestion);
});

router.post("/answer", (req, res) => {
    let success = false;
    if (!req.session.isQuestionAnswered){
        success = question.answerCurrentQuestion(req);
        if (success) question.updateCurrentLevel(req);
    }
    res.json({"success": success && req.session.isPlaying});
});

module.exports = router;