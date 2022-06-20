const constrains = require("../configs/constains");
const {updateLeaderBoard} = require("../storage/objects");


function renderScoreAfterEnd(req){
    if (req.session.milestoneLevel < req.session.currentLevel) {
        if (req.session.currentLevel >= 15) req.session.isVictory = true;
        else req.session.score = constrains.levelsPrices[Math.min(req.session.milestoneLevel, 15)];
        updateLeaderBoard(req.session.username, req.session.score);
    } else req.session.score = 0;
}

module.exports = {
    renderScoreAfterEnd: renderScoreAfterEnd
}