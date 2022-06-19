const questionText = document.getElementById('questionText');
const answerAText = document.getElementById('AanswerText');
const answerBText = document.getElementById('BanswerText');
const answerCText = document.getElementById('CanswerText');
const answerDText = document.getElementById('DanswerText');
const scoreText = document.getElementById('score');
const timer = document.getElementById('timer');
const friendCall = document.getElementById('friend-call');
const timeForAnswer = 30;
const totalHighlightTime = 5000;
const orangeHighlightTime = 3000;
const greenHighlightTime = totalHighlightTime - orangeHighlightTime;

let rightAnswerIndex = undefined;
let timeLeft = timeForAnswer;
let timerId = setInterval(countdown, 1000);
timer.innerText = `${timeForAnswer}`;
let answerChosen = false;
let score = 0;
let questionNumber = 0;
let indexesToLetters = ["A", "B", "C", "D"];
let indexesToAnswers = ["AanswerText", "BanswerText", "CanswerText", "DanswerText"]


function checkAnswer(chosenAnswerIndex) {
    if (answerChosen) return;
    clearTimeout(timerId);
    answerChosen = true;
    highlightAnswers(document.getElementById(`${indexesToLetters[rightAnswerIndex]}`),
        document.getElementById(`${indexesToLetters[chosenAnswerIndex]}`));
    setTimeout(async () => {
        let success = await answerCurrentQuestion(chosenAnswerIndex);
        if (success) {
            await updateCurrentScore();
            await updateCurrentQuestion();
            resetTimer();
            answerChosen = false;
        } else endGame();
    }, totalHighlightTime);

}

async function updateCurrentQuestion() {
    await fetch("/api/getCurrentQuestion").then(res => res.json())
        .then((questionData) => {
            if (questionData === null) endGame();
            else {
                questionNumber++;
                document.getElementById(`step${questionNumber}`).style.backgroundColor = "gold";
                if (questionNumber > 1)
                    document.getElementById(`step${questionNumber-1}`).style.backgroundColor = "#050553";
                updateQuestionElementsData(questionData);
                rightAnswerIndex = questionData['answerIndex'];
            }
        });
}

async function answerCurrentQuestion(answerIndex) {
    return await fetch("/api/answerCurrentQuestion", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({"answerIndex": answerIndex})
    }).then(res => res.json())
        .then(res => res["success"]);
}

function updateQuestionElementsData(questionData) {
    questionText.innerText = questionData['question'];
    answerAText.innerText = questionData['choices'][0];
    answerBText.innerText = questionData['choices'][1];
    answerCText.innerText = questionData['choices'][2];
    answerDText.innerText = questionData['choices'][3];
}

async function updateCurrentScore() {
    fetch("/api/getCurrentScore").then((res) => {
        return res.json();
    }).then((currentScoreData) => {
        score = currentScoreData['currentScore'];
    });
}

function highlightAnswers(rightAnswerButton, chosenAnswerButton) {
    chosenAnswerButton.src = "static/images/orange.png";
    setTimeout(() => {
        rightAnswerButton.src = "static/images/green.png"
        setTimeout(() => {
            chosenAnswerButton.src = "static/images/black.png";
            rightAnswerButton.src = "static/images/black.png";
        }, greenHighlightTime)
    }, orangeHighlightTime);
}

function countdown() {
    if (timeLeft === 0) {
        clearTimeout(timerId);
        setTimeout(() => {
            return window.location.assign("/score");
        }, 1000);
    } else {
        timer.innerText = `${--timeLeft}`;
    }
}

function resetTimer() {
    timeLeft = timeForAnswer;
    timer.innerText = timeLeft
    timerId = setInterval(countdown, 1000);
}

function endGame() {
    fetch('/api/endGame', {method: 'POST'})
        .then(() => window.location.assign("/score"));
}

document.addEventListener('click', event => {
    if (["A", "B", "C", "D"].includes(event.target.id)) checkAnswer(indexesToLetters.indexOf(event.target.id));
    else if (["AanswerText", "BanswerText", "CanswerText", "DanswerText"].includes(event.target.id)) checkAnswer(indexesToAnswers.indexOf(event.target.id));
    else if (event.target.id === 'friend-call')
        window.location.assign("/api/getFriendCallAnswer");
    else if (event.target.id === 'fifty-fifty')
        window.location.assign("/api/getFiftyFiftyAnswer");
});

updateCurrentQuestion().then();