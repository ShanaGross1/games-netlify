$(() => {
    const wordsToChooseFrom = ['BEVERAGE', 'SYMPHONY', 'ATTITUDE', 'CONTROL', 'KETCHUP', 'SPRINKLE', 'FLOWER', 'MAGIC', 'COMPUTER', 'CEREAL', 'BRACELET', 'SLINKY', 'ELEPHANT'
    'DEPOSIT', 'KNOW', 'SCARED', 'BRUSH', 'PHONE', 'ENJOY', 'STYLE', 'FOLD', 'BUILD', 'ACTION', 'METHOD',''];
    const hangManWord = wordsToChooseFrom[Math.floor(Math.random() * wordsToChooseFrom.length)].split('')

    printLetterButtons()
    formSetUp();


    $("body").on("click", ".button-letter", function () {

        let guessedLetter = $(this).text();
        $(this).hide();

        if (hangManWord.every(b => b != guessedLetter)) {

            $("#game-out").append(`<button disabled class="rounded-circle" style="width:50px; height:50px; margin:5px; background-color: black; color:lightgreen; font-size:30px">${$("#game-out").children().length}</button>`)
            $("#outs").text(`Outs: ${$("#game-out").children().length - 1}/10`)
        }

        for (let i = 0; i < hangManWord.length; i++) {

            if (hangManWord[i] === guessedLetter) {
                $('#letters').children()[i].append(`${guessedLetter}`)
            }
        }

        if ($("#game-out").children().length === 11 || ($('#letters').children().text() === hangManWord.join(''))) {
            $(".button-letter").prop('disabled', true)
            $("#game-out").children().length === 11 ? $("#message").text(`You're out! The word was ${hangManWord.join('')}.`) : $("#message").text("You won!");
        }
    })

    function formSetUp() {
        for (let i = 0; i < hangManWord.length; i++) {

            $("#letters").append(`<button class="border-0" style="border-bottom: 7px solid black !important; background-color:transparent; color:lightgreen; margin-right:20px; font-size:55px; height: 71px; width:70px"></button>`)
        }
    }

    function printLetterButtons() {

        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

        for (let i = 0; i < letters.length; i++) {
            console.log('hi')
            $("#alphabet").append(`<button class="button-letter" style="background-color: lightgreen; width:45px;  font-size: 28px;height:60px; border-radius: 10px;">${letters[i]}</button>`)
        }
    }
})