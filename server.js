const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const session = require("express-session");
const questionsFilePath = './static/questions/questions.json';
const leaderboardPath = './static/leaderboard/leaderboard.json';
const friendCallTemplatesPath = "./static/templates/friendCallTemplates.txt";
const rootDir = process.cwd();
const leaderboardSize = 10;
const port = 3000;
const friendCallRightAnswerProbability = 0.5;

let questionsData = require(questionsFilePath);
let leaderboard = require(leaderboardPath);
let friendCallTemplates = fs.readFileSync(friendCallTemplatesPath, "utf-8").split(/\r?\n/);
let crutchDictionary = {"A": 0, "B": 1, "C": 2, "D": 3};
let levelsPrices = [0, 50, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 500000, 1000000];


const app = express();

app.set("view engine", "hbs");
app.engine(
    "hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: path.join(rootDir, "views/layouts/"),
        partialsDir: path.join(rootDir, "views/partials/"),
    })
);


app.use('/static', express.static('static'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "asdfunmmc",
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (_, res) => {
    res.redirect('/start');
});

app.get("/start", (_, res) => {
    res.render("start", {
        layout: "default",
        title: "Start"
    });
});

app.post("/start", (req, res) => {
    refreshGameState(req);
    res.redirect("/game");
});

app.get("/game", (req, res) => {
    res.render("game", {
        layout: "default",
        title: "Game",
    });
});

app.get("/score", (req, res) => {
    res.render("score", {
        layout: "default",
        title: "Score",
        username: req.session.username,
        score: req.session.score,
        isVictory: req.session.isVictory
    })
});


app.get("/leaderboard",
    (req, res) => {
        res.render("leaderboard", {
            layout: "default",
            title: "Leaderboard",
            items: Object.values(leaderboard)
                .sort((a, b) => b.score - a.score)
                .slice(0, leaderboardSize),
        });
});

app.get("/guide", (req, res) => {
    res.render("guide", {
        layout: "default",
        title: "Guide",
    })
});


app.get("/api/getNextQuestion", (req, res) => {
    if (req.session.isGameOver) {
        res.json({});
        return;
    }
    updateCurrentQuestion(req);
    res.json(req.session.currentQuestion);
});

app.get("/api/getCurrentScore", (req, res) => {
    res.json({"currentScore": req.session.score});
});

app.get("/api/getFriendCallAnswer", (req, res) => {
    if (req.session.friendCallAnswer) {
        res.json();
        return;
    }
    let template = friendCallTemplates[getRandomNonNegativeInteger(friendCallTemplates.length)];
    let answer = getFriendCallAnswer(req.session.currentQuestion);
    let friendCallAnswer = getFormattedFriendCallAnswer(template, answer);
    req.session.friendCallAnswer = friendCallAnswer;
    res.json({"friendCallAnswer": friendCallAnswer});
});

app.post("/api/endGame", (req, res) => {
    endGame(req);
    res.json({});
});

app.listen(port, () => console.log(`App listening on port ${port}`));

function updateLeaderboard(name, score) {
    if (name in leaderboard) {
        if (leaderboard[name] >= score) return;
        leaderboard[name].score = score;
    } else leaderboard[name] = {name: name, score: score};
    fs.writeFile(leaderboardPath, JSON.stringify(leaderboard), (err) => {
        if (err) return console.log(err);
        console.log(JSON.stringify(leaderboard));
        console.log('writing to ' + leaderboardPath);
    });
}

function refreshGameState(req) {
    req.session.username = req.body.user;
    req.session.score = 0;
    req.session.isGameOver = false;
    req.session.isVictory = false;
    req.session.currentLevel = 0;
    req.session.milestoneLevel = req.body.milestoneLevel;
    req.session.currentQuestionsSet = questionsData['questions'];
    req.session.currentQuestion = null;
}

function updateCurrentQuestion(req) {
    req.session.currentLevel++;
    req.session.score = levelsPrices[req.session.currentLevel - 1];
    if (req.session.currentLevel > 15 || req.session.currentQuestionsSet.length === 0) {
        endGame(req);
    } else {
        const nextQuestionIndex = getRandomNonNegativeInteger(req.session.currentQuestionsSet.length);
        const nextQuestion = req.session.currentQuestionsSet[nextQuestionIndex];
        req.session.currentQuestionsSet.splice(nextQuestionIndex, 1);
        req.session.currentQuestion = nextQuestion;
    }
}

function endGame(req) {
    if (req.session.isGameOver) return;
    req.session.isGameOver = true;
    req.session.currentQuestion = null;
    if (req.session.milestoneLevel < req.session.currentLevel) {
        if (req.session.currentLevel > 15) req.session.isVictory = true;
        else req.session.score = levelsPrices[Math.min(req.session.milestoneLevel, 15)];
        updateLeaderboard(req.session.username, req.session.score);
    } else req.session.score = 0;
    console.log(`${req.session.username}: ${req.session.score}`);
}

function getRandomNonNegativeInteger(maxInteger) {
    return Math.floor(Math.random() * maxInteger);
}

function getFormattedFriendCallAnswer(template, answer) {
    return template.replace("*", answer);
}

function getFriendCallAnswer(questionData) {
    if (Math.random() < friendCallRightAnswerProbability) return questionData["answer"];
    else {
        let answers = [...questionData["choices"]];
        answers.splice(crutchDictionary[questionData["answer"]], 1);
        return answers[getRandomNonNegativeInteger(answers.length)];
    }
}

