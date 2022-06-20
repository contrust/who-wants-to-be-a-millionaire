const randomNumber = require("./number.js");

function getRandomArrayElement(array) {
    return array[randomNumber.getRandomNonNegativeInteger(array.length)];
}

function getArrayCopyWithRemovedIndex(array, indexToRemove){
    let copiedArray = [...array];
    copiedArray.splice(indexToRemove, 1);
    return copiedArray;
}

function popRandomArrayElement(array) {
    let randomIndex = randomNumber.getRandomNonNegativeInteger(array.length);
    let randomElement = array[randomIndex];
    array.splice(randomIndex, 1);
    return randomElement;
}

module.exports = {
    "getRandomArrayElement": getRandomArrayElement,
    "getArrayCopyWithRemovedIndex": getArrayCopyWithRemovedIndex,
    "popRandomArrayElement": popRandomArrayElement
}