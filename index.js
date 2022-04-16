function startGame() {
    document.getElementById("startGame").hidden = true;
    document.getElementById("Aanswer").hidden = false;
    document.getElementById("Banswer").hidden = false;
    document.getElementById("Canswer").hidden = false;
    document.getElementById("Danswer").hidden = false;
}
let answerChosen = false;
function ChooseAnswer(letter){
    if (!answerChosen) {
        answerChosen = true;
        document.getElementById(`${letter}answer`).src = "sources/images/orange.png";
    }
}
document.getElementById("startGame").addEventListener('click', startGame);
document.addEventListener('click', event => {
    if(event.target.classList.contains("Answer"))
        ChooseAnswer(event.target.id[0])
})