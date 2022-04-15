const question = document.querySelector("#question");
const choices = [...document.querySelectorAll(".choice-text")];

let currentQuestion = null
let isAcceptingAnswers = true;
let questionsCount = 0;
let score = 0;

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
    score = 0;
    getNewQuestion();
}

getNewQuestion = () => {
    if (questionsCount >= 2)
        return window.location.assign("end.html");
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
       const selectedChoice = event.target;
       const selectedAnswer = selectedChoice.dataset['number'];
       let status = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

       if (status === "correct"){
           // popolnyaem score
       }

       selectedChoice.parentElement.classList.add(status);

       setTimeout(() => {
           if (status === "incorrect") {
               choices[currentQuestion.answer - 1].parentElement.classList.add("correct");
               setTimeout(() =>
               {
                   return window.location.assign("end.html");
               }, 1000)
           } else {
               selectedChoice.parentElement.classList.remove(status);
               getNewQuestion();
           }
       }, 1000);
   })
});

startGame();