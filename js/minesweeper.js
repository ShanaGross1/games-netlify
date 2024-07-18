$(() => {
    const messages = ['You can do this, Shira!!', 'Shira is awesome!!', 'Good luck, Shira!!', `You can beat this!!`,
        'Shira is ONE in a MILLION!!', 'Best of luck, Shira!!', 'Go Shira Go!!!']

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
    
    $("#easy, #medium, #hard, #expert").on('click', function () {
        const gameLevel = this.id;

        gameLevel === 'easy' && (boardInfo = { cellsCount: 81, minesCount: 10, columns: 9, rows: 9 })
        gameLevel === 'medium' && (boardInfo = { cellsCount: 256, minesCount: 40, columns: 16, rows: 16 })
        gameLevel === 'hard' && (boardInfo = { cellsCount: 480, minesCount: 70, columns: 28, rows: 16 })
        gameLevel === 'expert' && (boardInfo = { cellsCount: 480, minesCount: 99, columns: 30, rows: 16 })


        setUpGame();
        $("#message").text(messages[getRandomNumberInRange(messages.length)]);
        $("#revealSection").prop('disabled', false)
        $("#revealValue").prop('disabled', false)
    })

    $("#revealValue").on('click', function () {
        const indexOfCellWithValue = boardCells.findIndex(c => !c.isRevealed && c.value && !c.isBomb);
        if (indexOfCellWithValue === -1) {
            return;
        }
        doClickAction(indexOfCellWithValue)
    })

    $("#revealSection").on('click', function () {
        const indexOfBlankCell = boardCells.findIndex(c => !c.isRevealed && !c.value && !c.isBomb);

        if (indexOfBlankCell === -1) {
            $("#revealSection").prop('disabled', true)
            return
        }
        doClickAction(indexOfBlankCell)
    })

    function setFlagCount() {
        const flagCount = boardCells.filter(c => c.isFlagged).length;
        $("#flagCount").text(flagCount)
    }

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

    function getRandomNumberInRange(listLength) {
        return Math.floor(Math.random() * listLength);
    }

    function placeMines() {
        for (let i = 0; i < boardInfo.minesCount;) {
            let index = getRandomNumberInRange(boardCells.length);

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
        value === 3 && (textColor = 'darkgreen');
        value === 4 && (textColor = 'red');
        value === 5 && (textColor = 'darkorange');
        value === 6 && (textColor = 'hotpink');
        value === 7 && (textColor = 'brown');
        value === 8 && (textColor = 'grey');

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
        let html = '';

        boardCells.forEach((cell, idx) => {
            html += `<button 
                id=${idx} 
                ${(cell.isDisabled || cell.isFlagged) && 'disabled'}
                style="padding:0px;
                       width:${cellDimensions}; 
                       height:${cellDimensions}; 
                       font-size:${fontSize}; 
                       font-weight:bold;
                       color:${cell.isFlagged ? 'red' : cell.color}; 
                       background-color:${cell.isRevealed ? 'lightgrey' : 'grey'}; 
                       border-style:inset; 
                       vertical-align: top;
                       border-color:darkgray;">
                       ${cell.isRevealed || cell.isFlagged ? getButtonText(cell) : ""} 
                 </button>`

            if (cell.column === boardInfo.columns) {
                html += '<br/>'
            }
        })

        $("#game-body").append(html)
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
        setFlagCount()
        recreateBoard();
    })

    function doClickAction(cellId) {
        let currentCell = boardCells[cellId];

        (!currentCell.value && !currentCell.isBomb) && revealSurroundingSection(currentCell)

        currentCell.isDisabled = true;
        currentCell.isRevealed = true;

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


