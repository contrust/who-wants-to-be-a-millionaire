const constrains = require('../configs/constains.js');
const fs = require("fs");
const {getLeaderBoard} = require("../storage/objects");

function updateLeaderboard(name, score) {
    const leaderboard = getLeaderBoard();
    if (name in leaderboard) {
        if (leaderboard[name].score >= score) return;
        leaderboard[name].score = score;
    } else leaderboard[name] = {name: name, score: score};
    fs.writeFile(constrains.leaderboardPath, JSON.stringify(leaderboard), (err) => {
        if (err) return console.log(err);
    });
}

module.exports = {
    updateLeaderboard: updateLeaderboard
}