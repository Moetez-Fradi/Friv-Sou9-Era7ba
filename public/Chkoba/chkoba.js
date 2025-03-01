import { BestMove } from "./engine.js";
import { pileChkoba, refChkoba } from "./cards.js"
import { shuffle, calculateScore, dealCards, renderBotHand, renderTable, renderHand, winCondition } from "./game_logic.js";

let pile = pileChkoba;
const ref = refChkoba;

let myFinalScore = 0;
let yourFinalScore = 0;

let yourPile = [];
let myPile = [];
let onTable = [];
let playerScore = [];
let botScore = [];
let myCkeyeb = 0;
let yourChkeyeb = 0;
let lastToTake = 1;

const heading = document.getElementById("score");
heading.textContent = `You: ${yourFinalScore} - Bot: ${myFinalScore}`;
shuffle(pile);

while (onTable.length < 4 && pile.length) {
    onTable.push(pile.pop());
}

function botTurn(x) {
    if (myPile.length > 0) {   

        let state = {
            "botPile": [...myPile],
            "onTable": [...onTable],
            "advScore": [...playerScore],
            "botScore": [...botScore],
            "myChkeyeb": myCkeyeb,
            "yourChkeyeb": yourChkeyeb,
            "turn": 1,
            "playerPile" : [...yourPile]
        };
        let botBestMove = BestMove(state);

        const botCardIndex = myPile.findIndex(card => card.id === botBestMove.card.id);
        const botCard = myPile[botCardIndex];
        const botCardId = myPile[botCardIndex].id;

        const botHand = document.getElementById('opponent');
        const botChosenCard = botHand.querySelector(`[id="${botCardId}"]`); 

        botChosenCard.classList.remove('hidden-card');
        botChosenCard.textContent = botCard.value;
        botChosenCard.classList.add("selected");

        const table = document.getElementById('table');

        if (botBestMove.taking.length != 0){
            botBestMove.taking.forEach(card => {
                let ChosenCardToTake = table.querySelector(`[id="${card.id}"]`); 
                ChosenCardToTake.classList.add("selected");
            });
        }

        setTimeout(() => {
            if (botBestMove.taking.length === 0){
                botHand.removeChild(botChosenCard);
                
                const tableCardDiv = document.createElement('div');
                tableCardDiv.classList.add('card');
                tableCardDiv.textContent = botCard.value;
                tableCardDiv.id = botCardId;  
                table.appendChild(tableCardDiv);
            } else {
                botBestMove.taking.forEach(card => {
                    let ChosenCardToTake = table.querySelector(`[id="${card.id}"]`); 
                    table.removeChild(ChosenCardToTake);
                });
                botHand.removeChild(botChosenCard);
            }
        }, 1000); 
        
        if (botBestMove.taking.length === 0){
            onTable.push(botCard);
        } else {
            onTable = onTable.filter(card => 
                !botBestMove.taking.some(takenCard => takenCard.id === card.id)
            );
            botScore.push(...botBestMove.taking);
            botScore.push(myPile[botCardIndex]);

            lastToTake = -1;

            if (onTable.length === 0) {
                setTimeout(() => {
                  alert("CHKOBA! chakeb 3lik lbot ye bot!");
                  myCkeyeb += 1;
                }, 200);
            }
        }
        myPile.splice(botCardIndex, 1);
    }
    else {
        console.log("bech t7ebni nal3eb ye bro")
    }
}

dealCards(yourPile, myPile, pile);
renderBotHand(myPile);
renderHand(yourPile);
renderTable(onTable);

const playerHand = document.getElementById('your-hand');
playerHand.addEventListener('click', handleSelectCard);

function handleSelectCard(event){
    const clickedCard = event.target;
    if (clickedCard.classList.contains('card')) {
        const previouslySelected = document.querySelector('.card.selected');
        if(clickedCard.classList.contains('selected')){
            clickedCard.classList.remove("selected");
        }
        else if (previouslySelected) {
            previouslySelected.classList.remove('selected');
        }
        else{
            clickedCard.classList.add("selected");
        }

    }
    const cardValue = clickedCard.textContent; 
    const cardId = clickedCard.getAttribute('data-id'); 
    const cardName = clickedCard.getAttribute('data-name');
};

const TableCards = document.getElementById('table');
TableCards.addEventListener('click', handlePlayerMove);
const playButton = document.getElementsByClassName('play');

