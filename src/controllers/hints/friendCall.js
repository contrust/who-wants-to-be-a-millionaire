const randomArray = require("../../utils/random/array.js");

function getFormattedFriendCallAnswer(template, answer) {
    return template.replace("*", answer);
}

function getFriendCallAnswer(questionData, probability) {
    let rand = Math.random();
    if (rand< probability) return questionData["choices"][questionData["answerIndex"]];
    else {
        return randomArray.getRandomArrayElement(randomArray.getArrayCopyWithRemovedIndex(
            questionData["choices"], questionData["answerIndex"]));
    }
}

module.exports = {
    getFormattedFriendCallAnswer: getFormattedFriendCallAnswer,
    getFriendCallAnswer: getFriendCallAnswer
}