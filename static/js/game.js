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

let rightAnswer = undefined;
let timeLeft = timeForAnswer;
let timerId = setInterval(countdown, 1000);
timer.innerText = `${timeForAnswer}`;
let answerChosen = false;
let score = 0;
let questionNumber = 0;


function checkAnswer(letter) {
    if (answerChosen) return;
    clearTimeout(timerId);
    answerChosen = true;
    let chosenAnswerButton = document.getElementById(`${letter}`);
    let rightAnswerButton = document.getElementById(`${rightAnswer}`);
    highlightAnswers(rightAnswerButton, chosenAnswerButton);
    setTimeout(() => {
        if (chosenAnswerButton.id === rightAnswerButton.id) {
            updateCurrentQuestion();
            updateCurrentScore();
            resetTimer();
            answerChosen = false;
        } else endGame();
    }, totalHighlightTime);

}

function updateCurrentQuestion() {
    fetch("/api/getNextQuestion").then(res => res.json())
        .then((questionData) => {
            if (questionData === null) endGame();
            else {
                questionNumber++;
                document.getElementById(`step${questionNumber}`).style.backgroundColor = "gold"
                if(questionNumber>1)
                    document.getElementById(`step${questionNumber-1}`).style.backgroundColor = "#050553"
                updateQuestionElementsData(questionData);
                rightAnswer = questionData['answer'];
            }
        });
}

function updateQuestionElementsData(questionData) {
    questionText.innerText = questionData['question'];
    answerAText.innerText = questionData['choices'][0];
    answerBText.innerText = questionData['choices'][1];
    answerCText.innerText = questionData['choices'][2];
    answerDText.innerText = questionData['choices'][3];
}

function updateCurrentScore() {
    fetch("/api/getCurrentScore").then((res) => {
        return res.json();
    }).then((currentScoreData) => {
        score = currentScoreData['currentScore'];
        scoreText.innerText = score;
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
    if (["A", "B", "C", "D"].includes(event.target.id)) checkAnswer(event.target.id);
    else if (event.target.id === 'friend-call')
        window.location.assign("/api/getFriendCallAnswer");
});

updateCurrentQuestion();