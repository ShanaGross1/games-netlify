$(() => {

    let boardInfo = {
        cellsCount: 81,
        minesCount: 10,
        columns: 9,
        rows: 9
    }

    let boardCells = [];
    setUpGame();

    function setUpGame() {

        boardCells = formBoardCells();
        placeMines();
        calculateValuesBasedOnSurroundingMines();
        recreateBoard();
    }

    $("#easy, #medium, #hard").on('click', function () {
        const gameLevel = this.id;

        gameLevel === 'easy' && (boardInfo = { cellsCount: 81, minesCount: 10, columns: 9, rows: 9 })
        gameLevel === 'medium' && (boardInfo = { cellsCount: 256, minesCount: 40, columns: 16, rows: 16 })
        gameLevel === 'hard' && (boardInfo = { cellsCount: 480, minesCount: 99, columns: 30, rows: 16 })

        setUpGame();
        $("#message").text('');
        $("#revealSection").prop('disabled', false)
        $("#revealValue").prop('disabled', false)


    })

    
    function formBoardCells() {
        let boardCells = [];
        for (let i = 1; i <= boardInfo.rows; i++) {
            for (let j = 1; j <= boardInfo.columns; j++) {
                boardCells.push({
                    id: `${i}${j}`,
                    row: i,
                    column: j,
                    isRevealed: false,
                    isBomb: false,
                    value: '',
                    isDisabled: false,
                    isFlagged: false
                })
            }
        }
        return boardCells;
    }

    function getRandomNumberInRange() {
        return Math.floor(Math.random() * boardCells.length);
    }

    function placeMines() {
        for (let i = 0; i < boardInfo.minesCount;) {
            let index = getRandomNumberInRange();

            if (!boardCells[index].isBomb) {
                boardCells[index].isBomb = true;
                i++;
            }
        }
    }

    function calculateValuesBasedOnSurroundingMines() {

        boardCells.forEach(cell => {
            if (!cell.isBomb) {
                cell.value = getSurroundingCells(cell.row, cell.column).filter(c => c.isBomb).length || '';
                cell.color = getTextColor(cell.value)
            }
        })
    }

    function getTextColor(value) {
        let textColor = 'lightgrey';

        value === 1 && (textColor = 'blue');
        value === 2 && (textColor = 'purple');
        value === 3 && (textColor = 'green');
        value === 4 && (textColor = 'orange');
        value === 5 && (textColor = 'lightgreen');
        value === 6 && (textColor = 'pink');

        return textColor;
    }

    function getCellDimenstions() {
        if (boardInfo.cellsCount === 81) {
            return '50px';
        }
        return boardInfo.cellsCount === 256 ? '35px' : '30px'
    }

    function getFontSize() {
        if (boardInfo.cellsCount === 81) {
            return '30px';
        }
        return boardInfo.cellsCount === 256 ? '20px' : '18px'
    }

    function setUpGameBoard() {
        const cellDimensions = getCellDimenstions();
        const fontSize = getFontSize();

        boardCells.forEach((cell, idx) => {
            const { isDisabled, isFlagged, isRevealed, column, color } = cell
            $("#game-body").append(
                `<button 
                id=${idx} 
                ${(isDisabled || isFlagged) && 'disabled'}
                style="padding:0px;
                       width:${cellDimensions}; 
                       height:${cellDimensions}; 
                       font-size:${fontSize}; 
                       font-family: fantasy;
                       color:${isFlagged ? 'red' : color}; 
                       background-color:${isRevealed ? 'lightgrey' : 'lightblue'}; 
                       border-style:inset; 
                       vertical-align: top;
                       border-color:darkgray;">
                       ${isRevealed || isFlagged ? getButtonText(cell) : ""}
                 </button>`)

            if (column === boardInfo.columns) {
                $("#game-body").append('<br/>')
            }
        })
    }

    function getButtonText(cell) {
        if (cell.isBomb && cell.isRevealed) {
            return '<img src="/images/bomb.jpg" style="width:inherit; height:inherit;" />'
        }
        return cell.isFlagged && !cell.isRevealed ? '?' : cell.value;
    }

    function getSurroundingCells(row, column) {
        return boardCells.filter(c => (c.column === column || c.column === column + 1 || c.column === column - 1) &&
            (c.row === row || c.row === row + 1 || c.row === row - 1));
    }

    function recreateBoard() {

        $("#game-body").remove();
        $("#game-board").append(`<div class="text-center" id="game-body">`)
        setUpGameBoard();
    }

    $('#game-board').on("contextmenu", function () { return false });

    $("#game-board").on('auxclick', 'button', function (e) {
        let id = $(this).attr('id');
        let currentCell = boardCells[id];
        if (currentCell.isDisabled) {
            return;
        }
        currentCell.isFlagged = !currentCell.isFlagged;
        recreateBoard();
    })

    function doClickAction(cellId) {
        let currentCell = boardCells[cellId];

        (!currentCell.value && !currentCell.isBomb) && revealSurroundingSection(currentCell)

        currentCell.isDisabled = true;
        currentCell.isRevealed = true;
        console.log('current cell: ' + currentCell.id, currentCell.isRevealed)

        if (currentCell.isBomb || boardCells.every(c => c.isBomb || (!c.isBomb && c.isRevealed))) {
            boardCells.forEach(c => { c.isDisabled = true })
            boardCells.filter(c => c.isBomb).forEach(c => { c.isRevealed = true })
            $("#message").text(currentCell.isBomb ? 'Game Over!' : 'You Win!!')
        }

        recreateBoard();
    }

    $("#game-board").on('click', 'button', function () {

        const cellId = $(this).attr('id');
        doClickAction(cellId);
    })


    function revealSurroundingSection(cell) {

        let cellsWithoutValues = [];

        const revealSurroundingCells = (cell) => {
            cellsWithoutValues = cellsWithoutValues.filter(c => c.id != cell.id)

            let surroundingCells = getSurroundingCells(cell.row, cell.column);

            surroundingCells.forEach(cell => {
                (!cell.value && !cell.isRevealed) && cellsWithoutValues.push(cell);
                cell.isRevealed = true;
            })
        }

        revealSurroundingCells(cell);

        while (cellsWithoutValues.length) {
            cellsWithoutValues.forEach(cell => { revealSurroundingCells(cell) })
        }
    }
})


