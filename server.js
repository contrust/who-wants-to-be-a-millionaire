const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const cookieParser = require("cookie-parser");
const fs =require("fs");
const bodyParser = require("body-parser");


const answerTimeout = 5000;
let questionsData;
let readQuestionsPromise = new Promise(
    function (resolve, reject){
                fs.readFile('static/questions/questions.json', (err, data) => {
                        if (err) throw err;
                        resolve(JSON.parse(data));
                })})

readQuestionsPromise.then(function(data) {
    questionsData = data;
})
let currentQuestionsSet;



const rootDir = process.cwd();
const port = 3000;
const app = express();
let currentQuestion;
let score = 0;


function NextQuestion(){
    const randomIdx = Math.floor(Math.random()*currentQuestionsSet.length)
    const nextQuestion = currentQuestionsSet[randomIdx];
    currentQuestionsSet.splice(randomIdx, 1);
    return nextQuestion;
}

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
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (_, res) => {
    res.redirect('/start');
});

app.get("/start", (_, res) => {
    score = 0;
    res.render("start", {
        layout: "default",
        title: "Start"
    });
});

app.post("/start", (_, res) => {
    currentQuestionsSet= questionsData['questions']
    currentQuestion = NextQuestion();
    res.redirect("/game");
});

app.get("/game", (_, res) => {
    res.cookie("rightAnswer", currentQuestion["answer"]);
    res.render("game", {
        layout: "default",
        title: "Game",
        question: currentQuestion['question'],
        A: currentQuestion["choices"][0],
        B: currentQuestion["choices"][1],
        C: currentQuestion["choices"][2],
        D: currentQuestion["choices"][3],
        score: score,
    });
});

app.post("/game", (req, res) => {
    setTimeout(function(){
        const answer = req.body.answer;
        if(answer === currentQuestion["answer"]){
            currentQuestion = NextQuestion();
            score =score+  10 + Number(req.cookies.time);
            res.redirect("/game")
        }
        else {
            res.redirect("/leaderboard")
        }

    }, answerTimeout);

});

app.post("/game", (_, res) => {
    res.redirect("/game");
});
app.get("/leaderboard", (_, res) => {
    res.render("leaderboard", {
        layout: "default",
        title: "Leaderboard",
        score: score,
    });
});

app.listen(port, () => console.log(`App listening on port ${port}`));