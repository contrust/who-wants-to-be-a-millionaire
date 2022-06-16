const questionText = document.getElementById('questionText');
const answerAText = document.getElementById('AanswerText');
const answerBText = document.getElementById('BanswerText');
const answerCText = document.getElementById('CanswerText');
const answerDText = document.getElementById('DanswerText');
const scoreText = document.getElementById('score');
const timer = document.getElementById('timer');
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


document.addEventListener('click', event => {
    if(["A", "B", "C", "D"].includes(event.target.id))
        checkAnswer(event.target.id);
})
GetNextQuestion();


function checkAnswer(letter){
    if(answerChosen)
        return;
    clearTimeout(timerId);
    answerChosen = true;
    let chosenAnswerButton = document.getElementById(`${letter}`);
    let rightAnswerButton = document.getElementById(`${rightAnswer}`);
    let isCorrect = chosenAnswerButton.id === rightAnswerButton.id;
    highlightAnswers(rightAnswerButton, chosenAnswerButton);
    setTimeout(() => {
        if(isCorrect){
            GetNextQuestion();
            score = score + 10 + timeLeft;
            scoreText.innerText = score;
            resetTimer();
            answerChosen = false;
        }
        else {
            return window.location.assign('end.html');
        }
    }, totalHighlightTime);

}

function GetNextQuestion(){
    fetch("/api/getNextQuestion").then((res) => {
            return res.json();
        }
    ).then((questionData) => {
        questionText.innerText = questionData['question'];
        answerAText.innerText = questionData['choices'][0];
        answerBText.innerText = questionData['choices'][1];
        answerCText.innerText = questionData['choices'][2];
        answerDText.innerText = questionData['choices'][3];
        rightAnswer = questionData['answer'];
    });
}

function highlightAnswers(rightAnswerButton, chosenAnswerButton){
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
        setTimeout(() =>
        {
            return window.location.assign("end.html");
        }, 1000);
    } else {
        timer.innerText = `${--timeLeft}`;

    }
}

function resetTimer(){
    timeLeft = timeForAnswer;
    timer.innerText = timeLeft
    timerId = setInterval(countdown, 1000);
}