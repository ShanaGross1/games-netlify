$(() => {

    formGameBoard()

    new bootstrap.Modal($("#level-modal")[0]).show();

    let allColors = ['rgb(255, 0, 0)', 'rgb(0, 128, 0)', 'rgb(128, 0, 128)', 'rgb(255, 165, 0)', 'rgb(255, 255, 0)', 'rgb(0, 0, 255)']
    const whiteRGB = 'rgb(240, 240, 240)'
    let currentColor;
    let idIndex = 1;
    let correctSetUp = []
    let roundGuess = [];

    enableNextRow();


    $(".game-level").on("click", function () {
        for (let i = 0; i < 4; i++) {
            let color = allColors[Math.floor(Math.random() * allColors.length)];
            allColors = $(this).attr('name') === 'doubles' ? allColors : allColors.filter(c => c != color);
            correctSetUp.push(color);
        }
    })

    $(".choiceColors button").on("click", function () {
        currentColor = $(this).css('background-color')
    });

    $("body").on("click", '.guess', function () {
        $(this).css('background-color') != whiteRGB && currentColor === "" ? currentColor = $(this).css('background-color') : "";
        $(this).css('background-color', currentColor)
        currentColor = "";
        shouldEnableCheckButton();
    });

    $("body").on("click", '.check', function () {
        $(`#check-${idIndex}`).hide();
        $(".guess").prop('disabled', true);

        showScore();

        if (gotCorrectSetUp()) {
            $("#message").text(`You Won!!`)
            return;
        }

        if (idIndex === 37) {
            showCorrectSetUp()
            return;
        }

        idIndex += 4;
        enableNextRow();
    });

    function shouldEnableCheckButton() {

        if ($(`#${idIndex}`).css('background-color') != whiteRGB && $(`#${idIndex + 1}`).css('background-color') != whiteRGB
            && $(`#${idIndex + 2}`).css('background-color') != whiteRGB && $(`#${idIndex + 3}`).css('background-color') != whiteRGB) {

            $(`#check-${idIndex}`).prop('disabled', false)
        }
    }

    function showCorrectSetUp() {
        $("#message").text(`You lost! The correct setup was:`)

        correctSetUp.forEach(b => {
            $("#show-setup").append(`<button disabled style="width:35px; height:35px; margin-right:5px; background-color:${b}"> </button>`)
        })
    }

    function showScore() {
        setRoundGuess();

        for (let i = 0; i < 4; i++) {
            if (roundGuess.some(b => b === correctSetUp[i])) {
                roundGuess[i] === correctSetUp[i] ? $(`#span-${idIndex}`).prepend(`<button disabled class="rounded-circle" style="width:5px; height:8px; background-color:red"></button>`) :
                    $(`#span-${idIndex}`).append(`<button disabled class="rounded-circle" style="width:5px; height:8px; background-color:white"></button>`);
            }
        }
    }

    function setRoundGuess() {
        roundGuess = [];

        for (let i = 0; i < 4; i++) {
            roundGuess.push($(`#${idIndex + i}`).css('background-color'))
        }
    }

    function gotCorrectSetUp() {
        if (roundGuess.join('') === correctSetUp.join('')) {
            return true;
        }
    }

    function enableNextRow() {

        for (let i = 0; i < 4; i++) {
            $(`#${idIndex + i}`).prop('disabled', false)
        }
    }


    function formGameBoard() {
        for (let i = 1; i <= 40; i += 4) {
            $("#game-body").append(`<div class="mt-2 align-items-baseline">
                <label class="text-white">${(i / 4) + .75})</label>
                <button id=${i} disabled style="width:35px; height:35px; margin-right:5px" class="guess"></button>
                <button id=${i + 1} disabled style = "width:35px; height:35px; margin-right:5px" class="guess" ></button >
        <button id=${i + 2} disabled style = "width:35px; height:35px; margin-right:5px" class="guess" ></button >
            <button id=${i + 3} disabled style = "width:35px; height:35px; margin-right:5px" class="guess" ></button >
                <button id="check-${i}" disabled style="width:55px; height:35px; margin-right:7px; background-color:white" class="check">Check</button>
                <label id="label-${i}"></label>
                <span id="span-${i}"></span>
            </div >`)
        }
    }
});
