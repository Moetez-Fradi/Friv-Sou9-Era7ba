import {refChkoba} from "./cards.js"

const ref = refChkoba;

export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }
};

export function calculateScore(array){
    if (array.length === 0){
        return 0;
    }
    console.log("calculi")
    console.log(array);
    let roundScore = 0;
    let sbou3 = 0;
    let lcarta = array.length;
    let stout = 0;
    let dineri = 0;
    for(let i = 0; i < array.length; i++){
        for (let j = 0; j < 40; j++){
            if (array[i] === ref[j].id){
                array[i] = ref[j];
            }
        }
    }
    array.forEach(card => {
        if (card.value.includes('♦️')){
            dineri += 1;
        }
        if (card.value === "7♦️"){
            roundScore += 1;
        }
        if (card.value.includes('6')){
            stout +=1;
        }
        if (card.value.includes('7')){
            sbou3 +=1;
        }
    });
    if (dineri > 5){
        roundScore += 1;
        console.log("dineri " + dineri)
    }
    if (sbou3 > 2){
        roundScore += 1;
        console.log("sbou3 "+ sbou3)
    }
    else if (sbou3 === 2){
        if (stout > 2){
            roundScore += 1;
            console.log("stout " + stout)
        }
    }
    if(lcarta > 20){
        roundScore++;
        console.log("lcarta " + lcarta)
    }
    return roundScore;
};

export function dealCards(yourPile, myPile, pile) {
    while (yourPile.length < 3 && pile.length) {
        yourPile.push(pile.pop());
    }
    while (myPile.length < 3 && pile.length) {
        myPile.push(pile.pop());
    }
};

export function renderHand(yourPile) {
    const handContainer = document.getElementById('your-hand');
    handContainer.innerHTML = '';  

    yourPile.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.textContent = card.value; 
        cardDiv.id = card.id;
        handContainer.appendChild(cardDiv);
    });
};

export function renderBotHand(myPile) {
    const botHandContainer = document.getElementById('opponent');
    botHandContainer.innerHTML = '';  

    myPile.forEach((card) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.classList.add('hidden-card');
        cardDiv.id = card.id;
        cardDiv.textContent = "";  
        cardDiv.id == card.id;
        botHandContainer.appendChild(cardDiv);
    });
};

export function renderTable(onTable){
    const tableContainer = document.getElementById('table');

    onTable.forEach((card) => {
        const tableCardDiv = document.createElement('div');
        tableCardDiv.classList.add('card');
        tableCardDiv.id = card.id;
        tableCardDiv.textContent = card.value;
        tableContainer.appendChild(tableCardDiv);
    });
};

export function winCondition(n1, n2){
    if (n1 >= 11){
        if (n2 < 11){
            return 1;
        }
        else if (n1-n2 < 2 && n2-n1 < 2){
            return 0;
        }
        else{
            return 1;
        }
    }
    else if (n2 >= 11){
        return n2;
    }
    else{
        return 0;
    }
};