const express = require("express");
const hbs = require("express-handlebars");
const fs = require("fs");
const bodyParser = require("body-parser");
const session = require("express-session");
const questionsFilePath = './static/questions/questions.json';
const leaderboardPath = './static/leaderboard/leaderboard.json';
const friendCallTemplatesPath = "./static/templates/friendCallTemplates.txt";
const leaderboardSize = 10;
const port = 3000;
const maxUsernameLength = 28;
const friendCallRightAnswerProbability = 0.5;

let questions = require(questionsFilePath)["questions"];
let leaderboard = require(leaderboardPath);
let friendCallTemplates = fs.readFileSync(friendCallTemplatesPath, "utf-8").split(/\r?\n/);
let levelsPrices = [0, 100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];


const app = express();

app.set("view engine", "hbs");
app.engine("hbs",
    hbs({
        extname: "hbs",
        defaultView: "default",
        layoutsDir: "views/layouts",
        partialsDir: "views/partials",
    })
);

app.use('/static', express.static('static'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: "7&NT0c#_myc9!!p[==_",
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/favicon.ico', express.static('static/images/favicon.ico'));
app.use('/api/', isUserPlaying);

app.get("/", (_, res) => {
    res.redirect('/start');
});

app.get("/start", (req, res) => {
    refreshGameState(req);
    res.render("start", {
        layout: "default",
        title: "Start"
    });
});

app.post("/start", (req, res) => {
    if (isStartUserParametersValid(req)){
        req.session.username = req.body.username;
        req.session.milestoneLevel = +req.body.milestoneLevel;
        res.redirect("/game");
    } else {
        res.redirect("/start");
    }
});

app.get("/game", (req, res) => {
    if (req.session.isPlaying === undefined || req.session.isPlaying === true){
        res.redirect('/start');
    }
    else {
        req.session.isPlaying = true;
        updateCurrentQuestion(req);
        res.render("game", {
            layout: "default",
            title: "Game",
        });
    }
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
            title: "Таблица лидеров",
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

app.post("/api/answerCurrentQuestion", (req, res) => {
    let success = false;
    if (!req.session.isQuestionAnswered){
        success = answerCurrentQuestion(req);
        if (success) updateCurrentLevel(req);
    }
    res.json({"success": success});
});


app.get("/api/getCurrentQuestion", (req, res) => {
    res.json(req.session.currentQuestion);
});

app.get("/api/getCurrentScore", (req, res) => {
    res.json({"currentScore": req.session.score});
});

app.get("/api/getFiftyFiftyAnswer", (req, res) => {
   let fiftyFiftyAnswer = null;
   if (!req.session.isFiftyFiftyUsed){
       fiftyFiftyAnswer = [req.session.currentQuestion["answerIndex"],
           getRandomArrayElement(getArrayCopyWithRemovedIndex(
               Array(4).keys(),
               req.session.currentQuestion["answerIndex"]))];
       req.session.isFiftyFiftyUsed = true;
   }
   res.json({"fiftyFiftyAnswer": fiftyFiftyAnswer});
});

app.get("/api/getFriendCallAnswer", (req, res) => {
    let friendCallAnswer = null;
    if (!req.session.isFriendCallUsed) {
        let template = getRandomArrayElement(friendCallTemplates);
        let answer = getFriendCallAnswer(req.session.currentQuestion);
        friendCallAnswer = getFormattedFriendCallAnswer(template, answer);
        req.session.isFriendCallUsed = true;
    }
    res.json({"friendCallAnswer": friendCallAnswer});
});

app.post("/api/endGame", (req, res) => {
    endGame(req);
    res.json({});
});

app.listen(process.env.PORT || port, () => console.log(`App listening on port ${port}`));

function isUserPlaying(req, res, next){
    if (req.session.isPlaying) next();
    else res.status(404)
        .send("You can not do this request when you are not playing.");
}

function isStartUserParametersValid(req){
    return (typeof req.body.username === "string") &&
        req.body.username.length <= maxUsernameLength &&
        !isNaN(+req.body.milestoneLevel) &&
        req.body.milestoneLevel >= 1 &&
        req.body.milestoneLevel <= 14;
}

function updateLeaderboard(name, score) {
    if (name in leaderboard) {
        if (leaderboard[name].score >= score) return;
        leaderboard[name].score = score;
    } else leaderboard[name] = {name: name, score: score};
    fs.writeFile(leaderboardPath, JSON.stringify(leaderboard), (err) => {
        if (err) return console.log(err);
        console.log(JSON.stringify(leaderboard));
        console.log('writing to ' + leaderboardPath);
    });
}

function refreshGameState(req) {
    req.session.score = 0;
    req.session.isPlaying = false;
    req.session.isVictory = false;
    req.session.isFriendCallUsed = false;
    req.session.isFiftyFiftyUsed = false;
    req.session.currentLevel = 1;
    req.session.currentQuestionsSet = null;
    req.session.currentQuestion = null;
    req.session.isQuestionAnswered = false;
}

function answerCurrentQuestion(req){
    req.session.isQuestionAnswered = true;
    return req.session.currentQuestion["answerIndex"] === req.body["answerIndex"];
}

function updateCurrentQuestion(req) {
    if (req.session.currentLevel > 15 ||
        req.session.currentQuestionsSet !== null &&
        req.session.currentQuestionsSet.length === 0) {
        endGame(req);
    } else {
        updateCurrentQuestionSet(req);
        req.session.currentQuestion = popRandomArrayElement(req.session.currentQuestionsSet);
        req.session.isQuestionAnswered = false;
    }
}

function updateCurrentLevel(req){
    req.session.currentLevel++;
    req.session.score = levelsPrices[req.session.currentLevel - 1];
    updateCurrentQuestion(req);
}

function updateCurrentQuestionSet(req){
    if (req.session.currentLevel === 1) req.session.currentQuestionsSet = [...questions["easy"]];
    else if (req.session.currentLevel === 5) req.session.currentQuestionsSet = [...questions["normal"]];
    else if (req.session.currentLevel === 9) req.session.currentQuestionsSet = [...questions["hard"]];
    else if (req.session.currentLevel === 13) req.session.currentQuestionsSet = [...questions["expert"]];
}

function endGame(req) {
    if (!req.session.isPlaying) return;
    req.session.isPlaying = false;
    req.session.currentQuestion = null;
    if (req.session.milestoneLevel < req.session.currentLevel) {
        if (req.session.currentLevel >= 15) req.session.isVictory = true;
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

function getRandomArrayElement(array) {
    return array[getRandomNonNegativeInteger(array.length)];
}

function getArrayCopyWithRemovedIndex(array, indexToRemove){
    let copiedArray = [...array];
    copiedArray.splice(indexToRemove, 1);
    return copiedArray;
}

function popRandomArrayElement(array) {
    let randomIndex = getRandomNonNegativeInteger(array.length);
    let randomElement = array[randomIndex];
    array.splice(randomIndex, 1);
    return randomElement;
}

function getFriendCallAnswer(questionData) {
    if (Math.random() < friendCallRightAnswerProbability) return questionData["choices"][questionData["answerIndex"]];
    else {
        return getRandomArrayElement(getArrayCopyWithRemovedIndex(
            questionData["choices"], questionData["answerIndex"]));
    }
}

