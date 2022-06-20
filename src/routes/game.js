const gameState = require("../controllers/game.js");
const leaderboard = require("../storage/objects.js");
const express = require("express");

let router = express.Router();

router.post("/end", (req, res) => {
    gameState.endGame(req, leaderboard);
    res.json({});
});

module.exports = router;