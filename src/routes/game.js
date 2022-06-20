const gameState = require("../controllers/game.js");
const common = require("./common");
const express = require("express");

let router = express.Router();

router.post("/end", (req, res) => {
    gameState.endGame(req);
    common.renderScoreAfterEnd(req);
    res.json({});
});

module.exports = router;