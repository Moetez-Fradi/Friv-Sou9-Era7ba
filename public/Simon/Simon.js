const buttonColors = ["red", "blue", "green", "blue"];

let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 0;

const red = new Audio('./assets/red.mp3');
const blue = new Audio('./assets/blue.mp3');
const yellow = new Audio('./assets/yellow.mp3');
const green = new Audio('./assets/green.mp3');
const wrong = new Audio('./assets/wrong.mp3');

$("html").keypress(function(){
    if (!started){
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

function nextSequence(){
    userClickedPattern = [];
    level++;

    $("h1").html(`level ${level}`);

    let randomNumber = Math.floor(Math.random()*4);
    let randomChosenColour = buttonColors[randomNumber];
    gamePattern.push(randomChosenColour);
    $(`#${randomChosenColour}`).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
};

function checkAnswer(currentLevel){
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        if (userClickedPattern.length === gamePattern.length){
          setTimeout(function () {
            nextSequence();
          }, 1000);
        }
    } else {
        playSound("wrong");
        $(`body`).addClass("game-over");
        setTimeout(function(){
            $(`body`).removeClass("game-over");
        }, 200);
        setTimeout(function(){
            $(`body`).addClass("game-over");
        }, 200);
        setTimeout(function(){
            $(`body`).removeClass("game-over");
        }, 200);
        $("h1").html(`Game Over, Press Any Key to Restart`);
        startOver();
    }
}

$(".btn").click(function() {
    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);
    animatePress(userChosenColor);
    playSound(userChosenColor);
    checkAnswer(userClickedPattern.length-1);
});

function playSound(nameS){
    switch (nameS) {
        case "red":
            red.play();
            break;
        case "blue":
            blue.play();
            break;
        case "green":
            green.play();
            break;
        case "yellow":
            yellow.play();
            break;
        case "wrong":
            wrong.play();
            break;
    }
};
function animatePress(currentColor){
    $(`#${currentColor}`).addClass("pressed");
    setTimeout(function(){
        $(`#${currentColor}`).removeClass("pressed");
    }, 100);
};

function startOver(){
    level = 0;
    gamePattern = [];
    started = False;
}