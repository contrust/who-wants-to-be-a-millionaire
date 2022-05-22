const score = document.querySelector("#score");
const timer = document.querySelector("#timer");
const question = document.querySelector("#question");
const questionText = document.querySelector("#questionText");
const fiftyFifty = document.querySelector("#fifty-fifty");
const friendCall = document.querySelector("#friend-call");
const Aanswer = document.getElementById("Aanswer");
const Banswer = document.getElementById("Banswer");
const Canswer = document.getElementById("Canswer");
const Danswer = document.getElementById("Danswer");
let isFiftyFiftyActivated = false;
let isFriendCallActivated = false;
let questionsCount = 0;
let timeLeft = 30;
let timerId = 0;
let totalScore = 0;
let questionsData = {
    "questions": [
        {
            "question": "Как называется еврейский Новый год?",
            "choices": [
                "Ханука",
                "Йом Кипур",
                "Кванза",
                "Рош ха-Шана"
            ],
            "answer": "D"
        },
        {
            "question": "Какая планета самая горячая?",
            "choices": [
                "Венера",
                "Сатурн",
                "Меркурий",
                "Марс"
            ],
            "answer": "A"
        },
        {
            "question": "Сколько сердец у осьминога?",
            "choices": [
                "1",
                "2",
                "3",
                "4"
            ],
            "answer": "C"
        },
        {
            "question": "Сколько существует книг о Гарри Поттере?",
            "choices": [
                "7",
                "8",
                "6",
                "10"
            ],
            "answer": "A"
        },
        {
            "question": "Сколько ребер в теле человека?",
            "choices": [
                "16",
                "24",
                "19",
                "29"
            ],
            "answer": "B"
        },
        {
            "question": "Что сжигают в романе Рэя Брэдбери \"451 градус по Фаренгейту\"?",
            "choices": [
                "одежду",
                "дома",
                "книги",
                "деньги"
            ],
            "answer": "C"
        },
        {
            "question": "В какой стране изобрели мороженое?",
            "choices": [
                "Индия",
                "Канада",
                "Китай",
                "Япония"
            ],
            "answer": "C"
        },
        {
            "question": "Какая страна имеет выход в Индийский океан, Аравийское море и Бенгальский залив?",
            "choices": [
                "Пакистан",
                "Индонезия",
                "Китай",
                "Индия"
            ],
            "answer": "D"
        },
        {
            "question": "Гавана - столица какой страны?",
            "choices": [
                "Куба",
                "Венесуэла",
                "Перу",
                "Эквадор"
            ],
            "answer": "A"
        },
        {
            "question": "Единорог - национальное животное какой страны?",
            "choices": [
                "Исландия",
                "Шотландия",
                "Ирландия",
                "Швеция"
            ],
            "answer": "B"
        },
        {
            "question": "В какой стране образовалась легендарная рок-группа AC / DC?",
            "choices": [
                "США",
                "Великобритания",
                "Канада",
                "Австралия"
            ],
            "answer": "D"
        },
        {
            "question": "У какого млекопитающего нет голосовых связок?",
            "choices": [
                "Бегемот",
                "Жираф",
                "Пантера",
                "Крот"
            ],
            "answer": "B"
        },
        {
            "question": "Какая африканская страна раньше называлась Абиссинией?",
            "choices": [
                "ЮАР",
                "Того",
                "Зимбабве",
                "Эфиопия"
            ],
            "answer": "D"
        },
        {
            "question": "Какова длина олимпийского бассейна (в метрах)?",
            "choices": [
                "25",
                "50",
                "100",
                "200"
            ],
            "answer": "B"
        },
        {
            "question": "Какая страна выиграла первый в истории чемпионат мира по футболу в 1930 году?",
            "choices": [
                "Уругвай",
                "Бразилия",
                "Англия",
                "Аргентина"
            ],
            "answer": "A"
        }
    ]
}
let currentQuestionsSet = null;
let currentQuestion = null;


function startGame() {
    document.getElementById("startGame").hidden = true;
    currentQuestionsSet = questionsData['questions'];
    currentQuestion= NextQuestion();
    Aanswer.hidden = false;
    Banswer.hidden = false;
    Canswer.hidden = false;
    Danswer.hidden = false;
    score.hidden = false;
    timer.hidden = false;
    question.hidden = false;
    question.style.display = 'flex';
    fiftyFifty.hidden = false;
    friendCall.hidden = false;
    isFiftyFiftyActivated = false;
    isFriendCallActivated = false;
}
let answerChosen = false;
function ChooseAnswer(letter){
    if (!answerChosen) {
        clearTimeout(timerId);
        answerChosen = true;
        let chosenAnswer = document.getElementById(`${letter}answer`);
        let rightAnswer = document.getElementById(`${currentQuestion['answer']}answer`)
        chosenAnswer.src = "../images/orange.png";
        let isCorrect = chosenAnswer.id === rightAnswer.id;
        console.log(isCorrect);
        console.log(chosenAnswer.textContent);
        console.log(rightAnswer.textContent);
        setTimeout(() => {
            rightAnswer.src = "../images/green.png"
            setTimeout(() => {
                chosenAnswer.src = "../images/black.png";
                if(!isCorrect)
                    rightAnswer.src = "../images/black.png";
                answerChosen = false;
                if(isCorrect){
                    totalScore += 10+timeLeft;
                    score.innerText = `Score: ${totalScore}`;
                    currentQuestion = NextQuestion();
                }
                else
                    window.location.assign('end.html');
            }, 2000)
        }, 3000);

    }
}

function NextQuestion(){
    const randomIdx = Math.floor(Math.random()*currentQuestionsSet.length)
    const nextQuestion = currentQuestionsSet[randomIdx];
    currentQuestionsSet.splice(randomIdx, 1);
    let A = document.getElementById("AanswerText");
    let B = document.getElementById("BanswerText");
    let C = document.getElementById("CanswerText");
    let D = document.getElementById("DanswerText");
    questionText.textContent = nextQuestion['question'];
    A.textContent = `A${'\u00A0'.repeat(3)}${nextQuestion['choices'][0]}`;
    B.textContent = `B${'\u00A0'.repeat(3)}${nextQuestion['choices'][1]}`;
    C.textContent = `C${'\u00A0'.repeat(3)}${nextQuestion['choices'][2]}`;
    D.textContent = `D${'\u00A0'.repeat(3)}${nextQuestion['choices'][3]}`;
    timeLeft = 30;
    timer.innerText = 30;
    timerId = setInterval(countdown, 1000);
    return nextQuestion;
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


document.getElementById("startGame").addEventListener('click', startGame);
document.addEventListener('click', event => {
    if(event.target.classList.contains("Answer"))
        ChooseAnswer(event.target.id[0])
})

