let timeLeft = 30;
const elem = document.getElementById('some_div');

const timerId = setInterval(countdown, 1000);

function countdown() {
    if (timeLeft === -1) {
        clearTimeout(timerId);
        doSomething();
    } else {
        elem.innerHTML = timeLeft + ' seconds remaining';
        timeLeft--;
    }
}

function doSomething(){

}