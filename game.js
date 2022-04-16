const score = document.querySelector("#score");
const timer = document.querySelector("#timer");
const question = document.querySelector("#question");
const choices = [...document.querySelectorAll(".choice-text")];
const fiftyFifty = document.querySelector("#fifty-fifty");
const friendCall = document.querySelector("#friend-call");

let currentQuestion = null
let isAcceptingAnswers = true;
let isFiftyFiftyActivated = false;
let isFriendCallActivated = false;
let questionsCount = 0;
let timeLeft = 30;
let timerId = 0;
let totalScore = 0;

let questions = [
    {
        question: "Say my name...",
        choices: ["Haisenberg", "Nikita", "Chingiskhan", "Naruto"],
        answer: 1
    },
    {
        question: "Сколько будет 2+2?",
        choices: ["22", "4", "4e0", "22?"],
        answer: 4
    },
]

startGame = () => {
    questionsCount = 0;
    totalScore = 0;
    score.innerText = 0;
    isFiftyFiftyActivated = false;
    isFriendCallActivated = false;
    getNewQuestion();
}

function countdown() {
    if (timeLeft === 0) {
        clearTimeout(timerId);
        choices[currentQuestion.answer - 1].parentElement.classList.add("correct");
        setTimeout(() =>
        {
            return window.location.assign("end.html");
        }, 1000);
    } else {
        timer.innerText = --timeLeft;
    }
}

getNewQuestion = () => {
    if (questionsCount >= 10)
        return window.location.assign("end.html");
    timeLeft = 30;
    timer.innerText = 30;
    timerId = setInterval(countdown, 1000);
    questionsCount++;
    currentQuestion = questions[Math.floor(Math.random() * 2)];
    question.innerText = currentQuestion.question;
    for (let i = 0; i < 4; i++){
        choices[i].innerText = currentQuestion.choices[i];
    }
    isAcceptingAnswers = true;
}

choices.forEach(choice => {
   choice.addEventListener('click', event => {
       if (!isAcceptingAnswers) return;
       isAcceptingAnswers = false;
       clearTimeout(timerId);
       const selectedChoice = event.target;
       const selectedAnswer = selectedChoice.dataset['number'];
       let status = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
       selectedChoice.parentElement.classList.add(status);

       setTimeout(() => {
           if (status === "incorrect") {
               choices[currentQuestion.answer - 1].parentElement.classList.add("correct");
               setTimeout(() =>
               {
                   return window.location.assign("end.html");
               }, 1000)
           } else {
               totalScore += 10 + timeLeft;
               score.innerText = totalScore;
               selectedChoice.parentElement.classList.remove(status);
               getNewQuestion();
           }
       }, 1000);
   })
});

fiftyFifty.addEventListener('click', event => {
    if (isFiftyFiftyActivated) return;
    isFiftyFiftyActivated = true;
    let secondRemainingAnswer = Math.floor(Math.random() * 4) + 1;
    while (secondRemainingAnswer === currentQuestion.answer){
        secondRemainingAnswer = Math.floor(Math.random() * 4) + 1;
    }
    choices.forEach(choice => {
        if (choice.dataset['number'] != currentQuestion.answer && choice.dataset['number'] != secondRemainingAnswer){
            choice.innerText = "";
        }
    })
})

startGame();