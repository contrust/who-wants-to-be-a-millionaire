const gameState = require("../controllers/game.js");
const constrains = require('../configs/constains.js');
const validation = require("../controllers/validation.js");
const question = require("../controllers/question.js");
const storageObjects = require("../storage/objects.js");
const express = require("express");
const {getQuestions} = require("../storage/objects");

let router = express.Router();

router.get("/start", (req, res) => {
    gameState.refreshGameState(req);
    res.render("start", {
        layout: "default",
        title: "Start",
        username: req.session.username || "",
        milestoneLevel: req.session.milestoneLevel || 1,
        maxUsernameLength: constrains.maxUsernameLength
    });
});

router.post("/start", (req, res) => {
    if (validation.isStartUserParametersValid(req)){
        req.session.username = req.body.username;
        req.session.milestoneLevel = +req.body.milestoneLevel;
        res.redirect("/game");
    } else {
        res.redirect("/start");
    }
});

router.get("/game", (req, res) => {
    if (req.session.isPlaying === undefined || req.session.isPlaying === true || req.session.currentQuestion !== null){
        res.redirect('/start');
    }
    else {
        req.session.isPlaying = true;
        req.session.currentQuestionsSet = [...getQuestions(req.session.difficulty)];
        question.updateCurrentQuestion(req);
        res.render("game", {
            layout: "default",
            title: "Game",
        });
    }
});

router.get("/score", (req, res) => {
    res.render("score", {
        layout: "default",
        title: "Score",
        username: req.session.username,
        score: req.session.score,
        isVictory: req.session.isVictory
    })
});


router.get("/leaderboard",
    (req, res) => {
        res.render("leaderboard", {
            layout: "default",
            title: "Таблица лидеров",
            items: Object.values(storageObjects.getLeaderBoard())
                .sort((a, b) => b.score - a.score)
                .slice(0, constrains.leaderboardSize),
        });
    });

router.get("/guide", (req, res) => {
    res.render("guide", {
        layout: "default",
        title: "Guide",
    })
});

module.exports = router;