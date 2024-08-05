$(() => {
    const modal = new bootstrap.Modal($("#demo-modal")[0]);

    let gameCells = [];
    addGameCell()
    createBoard();

    $("#show-modal").on('click', function () {
        modal.show();
    });

    function addGameCell() {

        let row = Math.floor(Math.random() * 4)
        let column = Math.floor(Math.random() * 4)

        while (gameCells.find(c => c.row === row && c.column === column)) {
            row = Math.floor(Math.random() * 4)
            column = Math.floor(Math.random() * 4)
        }

        gameCells.push({ value: 2, row, column });
    }

    function disableBoardIfNoMoreMoves() {

        if (gameCells.every(c => gameCells.filter(d => d.row === c.row && d.value === c.value).every(e => e.column !== c.column + 1 && e.column !== c.column - 1) &&
            gameCells.filter(d => d.column === c.column && d.value === c.value).every(e => e.row !== c.row + 1 && e.row !== c.row - 1))) {
            $("button").prop('disabled', true)
            $("#message").text(`No more moves! Your highest double was ${gameCells.sort((a, b) => { return a.value > b.value ? -1 : 1 })[0].value}!`)
        }
    }

    function createBoard() {

        !isBoardFull() && addGameCell();
        $("#game-body").remove();
        $("#game-board").append('<div class="text-center" id="game-body" style="margin:auto; height:fit-content; width:fit-content;">');
        formBoardHtml();
        isBoardFull() && disableBoardIfNoMoreMoves();
    }

    function getCellColor(value) {

        let color = 'lawngreen';

        value === 4 && (color = 'deeppink')
        value === 8 && (color = 'deepskyblue')
        value === 16 && (color = 'yellow')
        value === 32 && (color = 'darkorange')
        value === 64 && (color = 'mediumpurple')
        value === 128 && (color = 'darkgrey')
        value === 256 && (color = 'goldenrod')
        value === 512 && (color = 'plum')
        value === 1024 && (color = 'brown')

        return color;
    }

    function isBoardFull() {
        return gameCells.length === 16 ? true : false;
    }

    function formBoardHtml() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {

                const cell = gameCells.find(c => c.row === i && c.column === j)
                cell && $("#game-body").append(
                    `<button
                            style="
                            display:inline-block;
                            color:black; 
                            width:110px; 
                            height:110px;
                            float:left;
                            font-size:40px;
                            border: 1px solid black;
                            
                            background-color:${getCellColor(cell.value)}" >${cell.value}</button > `
                )

                !cell && $("#game-body").append(
                    `<button
                            style="
                            width:110px;
                            float:left;
                            display:inline-block;
                            height:110px;
                            font-size:40px;
                            padding:0px;
                            border: plum;
                            background-color:white"></button> `
                )
            }

            $("#game-body").append('<br/>')
        }
    }

    $("#right, #left, #up, #down").on('click', function () {
        this.id === 'right' && onRightArrowClick();
        this.id === 'left' && onLeftArrowClick()
        this.id === 'up' && onUpArrowClick()
        this.id === 'down' && onDownArrowClick();
    });

    $(window).bind('keydown', function (e) {
        if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            e.preventDefault();
        }
        e.keyCode === 37 && onLeftArrowClick();
        e.keyCode === 38 && onUpArrowClick();
        e.keyCode === 39 && onRightArrowClick();
        e.keyCode === 40 && onDownArrowClick();
    })

    function onRightArrowClick() {
        let rows = [gameCells.filter(c => c.row === 0), gameCells.filter(c => c.row === 1), gameCells.filter(c => c.row === 2), gameCells.filter(c => c.row === 3)]

        rows.forEach(row => {
            row.sort((a, b) => { return a.column > b.column ? -1 : 1 }).forEach(c => {
                while (c.column !== 3 && !row.find(d => d.column === c.column + 1 && c.value !== d.value)) {
                    c.column++;
                }
                mergeDoubles(c)
            })
        })
        createBoard();
    }

    function onLeftArrowClick() {
        let rows = [gameCells.filter(c => c.row === 0), gameCells.filter(c => c.row === 1), gameCells.filter(c => c.row === 2), gameCells.filter(c => c.row === 3)]

        rows.forEach(row => {
            row.sort((a, b) => { return a.column < b.column ? -1 : 1 }).forEach(c => {
                while (c.column > 0 && !row.find(d => d.column === c.column - 1 && c.value !== d.value)) {
                    c.column--;
                }
                mergeDoubles(c)
            })
        })
        createBoard();
    }


    function onUpArrowClick() {
        let columns = [gameCells.filter(c => c.column === 0), gameCells.filter(c => c.column === 1), gameCells.filter(c => c.column === 2), gameCells.filter(c => c.column === 3)]

        columns.forEach(column => {
            column.sort((a, b) => { return a.row < b.row ? -1 : 1 }).forEach(c => {
                while (c.row > 0 && !column.find(d => d.row === c.row - 1 && c.value !== d.value)) {
                    c.row--;
                }
                mergeDoubles(c)
            })
        })
        createBoard();
    }

    function onDownArrowClick() {
        let columns = [gameCells.filter(c => c.column === 0), gameCells.filter(c => c.column === 1), gameCells.filter(c => c.column === 2), gameCells.filter(c => c.column === 3)]

        columns.forEach(column => {
            column.sort((a, b) => { return a.row > b.row ? -1 : 1 }).forEach(c => {
                while (c.row < 3 && !column.find(d => d.row === c.row + 1 && c.value !== d.value)) {
                    c.row++;
                }
                mergeDoubles(c)
            })
        })
        createBoard();
    }

    function mergeDoubles(cell) {
        if (gameCells.filter(d => d.column === cell.column && d.row === cell.row).length > 1) {
            cell.value *= 2;
            gameCells.splice(gameCells.indexOf(gameCells.find(c => c.row === cell.row && c.column === cell.column && c.value !== cell.value)), 1);
        }
    }
})
