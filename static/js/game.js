const questionText = document.getElementById('questionText');
const answerAText = document.getElementById('AanswerText');
const answerBText = document.getElementById('BanswerText');
const answerCText = document.getElementById('CanswerText');
const answerDText = document.getElementById('DanswerText');
const timer = document.getElementById('countdown-number');
const friendCallButton = document.getElementById('friend-call');
const fiftyFiftyButton = document.getElementById("fifty-fifty");
const friendCallWindow = document.getElementById('openModal');
const timeForAnswer = 30;
const totalHighlightTime = 4000;
const orangeHighlightTime = 2000;
const greenHighlightTime = totalHighlightTime - orangeHighlightTime;

let rightAnswerIndex = undefined;
let timeLeft = timeForAnswer;
let timerId = setInterval(countdown, 1000);
timer.innerText = `${timeForAnswer}`;
let answerChosen = false;
let fiftyFiftyUsed = false;
let fiftyFiftyUsedOnPrevQuestion = false;
let friendCallUsed = false;
let score = 0;
let questionNumber = 0;
let indexesToLetters = ["A", "B", "C", "D"];
let currentQuestionData;


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
        } else await endGame();
    }, totalHighlightTime);

}

async function updateCurrentQuestion() {
    if(fiftyFiftyUsedOnPrevQuestion){
        fiftyFiftyUsedOnPrevQuestion = false;
        indexesToLetters = ["A", "B", "C", "D"];
        for(let i = 0; i<4; i++){
            document.getElementById(`${indexesToLetters[i]}Button`).style.removeProperty( 'display' );
        }
    }
    await fetch("/api/getCurrentQuestion").then(res => res.json())
        .then(async (questionData) => {
            if (questionData === null) await endGame();
            else {
                currentQuestionData = questionData;
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
        rightAnswerButton.src = "static/images/green.png";
        setTimeout(() => {
            chosenAnswerButton.src = "static/images/black.png";
            rightAnswerButton.src = "static/images/black.png";
        }, greenHighlightTime)
    }, orangeHighlightTime);
}

function fiftyFifty(){
    if(fiftyFiftyUsed || answerChosen)
        return;
    fiftyFiftyUsed = true;
    fiftyFiftyUsedOnPrevQuestion = true;
    fiftyFiftyButton.style.backgroundImage =  "url('static/images/used5050.png')";
    fetch("/api/getFiftyFiftyAnswer").then((res) =>{
        return res.json();
    }).then((fiftyFiftyAnswer) => {
        removeIncorrectAnswers(fiftyFiftyAnswer["fiftyFiftyAnswer"]);
    })
}

function removeIncorrectAnswers(correctAnswersIndexes){
    for(let i = 0; i<4; i++){
        if(correctAnswersIndexes.includes(i))
            continue;
        document.getElementById(`${indexesToLetters[i]}Button`).style.display = "none";
    }
    indexesToLetters = [
        indexesToLetters[correctAnswersIndexes[0]],
        indexesToLetters[correctAnswersIndexes[1]]
    ];
    let rightAnswer = currentQuestionData["choices"][currentQuestionData["answerIndex"]];
    currentQuestionData["choices"] = [
        currentQuestionData["choices"][correctAnswersIndexes[0]],
        currentQuestionData["choices"][correctAnswersIndexes[1]]
    ];
    currentQuestionData["answerIndex"] = currentQuestionData["choices"].findIndex((x) => x === rightAnswer);
    rightAnswerIndex =  currentQuestionData["answerIndex"];
    console.log(indexesToLetters);
}

function friendCall(){
    if(friendCallUsed || answerChosen)
        return;
    friendCallUsed = true;
    friendCallButton.style.backgroundImage =  "url('static/images/usedCall.png')"
    fetch("/api/getFriendCallAnswer").then((res) =>
    {
        return res.json();
    }).then((friendCallAnswer) => {
        document.getElementById('friendCallText').textContent = friendCallAnswer["friendCallAnswer"];
        friendCallWindow.style.display = "flex";
    })
}

function countdown() {
    if (timeLeft === 0) {
        clearTimeout(timerId);
        setTimeout(() => {
            document.getElementById(`${indexesToLetters[rightAnswerIndex]}`).src =  "static/images/green.png";
            setTimeout(async () => {await endGame();}, 3000);
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

async function endGame() {
    return await fetch('/api/endGame', {method: 'POST'})
        .then(() => window.location.assign("/score"));
}

document.addEventListener('click', event => {
    if (indexesToLetters.includes(event.target.id)) checkAnswer(indexesToLetters.indexOf(event.target.id));
    else if (event.target.id === 'friend-call')
        friendCall();
    else if (event.target.id === 'fifty-fifty')
        fiftyFifty();
});

document.addEventListener('mouseover', event=>{
    if (!answerChosen && indexesToLetters.includes(event.target.id)){
        event.target.src = "static/images/orange.png";
    }
})

document.addEventListener('mouseout', event=>{
    if (!answerChosen && indexesToLetters.includes(event.target.id)){
        event.target.src = "static/images/black.png";
    }
})

updateCurrentQuestion().then();