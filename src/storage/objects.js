const constrains = require('../configs/constains.js');
const fs = require("fs");
const path = require('path');

function getQuestions(difficulty){
    return JSON.parse(fs.readFileSync(path.join(constrains.questionsPath, `${difficulty}.json`), 'utf-8'))["questions"];
}

function getLeaderBoard(){
    return JSON.parse(fs.readFileSync(constrains.leaderboardPath, 'utf-8'));
}

function updateLeaderBoard (name, score) {
    const leaderboard = getLeaderBoard();
    if (name in leaderboard) {
        if (leaderboard[name].score >= score) return;
        leaderboard[name].score = score;
    } else leaderboard[name] = {name: name, score: score};
    fs.writeFile(constrains.leaderboardPath, JSON.stringify(leaderboard), (err) => {
        if (err) return console.log(err);
    });
}

function getFriendCallTemplates(difficulty){
    return fs.readFileSync(path.join(constrains.friendCallTemplatesPath, `${difficulty}.txt`), "utf-8").split(/\r?\n/);
}

module.exports = {
    getQuestions: getQuestions,
    getLeaderBoard: getLeaderBoard,
    updateLeaderBoard: updateLeaderBoard,
    getFriendCallTemplates: getFriendCallTemplates
}