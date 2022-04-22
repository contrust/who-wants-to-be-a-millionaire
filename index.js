questionsData = {
    "questions": [
        {
            "question": "Как называется еврейский Новый год?",
            "choices": [
                "Ханука",
                "Йом Кипур",
                "Кванза",
                "Рош ха-Шана"
            ],
            "answer": 4
        },
        {
            "question": "Какая планета самая горячая?",
            "choices": [
                "Венера",
                "Сатурн",
                "Меркурий",
                "Марс"
            ],
            "answer": 1
        },
        {
            "question": "Сколько сердец у осьминога?",
            "choices": [
                "1",
                "2",
                "3",
                "4"
            ],
            "answer": 3
        },
        {
            "question": "Сколько существует книг о Гарри Поттере?",
            "choices": [
                "7",
                "8",
                "6",
                "10"
            ],
            "answer": 1
        },
        {
            "question": "Сколько ребер в теле человека?",
            "choices": [
                "16",
                "24",
                "19",
                "29"
            ],
            "answer": 2
        },
        {
            "question": "Что сжигают в романе Рэя Брэдбери \"451 градус по Фаренгейту\"?",
            "choices": [
                "одежду",
                "дома",
                "книги",
                "деньги"
            ],
            "answer": 3
        },
        {
            "question": "В какой стране изобрели мороженое?",
            "choices": [
                "Индия",
                "Канада",
                "Китай",
                "Япония"
            ],
            "answer": 3
        },
        {
            "question": "Какая страна имеет выход в Индийский океан, Аравийское море и Бенгальский залив?",
            "choices": [
                "Пакистан",
                "Индонезия",
                "Китай",
                "Индия"
            ],
            "answer": 4
        },
        {
            "question": "Гавана - столица какой страны?",
            "choices": [
                "Куба",
                "Венесуэла",
                "Перу",
                "Эквадор"
            ],
            "answer": 1
        },
        {
            "question": "Единорог - национальное животное какой страны?",
            "choices": [
                "Исландия",
                "Шотландия",
                "Ирландия",
                "Швеция"
            ],
            "answer": 2
        },
        {
            "question": "В какой стране образовалась легендарная рок-группа AC / DC?",
            "choices": [
                "США",
                "Великобритания",
                "Канада",
                "Австралия"
            ],
            "answer": 4
        },
        {
            "question": "У какого млекопитающего нет голосовых связок?",
            "choices": [
                "Бегемот",
                "Жираф",
                "Пантера",
                "Крот"
            ],
            "answer": 2
        },
        {
            "question": "Какая африканская страна раньше называлась Абиссинией?",
            "choices": [
                "ЮАР",
                "Того",
                "Зимбабве",
                "Эфиопия"
            ],
            "answer": 4
        },
        {
            "question": "Какова длина олимпийского бассейна (в метрах)?",
            "choices": [
                "25",
                "50",
                "100",
                "200"
            ],
            "answer": 2
        },
        {
            "question": "Какая страна выиграла первый в истории чемпионат мира по футболу в 1930 году?",
            "choices": [
                "Уругвай",
                "Бразилия",
                "Англия",
                "Аргентина"
            ],
            "answer": 1
        }
    ]
}
questions = questionsData['questions'];
numToLetter = {
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D'
}
correctAnswer = {1: ''}

/*let readQuestionsPromise = new Promise(function (resolve, reject){
    fs.readFile('./sources/questions/questions.json',
        (err, data) => {
            if (err) throw err;
            resolve(JSON.parse(data));})})*/

function startGame() {
    document.getElementById("startGame").hidden = true;
    correctAnswer[1] = NextQuestion();
    document.getElementById("Aanswer").hidden = false;
    document.getElementById("Banswer").hidden = false;
    document.getElementById("Canswer").hidden = false;
    document.getElementById("Danswer").hidden = false;
}
let answerChosen = false;
function ChooseAnswer(letter){
    if (!answerChosen) {
        answerChosen = true;
        let chosenAnswer = document.getElementById(`${letter}answer`);
        let rightAnswer = document.getElementById(`${numToLetter[correctAnswer[1]]}answer`)
        chosenAnswer.src = "sources/images/orange.png";
        setTimeout(() => {
            rightAnswer.src = "sources/images/green.png"
            setTimeout(() => {
                chosenAnswer.src = "sources/images/black.png";
                rightAnswer.src = "sources/images/black.png";
                correctAnswer[1] = NextQuestion();
                answerChosen = false;
            }, 2000)
        }, 3000);
    }
}

function NextQuestion(){
    const randomIdx = Math.floor(Math.random()*questions.length)
    const question = questions[randomIdx];
    questions.splice(randomIdx, 1);
    let A = document.getElementById("AanswerText");
    let B = document.getElementById("BanswerText");
    let C = document.getElementById("CanswerText");
    let D = document.getElementById("DanswerText");
    A.textContent = question['choices'][0];
    B.textContent = question['choices'][1];
    C.textContent = question['choices'][2];
    D.textContent = question['choices'][3];
    return question['answer'];
}


document.getElementById("startGame").addEventListener('click', startGame);
document.addEventListener('click', event => {
    if(event.target.classList.contains("Answer"))
        ChooseAnswer(event.target.id[0])
})