function handlePlayerMove(event){
    const selectedCard = document.querySelector('#your-hand .selected');
    const clickedCard2 = event.target;
    if (selectedCard) {
        if (selectedCard.classList.contains('card')) {
            if (clickedCard2 && clickedCard2.classList.contains('card')) {
                clickedCard2.classList.toggle('selected');
            }   
        }
    };
};

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('play');
    playButton.addEventListener('click', () => {
        const tableDivs = document.querySelectorAll('#table .selected');
        const valuesArray = Array.from(tableDivs).map(div => div.id);
        const selectedHandCard = document.querySelector('#your-hand .selected');
        if(!selectedHandCard){
            alert("select A card!");
            return;
        }
        else if(valuesArray.length === 0){
            const card = yourPile.find(card => card.id === selectedHandCard.id);  

            yourPile = yourPile.filter(card => card.id !== selectedHandCard.id);  
            onTable.push(card);  
            playerHand.removeChild(selectedHandCard); 

            const tableCardDiv = document.createElement('div');
            tableCardDiv.classList.add('card');
            tableCardDiv.textContent = card.value;  
            tableCardDiv.id = card.id;
            document.getElementById('table').appendChild(tableCardDiv);

            selectedHandCard.style.pointerEvents = 'none';  
        } else {
            let sum = 0;
            valuesArray.forEach(selectedCardValue => {
                for(let i = 0; i < ref.length; i++){
                    if (ref[i].id === selectedCardValue){
                        sum += ref[i].points;
                    }
                }
            });
            let theCard;
            for(let i = 0; i < ref.length; i++){
                if (ref[i].id === selectedHandCard.id){
                    theCard = ref[i];
                }
            }
            let test = 0;
            if (sum == theCard.points ){
                if(theCard.points >= 8){
                    let x = theCard.points;
                    onTable.forEach(card => {
                        if (card.points === x && valuesArray.length != 1){
                            alert(`fama ${card.value} lezem thezha`);
                            test = 1;
                        }
                    });
                };
                if (test === 1){
                    test = 0;
                    return;
                }
                playerScore.push(theCard);
                lastToTake = 1;
                let cardValuesArray = [];
                valuesArray.forEach(card => {
                    for(let i = 0; i < 40; i++){
                        if (ref[i].id === card){
                            cardValuesArray.push(ref[i]);
                        }
                    }
                });
                playerScore = playerScore.concat(cardValuesArray);
                const allSelectedDivs = document.querySelectorAll('.selected');
                allSelectedDivs.forEach(div => div.remove());
                yourPile = yourPile.filter(card => card.id !== theCard.id);
                onTable = onTable.filter(tableCard => !valuesArray.includes(tableCard.id));
                if(onTable.length === 0){
                    alert("CHKOBAA! Biennnn");
                    yourChkeyeb += 1;
                }

            }
            else {
                alert("wrong move, try again");
                const selectedCards = document.querySelectorAll('.selected');
                selectedCards.forEach(card => card.classList.remove('selected'));
                return;
            }
        }
        botTurn(yourPile.length);
        setTimeout(()=>{
            if (myPile.length === 0 && yourPile.length === 0){
                if (pile.length === 0){
                    alert("wfet jarya!");
                    if (lastToTake === 1){
                        playerScore = playerScore.concat(onTable);
                    }
                    else {
                        botScore = botScore.concat(onTable);
                    }
                    let yourRoundScore = calculateScore(playerScore) + yourChkeyeb;
                    let myRoundScore = calculateScore(botScore) + myCkeyeb;
                    myFinalScore += myRoundScore;
                    yourFinalScore += yourRoundScore;
                    alert(`round Score: \n You: ${yourRoundScore} - Bot ${myRoundScore}`);
                    heading.textContent = `You: ${yourFinalScore} - Bot: ${myFinalScore}`;
                    let winning = winCondition(yourFinalScore, myFinalScore);
                    if(winning > 0){
                        if (winning === 1){
                            alert("congrats, you win.");
                        }
                        else{
                            alert("the bot wins! good luck next time");
                        }
                        location.reload();
                        return;
                    }
                    const allSelectedDivs = document.querySelectorAll('.card');
                    allSelectedDivs.forEach(div => div.remove());
                    pile = structuredClone(ref);
                    yourPile = [];
                    myPile = [];
                    onTable = [];
                    playerScore = [];
                    botScore = [];
                    myCkeyeb = 0;
                    yourChkeyeb = 0;
                    lastToTake = 1;

                    shuffle(pile);

                    while (onTable.length < 4 && pile.length) {
                        onTable.push(pile.pop());
                    };
                    dealCards(yourPile, myPile, pile);
                    renderBotHand(myPile);
                    renderHand(yourPile);
                    renderTable(onTable);

                } else {
                    shuffle(pile);
                    dealCards(yourPile, myPile, pile);
                    renderBotHand(myPile);
                    renderHand(yourPile);
                }
            }
        },1000);
    });
});