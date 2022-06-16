const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const bodyParser = require("body-parser");
const session = require("express-session");

const answerTimeout = 5000;
const rootDir = process.cwd();
const port = 3000;

let questionsData;


const readQuestionsPromise = new Promise(
    function (resolve){
        fs.readFile('static/questions/questions.json', (err, data) => {
            if (err) throw err;
            resolve(JSON.parse(data));
        })})

readQuestionsPromise.then(function(data) {
    questionsData = data;
})

function GetNextQuestion(session){
    const randomIdx = Math.floor(Math.random()*session.currentQuestionsSet.length)
    const nextQuestion = session.currentQuestionsSet[randomIdx];
    session.currentQuestionsSet.splice(randomIdx, 1);
    return nextQuestion;
}


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
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
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
    req.session.score = 0;
    req.session.questionCount = 1;
    req.session.currentQuestionsSet = questionsData['questions']
    req.session.currentQuestion = GetNextQuestion(req.session);
    res.redirect("/game");
});

app.get("/game", (req, res) => {
    res.cookie("rightAnswer", req.session.currentQuestion["answer"]);
    res.render("game", {
        layout: "default",
        title: "Game",
    });
});

app.post("/game", (req, res) => {
    setTimeout(function(){
        const answer = req.body.answer;
        if(answer === req.session.currentQuestion["answer"]){
            req.session.currentQuestion = GetNextQuestion(req.session);
            req.session.score =req.session.score+  10 + Number(req.cookies.time);
            res.redirect("/game")
        }
        else {
            res.redirect("/leaderboard")
        }
    }, answerTimeout);
});

app.get("/leaderboard", (req, res) => {
    res.render("leaderboard", {
        layout: "default",
        title: "Leaderboard",
        score: req.session.score,
    });
});

app.get("/api/getNextQuestion", (req, res) => {
    res.json(GetNextQuestion(req.session));
})

app.get("api/getCallFriendPrompt", (req, res) => {
    //TODO
})

app.listen(port, () => console.log(`App listening on port ${port}`));