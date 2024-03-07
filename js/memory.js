$(() => {
    let flippedCards = [];

    $(".pic").attr('src', "/images/background.jpg");
    setUpGame();

    $("body").on("click", '.pic', function () {
        let img = $(this)

        if (flippedCards.length === 1 && flippedCards[0].attr('id') === img.attr('id')) {
            return;
        }

        if (flippedCards.length < 2) {
            img.attr('src', img.attr("name"));
            flippedCards.push(img)
            return;
        }

        checkIfMatch();

        if ($("#score").text() === '7/7') {
            $("#div-pic").prepend(`<h1 style="color:white" class="text center"> You won!! You got all the matches in ${$("#rounds").text()} rounds! </h1>`)
            return;
        }

        flippedCards = [];
        $(".pic").attr('src', "/images/background.jpg");
        $("#rounds").text(+$("#rounds").text() + 1)
    });

    function setUpGame() {
        let matchesSet = ["/images/bear.jpg", "/images/chick.jpg", "/images/dog.jpg", "/images/giraffe.jpg", "/images/parrot.jpg", "/images/squirrel.jpg", "/images/leapord.jpg",
            "/images/bear.jpg", "/images/chick.jpg", "/images/dog.jpg", "/images/giraffe.jpg", "/images/parrot.jpg", "/images/squirrel.jpg", "/images/leapord.jpg"]

        for (let i = 1; i <= 14; i++) {
            let name = matchesSet[Math.floor(Math.random() * matchesSet.length)]
            matchesSet.splice(matchesSet.lastIndexOf(name), 1);

            $(`#${i}`).attr('name', name)
        }
    }

    function checkIfMatch() {
        if (flippedCards[0].attr('src') === flippedCards[1].attr('src')) {

            $("#div-pic").append(`<img src="${flippedCards[0].attr("src")}" style="width:100px; height:100px; margin-right:8px; object-fit: cover" />`)
            flippedCards.forEach(b => b.removeClass("pic") && b.attr('src', "/images/backgroundbrown.png"))
            $("#score").text(`${$("#div-pic").children().length}/7`)

        }
    };

})
