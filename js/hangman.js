$(() => {
    const wordsToChooseFrom = ['YUMMY','BEVERAGE', 'SYMPHONY', 'ATTITUDE', 'CONTROL', 'KETCHUP', 'SPRINKLE', 'FLOWER', 'MAGIC', 'COMPUTER', 
    'CEREAL', 'BRACELET', 'SLINKY', 'ELEPHANT', 'AWESOME', 'MOSQUITO', 'PLACEMAT', 'STYLE','AQUIRE', 'SQUIRT', 'FILTHY','GHOST','GRASSHOPPER'
,'WONDERFUL','FASCINATING','SHOES','PROGRAM','PAYMENT','CONNECTION','PILLOW','WATCH','SWEATER','MUSTARD','GIRAFFE',
'SLINKY','OCTOPUS','GORILLA','CAMERA','MEMORY','INDEX','IMAGE','EXPLORER','REMIND','MONEY','ENGAGEMENT','ENFORCE',
'EMOJI','JOYOUS','LOCAL','BAKERY','WAITER','LEMONADE','ATMOSPHERE','SHOULDER','CHILDREN','DISABLED','LENGTH',
'HEIGHT','WEIGHT','INCLUDES','BORDER','BACKGROUND','SAUCE','JUICE','PRETZEL','BREIFCASE','LEATHER','STUDENT',
'DRASTIC','CHARGE','DISGUISE','BINDER','SOCCER','ALONE','AQUIRE','DESPAIR','AMAZING','FROWN','GRINNING','JUMPER',
'PARAGRAPH'];
    const hangManWord = wordsToChooseFrom[Math.floor(Math.random() * wordsToChooseFrom.length)].split('')

    const allowedOuts = 10;

    printLetterButtons()
    formSetUp();


    $("body").on("click", ".button-letter", function () {

        let guessedLetter = $(this).text();
        $(this).prop('disabled', true)
       // $(this).hide();

        if (!hangManWord.includes(guessedLetter)) {

            $("#game-out").append(`<button disabled class="rounded-circle" style="width:50px; height:50px; margin:5px; background-color: black; color:lightgreen; font-size:30px">${$("#game-out").children().length}</button>`)
            $("#outs").text(`Outs: ${$("#game-out").children().length - 1}/${allowedOuts}`)
        }

        for (let i = 0; i < hangManWord.length; i++) {

            if (hangManWord[i] === guessedLetter) {
                $('#letters').children()[i].append(`${guessedLetter}`)
            }
        }

        if ($("#game-out").children().length === +`${allowedOuts + 1}` || ($('#letters').children().text() === hangManWord.join(''))) {
            $(".button-letter").prop('disabled', true)
            $("#game-out").children().length === +`${allowedOuts + 1}` ? $("#message").text(`You're out! The word was ${hangManWord.join('')}.`) : $("#message").text("You won!");
        }
    })

    function formSetUp() {
        hangManWord.forEach(() => {
            $("#letters").append(`<button class="border-0" style="border-bottom: 7px solid black !important; background-color:transparent; color:lightgreen; margin-right:20px; font-size:55px; height: 71px; width:70px"></button>`)
        })
    }

    function printLetterButtons() {
        let letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

        for (let i = 0; i < letters.length; i++) {
            $("#alphabet").append(`<button class="button-letter" style="background-color: lightgreen; width:45px;  font-size: 28px;height:60px; border-radius: 10px;">${letters[i]}</button>`)
        }
    }
})