$(document).ready(function() {


    // Function for animating the start of the game, not needed but looks nice
    function setupGame() {
        // animate the grass and fence
        $("#game-screen").fadeIn(0, function () {
            // uses callbacks to nest the animations
            $("#fence").fadeIn(750, function() {
                $("#grass").fadeIn(500);
                $("#input-container").fadeIn(500);
            });
        });
        
    }

    // create the magic number
    function generateNumber() {
        var numberString = "";
        // keep making random numbers until we have 4 unique digits
        while( numberString.length < 4 ) {
            // create a number between 0-9
            var number = Math.floor(Math.random() * 10);
            
            // check to see if the number already exists in our numberString
            // we cannot have two of the same number
            if ( !numberString.includes(number) ) {
                numberString += number;
            }
        }
        return numberString;
    }

    // This makes a new element containing multiple elements
    // it puts your guess plus the amount of cows and bulls you had in
    function makeHistory(guess, cows, bulls) {
        // The start of the html string containing users guess
        htmlString = `<div class="history-guess">${guess}</div>`;
        // we need to know how many times total to loop so we add cows and bull
        var total = cows + bulls;
        for ( var j = 0; j < total; j++) {
            // check and see if there were cows in out total
            // this if/else if guarantees we do all cows first, then bulls
            if(cows > 0) {
                // if true, then we can make a cow element
                htmlString += '<div class="history-pic cow"></div>';
                // remove one cow from the list so we dont make to many
                cows--;
            // check and see if there were bulls in our total
            } else if (bulls > 0) {
                // add a bull element to the html string
                htmlString += '<div class="history-pic bull"></div>';
                // remove a bull so we dont make them forever
                bulls--;
            }
        }
        // Here we prepend (put the element on top of the others) inside
        // the history div
        $("#history").prepend(`<div class="history-entry">${htmlString}</div>`);
    }

    // removes the classes that have the background images
    // this allows us to refresh the screen every guess
    function clearCowsAndBulls() {
        $(`.entity`).removeClass("bull");
        $(`.entity`).removeClass("cow");
    }

    // adds a cow class with background image to one of the 4 divs in the HTML
    function addCow(id) {
        $(`#entity${id}`).addClass("cow");
    }

    // adds a bull class with background image to one of the 4 divs in the HTML
    function addBull(id) {
        $(`#entity${id}`).addClass("bull");
    }

    // Main number checking logic
    function checkNumbers(guess) {
        // need to keep track of how many cows and bulls we have
        var cows = 0;
        var bulls = 0;

        // first check for a win
        if (answer === guess) {
            // set the win flag to true;
            gameOver = true;
        }
        
        // loop over the guess
        for ( var i = 0; i < guess.length; i++) {

            // first check if the answer has a digit that matches the guess digit
            if ( answer.includes(guess[i]) ) {
                // if it does include it, lets check if its position matches
                // ( meaning its a bull)
                if ( answer[i] === guess[i] ) {
                    bulls++;
                } else {
                    // if it didnt match positions, its a cow becasue it still exists in the answer
                    cows++;
                }
            }
        }

        // Now that we have our new cows and bull calculated above, we must clear the old ones.
        clearCowsAndBulls();

        // call make history function
        makeHistory(guess, cows, bulls);

        // calculate total amount of times we need to loop and create a cow or bull
        var total = cows + bulls;
        for ( var j = 0; j < total; j++) {

            // if cows are not 0 this will be true
            if(cows) {
                // draw a cow
                addCow(j);
                // remove a cow from our count so "if(cows)" will eventually not be true
                cows--;
            } else if (bulls) {
                // this is an else if so that all the cows draw first
                // then we can start drawing bulls the same way
                addBull(j);
                bulls--;
            }
        }

        // add one to your total attempts
        attempts++;
        // update your attempts in the HTML
        $("#attempts").text(attempts);
        // Check the game over flag from above if true lets display the game over message
        if (gameOver) {
            displayWin();
        }
    }

    function showError(message) {
        // put the message into the html element
        $("#error-message").text(message);
        // show the element 
        $("#error-message").show();
        // set a timer for 2 seconds then hide the element
        setTimeout(function(){ 
            $("#error-message").hide();
        }, 2000);
    }

    // validation function
    function validate() {
        // get the guess
        var guess = $("#user-guess").val();
        //convert for a number test
        var numTest = parseInt(guess);
        // if its not a number show error
        if (typeof numTest !== "number" || isNaN(numTest)) {
            showError("Must be a number!");
            return false;
        }
        // check if guess is 4 numbers
        if(guess.length !== 4) {
            showError("Input  less  than  4  digits!");
            return false;
        }
        
        // check if guess is 4 unique digits
        for ( var i = 0; i < guess.length; i++ ) {
            // check to see if the index of the guessed number is the same if not its a duplicate
            // [ 5, 4, 4, 6]
            // on the 3rd time looping the loop will check for the first index of "4", which will be 1 which wont match the index of 2
            if( guess.indexOf(guess[i]) !== i) {
                showError("Input  has  duplicate  digits!");
                return false;
            }
        }

        // if nothing fails then its good
        return true;

    }

    // displays the win messgage
    function displayWin() {
        $("#winner-message").show();
    }

    // runs the game logic
    function play() {
        input = $("#user-guess").val();
        checkNumbers(input);
    }

    // Setup Game

    //Input Handler
    // when the user presses enter fire off this workflow
    $(document).on('keypress',function(e) {
        if(e.key === "Enter") {
            // first validate and check if user won, so we dont keep playing when its over or input is invalid
            if (validate() && !gameOver) {
                // so you can cheat during testing
                console.log(answer);
                play();
            }
        }
    });

    // gets the user passed the instructions screen
    $("#play").click(function (e) {
        e.preventDefault();
        //create the first magic number
        answer = "" + generateNumber();
        // hide the start screen
        $("#start-screen").hide();
        // show the game screen
        setupGame();
        
    })
    
    // when the user wins this button appears and can be clicked to start over
    $("#play-again").click(function (e) {
        e.preventDefault();
        // create a new magic number
        answer = "" + generateNumber();
        // hide the winner message
        $("#winner-message").hide();
        // clear all the cows and bulls images
        clearCowsAndBulls();
        // reset the attempts count
        $("#attempts").text(0);
        attempts = 0;
        // clear users input
        $("#user-guess").val("");
        // clear the history
        $("#history").empty()
        // reset the game over flag so we can play again
        gameOver = false;
    })

    var answer = '';
    var attempts = 0;
    var gameOver = false;

    //GAME LOGIC

    console.log(answer);



});