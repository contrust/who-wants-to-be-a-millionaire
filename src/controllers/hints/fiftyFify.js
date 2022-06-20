const randomArray = require("../../utils/random/array.js");

function getFiftyFiftyAnswer(req) {
    return [req.session.currentQuestion["answerIndex"],
        randomArray.getRandomArrayElement(randomArray.getArrayCopyWithRemovedIndex(
            Array(4).keys(),
            req.session.currentQuestion["answerIndex"]))];
}

function removeIncorrectAnswers(req, correctAnswersIndexes){
    let rightAnswer = req.session.currentQuestion.choices[req.session.currentQuestion["answerIndex"]];
    req.session.currentQuestion["choices"] = [
        req.session.currentQuestion["choices"][correctAnswersIndexes[0]],
        req.session.currentQuestion["choices"][correctAnswersIndexes[1]]
    ];
    req.session.currentQuestion["answerIndex"] = req.session.currentQuestion["choices"].findIndex((x) => x === rightAnswer);
}

module.exports = {
    getFiftyFiftyAnswer: getFiftyFiftyAnswer,
    removeIncorrectAnswers: removeIncorrectAnswers
}