
// input: number of cells to print
// output: print the cells in html
function printBoard(numCells) {

    let board = document.getElementById("board");

    board.innerHTML = "";

    for (let i = 1; i <= numCells; i++) {
        board.innerHTML += `<div data-value="${i}" class="cell"> </div>`;
    }
}


function getRandoNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
  

function generateBombPositions(numOfBombs, numCells, firstClickedCell) {

    bombsPositionList = [];

    while (bombsPositionList.length < numOfBombs) {

        let num = getRandoNumber(1, numCells);

        if ( !bombsPositionList.includes(num) && num !== firstClickedCell ) {
            bombsPositionList.push(num);
        }
    }
}


// input: cell selected
// output: number of djacent bombs
function countAdjacentBombs(cell) {

    let numAdjacentBombs = 0;
    let inFirstColumn = false;
    let inLastColumn = false;

    if ( cell.getAttribute("data-value")[1] == 1 || cell.getAttribute("data-value") == 1 ) {
        inFirstColumn = true;

    } else if ( cell.getAttribute("data-value")[1] == 0 ) {
        inLastColumn = true;
    } 

    for ( let i = parseInt(cell.getAttribute("data-value")) - 10; i <= parseInt(cell.getAttribute("data-value")) + 10; i += 10 ) {

        if ( bombsPositionList.includes(i + 1) && inLastColumn == false ) {
            numAdjacentBombs++;
        }
        if ( bombsPositionList.includes(i - 1) && inFirstColumn == false ) {
            numAdjacentBombs++;
        }
        if ( bombsPositionList.includes(i) ) {
            numAdjacentBombs++;
        }
    }

    return numAdjacentBombs;
}

// input: clicked cell 
// output: extendes safe field (blue cells) when a cell does not have adjacent bombs
function revealSafeField(cell) {

    let inFirstColumn = false;
    let inLastColumn = false;

    if ( cell.getAttribute("data-value")[1] == 1 || cell.getAttribute("data-value") == 1 ) {
        inFirstColumn = true;

    } else if ( cell.getAttribute("data-value")[1] == 0 ) {
        inLastColumn = true;
    } 


    // reveal all adjacent cells if the cell has 0 adjacent bombs
    if ( countAdjacentBombs(cell) == 0 ) {

        for ( let i = parseInt(cell.getAttribute("data-value")) - 10; i <= parseInt(cell.getAttribute("data-value")) + 10; i += 10 ) {

            // check if you are in the last col
            if ( inLastColumn == false ) {

                let elmSuccColumn = document.querySelector(`[data-value="${i + 1}"]`);

                if ( elmSuccColumn != null ) {
                    elmSuccColumn.style.backgroundColor = "blue";

                    // if cleared cell is not been counted before, increase score
                    if ( !scoreCount.includes(parseInt(elmSuccColumn.getAttribute("data-value"))) ) {
                        scoreCount.push(parseInt(elmSuccColumn.getAttribute("data-value"))); 
                    }

                    // change innerhtml only for cells not changed before
                    if ( elmSuccColumn.innerHTML === " " ) {
                        elmSuccColumn.innerHTML = countAdjacentBombs(elmSuccColumn);                    
                    }
                }
            }

            // check if you are in the first col
            if ( inFirstColumn == false ) {

                let elmPrevColumn = document.querySelector(`[data-value="${i - 1}"]`);

                if ( elmPrevColumn != null ) {
                    elmPrevColumn.style.backgroundColor = "blue";

                    // if cleared cell is not been counted before, increase score
                    if ( !scoreCount.includes(parseInt(elmPrevColumn.getAttribute("data-value"))) ) {
                        scoreCount.push(parseInt(elmPrevColumn.getAttribute("data-value"))); 
                    } 

                    // change innerhtml only for cells not changed before
                    if ( elmPrevColumn.innerHTML === " " ) {
                        elmPrevColumn.innerHTML = countAdjacentBombs(elmPrevColumn);  
                    }                  
                }
            }

            // current cell column
            let elm = document.querySelector(`[data-value="${i}"]`);

            if ( elm != null ) {
                elm.style.backgroundColor = "blue";

                // if cleared cell is not been counted before, increase score
                if ( !scoreCount.includes(parseInt(elm.getAttribute("data-value"))) ) {
                    scoreCount.push(parseInt(elm.getAttribute("data-value"))); 
                }

                // change innerhtml only for cells not changed before
                if ( elm.innerHTML === " " ) {
                    elm.innerHTML = countAdjacentBombs(elm);                
                }
            }
        }
        
        // clear the innerhtml of the cell with 0 adjacent bombs
        cell.innerHTML = "";
    }    


    // search for elm with innnerhtml == 0, 
    // when you find one repeat the function from there
    for (let i = 1; i <= numberOfCells; i++) {

        let element = document.querySelector(`[data-value="${i}"]`);

        if ( element.innerHTML === "0" ) {
            revealSafeField(element);
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
    // generateBombPositions(16, numberOfCells);

    // hide diff selection and show board
    document.querySelector(".choose_difficulty").classList.add("hide");
    document.querySelector("#board").classList.add("show");
});



let scoreCount = [];

board.addEventListener('click', 
    function(event) {

        if ( bombsPositionList.includes(parseInt(event.target.getAttribute("data-value"))) ) {
            event.target.style.backgroundColor = "red";
            alert(`YOU DIED! il tuo punteggio è: ${scoreCount.length}`);
            scoreCount = [];
            bombsPositionList = [];
            document.getElementById("select_difficulty").value = "";

            // hide board and show diff selection again
            document.querySelector(".choose_difficulty").classList.remove("hide");
            document.querySelector("#board").classList.remove("show");
            return;
        }

        if ( scoreCount.includes(parseInt(event.target.getAttribute("data-value"))) ) {
            return;
        }

        // if is safe make it blue
        event.target.style.backgroundColor = "blue";
        // then increase score
        scoreCount.push(parseInt(event.target.getAttribute("data-value"))); 

        // after first click generate bombs positions
        if ( scoreCount.length == 1 ) {
            generateBombPositions(16, numberOfCells, parseInt(event.target.getAttribute("data-value")));
        }

        // print num of adjacent bombs
        event.target.innerHTML = countAdjacentBombs(event.target);


        // reveal if there is safe field around
        revealSafeField(event.target);


        // alert if you win the game
        if ( scoreCount.length == (numberOfCells - 16) ) {
            alert('complimenti hai vinto!!!');
            scoreCount = [];
            bombsPositionList = [];
            document.getElementById("select_difficulty").value = "";

            // hide board and show diff selection again
            document.querySelector(".choose_difficulty").classList.remove("hide");
            document.querySelector("#board").classList.remove("show");
            return;
        }
    }
);

