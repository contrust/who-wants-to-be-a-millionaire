let answerChosen = false;

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    console.log(document.cookie);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function countdown() {
    if (timeLeft === 0) {
        clearTimeout(timerId);
        setTimeout(() =>
        {
            return window.location.assign("end.html");
        }, 1000);
    } else {
        timer.innerText = --timeLeft;
    }
}

function CheckAnswer(letter){
    if (!answerChosen) {
        answerChosen = true;
        let chosenAnswer = document.getElementById(`${letter}answer`);
        let rightAnswerButton = document.getElementById(`${rightAnswer}answer`)
        chosenAnswer.src = "static/images/orange.png";
        let isCorrect = chosenAnswer.id === rightAnswerButton.id;
        setTimeout(() => {
            rightAnswerButton.src = "static/images/green.png"
            setTimeout(() => {
                chosenAnswer.src = "static/images/black.png";
                if(!isCorrect)
                    rightAnswerButton.src = "static/images/black.png";
                answerChosen = false;
            }, 2000)
        }, 3000);

    }
}

let rightAnswer = getCookie("rightAnswer");
console.log(rightAnswer);
document.addEventListener('click', event => {
    if(event.target.id.includes("answer"))
        CheckAnswer(event.target.id[0]);
})