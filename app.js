
// input: number of cells to print
// output: print the cells in html
function printBoard(numCells) {

    let board = document.getElementById("board");

    board.innerHTML = "";

    for (let i = 1; i <= numCells; i++) {
        board.innerHTML += `<div class="cell">${i}</div>`;
    }
}


function getRandoNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
  

function generateBombPositions(numOfBombs, numCells) {

    bombsPositionList = [];

    while (bombsPositionList.length < numOfBombs) {

        let num = getRandoNumber(1, numCells);

        if ( !bombsPositionList.includes(num) ) {
            bombsPositionList.push(num);
        }
    }
}


let bombsPositionList = [];
let numberOfCells;

// when you choose difficulty hide difficulty selection and show board
document.getElementById("select_difficulty").addEventListener('change', function() {

    // set difficulty
    let difficulty = document.getElementById("select_difficulty").value;

    if (difficulty == "easy") {
        numberOfCells = 100;

    } else if (difficulty == "medium") {
        numberOfCells = 80;

    } else if (difficulty == "hard") {
        numberOfCells = 50;

    } else {
        return;
    }

    // print board and set bombs
    printBoard(numberOfCells);
    generateBombPositions(16, numberOfCells);

    // hide diff selection and show board
    document.querySelector(".choose_difficulty").classList.add("hide");
    document.querySelector("#board").classList.add("show");
});



let scoreCount = [];

board.addEventListener('click', 
    function(event) {

        if ( bombsPositionList.includes(parseInt(event.target.innerHTML)) ) {
            event.target.style.backgroundColor = "red";
            alert(`YOU DIED! il tuo punteggio è: ${scoreCount.length}`);
            scoreCount = [];
            document.getElementById("select_difficulty").value = "";

            // hide board and show diff selection again
            document.querySelector(".choose_difficulty").classList.remove("hide");
            document.querySelector("#board").classList.remove("show");
            return;
        }

        if ( scoreCount.includes(parseInt(event.target.innerHTML)) ) {
            return;
        }

        event.target.style.backgroundColor = "blue";
        scoreCount.push(parseInt(event.target.innerHTML));

        // alert if you win the game
        if ( scoreCount.length == (numberOfCells - 16) ) {
            alert('complimenti hai vinto!!!');
            scoreCount = [];
            document.getElementById("select_difficulty").value = "";

            // hide board and show diff selection again
            document.querySelector(".choose_difficulty").classList.remove("hide");
            document.querySelector("#board").classList.remove("show");
            return;
        }
    }
);