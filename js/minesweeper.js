$(() => {
    const mineIds = [];
    const bombImage = "url('../images/bomb.jpg')";
    setUpGameBoard();
    placeMines();
    calculateQuanitityOfSurroundingMines();

    function calculateQuanitityOfSurroundingMines() {
        $("button").each(function () {
            const id = +$(this).attr('id');
            const surroundingCellIds = getBorderingCellIds(id);
            const quantityOfSurroundingMines = surroundingCellIds.filter(id => mineIds.includes(id)).length;

            const buttonName = mineIds.includes(id) ? 'Mine' : quantityOfSurroundingMines;
            buttonName && $(this).attr('name', buttonName)
        })
    }

    function allCellsAreRevealed() {
        let allRevealed = true;

        $("button").each(function () {
            if ($(this).attr('name') !== 'Mine' && $(this).css('background-color') === 'rgb(173, 216, 230)') {
                allRevealed = false;
            }
        });

        return allRevealed;
    }

    function getBorderingCellIds(id) {
        let borderingCellIds = [(id + 10), (id - 10)];

        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        if (id < 9) {
            borderingCellIds = [...borderingCellIds, `0${id - 1}`, `0${id + 1}`]

        } else if (id > 9 && id <= 19) {
            borderingCellIds = [...borderingCellIds, `0${id - 10}`, `0${id - 11}`, `0${id - 9}`]
        }

        if (numbers.some(b => id / b === 10) || id === 0) {
            borderingCellIds = [...borderingCellIds, (id + 1), (id + 11), (id - 9)]

        }
        else if (numbers.some(b => ((id - 9) / b) === 10) || id === 9) {
            borderingCellIds = [...borderingCellIds, (id - 1), (id - 11), (id + 9), `0${id - 1}`]

        } else {
            borderingCellIds = [...borderingCellIds, (id - 11), (id + 11), (id - 1), (id + 1), (id - 9), (id + 9)];
        }

        return borderingCellIds;
    }

    function placeMines() {
        while (mineIds.length < 10) {
            let mineId = `${Math.floor(Math.random() * (10) + 0)}${Math.floor(Math.random() * (10) + 0)}`;

            if (!mineIds.includes(+mineId)) {
                mineIds.push(+mineId)
            }
        }
    }

    function setUpGameBoard() {
        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 10; i++) {
                $("#game-body").append(`<button id='${j}${i}' style="width:60px; height:60px; font-size:35px; font-family: fantasy; color:lightblue; 
                background-color:lightblue; border-style:inset; border-color:darkgray">.</button>`)
            }

            $("#game-body").append('<br/>')
        }
    }

    function getTextColor(name) {
        if (name === '1') {
            return 'blue'
        } else if (name === '2') {
            return 'purple';
        } else if (name === '3') {
            return 'green';
        } else if (name === '4') {
            return 'orange'
        } else if (name === '5') {
            return 'lightgreen'
        } else {
            return 'lightgrey'
        }
    }

    function revealMines() {
        $("button").each(function () {
            if ($(this).attr('name') === 'Mine') {
                $(this).css('background', bombImage)
                $(this).css('color', 'black')
                $(this).text('.')
            }
        })
    }

    function revealBorderingBlankCells(id) {
        let surroundingCellIds;
        let blankCellIds = [];
        let referenceOfBlankCellIds = [];

        const revealSurroundingCells = (id) => {
            surroundingCellIds = getBorderingCellIds(+id);
            blankCellIds = blankCellIds.filter(i => i !== id);

            surroundingCellIds.forEach(cellId => {
                let name = $(`#${cellId}`).attr('name');
                let currentId = $(`#${cellId}`).attr('id');
                showCellValue(cellId, name)

                if (!name && !referenceOfBlankCellIds.includes(currentId)) {
                    referenceOfBlankCellIds.push(currentId)
                    blankCellIds.push(currentId);
                }
            })

            if (allCellsAreRevealed() && !$("#won-message").text()) {
                $("button").prop('disabled', true);
                $("#game-body").append(`<h1 id="won-message" style="color:white; font-size:75px"> You Win!!</h1>`)
                revealMines();
            }
        }

        revealSurroundingCells(id);

        while (blankCellIds.length) {
            blankCellIds.forEach(id => {
                revealSurroundingCells(id)
            })
        }
    }


    function showCellValue(cellId, name) {
        $(`#${cellId}`).text(name);
        $(`#${cellId}`).css('color', getTextColor(name))
        $(`#${cellId}`).css('background-color', 'lightgray')
        $(`#${cellId}`).prop('disabled', true)
    }

    $("button").on('click', function () {
        let name = $(this).attr('name')
        let id = $(this).attr('id');
        showCellValue(id, name)

        if (name === 'Mine' || allCellsAreRevealed()) {
            $("button").prop('disabled', true);
            $("#game-body").append(`<h1 style="color:white; font-size:75px"> ${name === 'Mine' ? 'Game Over!' : 'You Win!!'}</h1>`)
            revealMines();
        }

        !name && revealBorderingBlankCells(+id)
    })
})
