import { refChkoba } from "./cards.js"

const ref = refChkoba;

class stateNode {
    constructor(S, parent){
        this.parent = parent;
        this.state = S;
        this.next = [];
        this.eval = evaluateState(S);
        this.end = isOver(S);
    }
    appendState(childNode, move) {
        this.next.push({ node: childNode, way: move });
    }
};

function weightedSample(cards, count = 3) {
    let result = [];
    while (result.length < count && cards.length > 0) {
        let index = Math.floor(Math.random() * cards.length);
        result.push(cards[index]); 
        cards.splice(index, 1);
    }
    return result;
};

function guessCards(x, myPile, onTable, botScore, playerScore) {
    if (x === 0) {
        return [];
    }

    // Filter out cards that are already on the table, in my pile, or in scores
    let availableCards = ref.filter(card => 
        !onTable.some(row => row.id === card.id) && 
        !myPile.some(row => row.id === card.id) &&
        !playerScore.some(row => row.id === card.id) &&
        !botScore.some(row => row.id === card.id)
    );

    // Count occurrences of each card point value
    let occurences = {};
    for (let i = 1; i <= 10; i++) {
        occurences[i] = [];
    }
    availableCards.forEach(card => {
        if (occurences[card.points] !== undefined) {
            occurences[card.points].push(card); // Store card objects, not just counts
        }
    });

    // Sort by frequency (most frequent first)
    let sortedOccurrences = Object.entries(occurences)
        .sort((a, b) => b[1].length - a[1].length)
        .reduce((acc, [key, cards]) => {
            acc[key] = cards; // Store the array of cards for each point value
            return acc;
        }, {});

    // Flatten the sorted occurrences into a single array of cards
    let cardPool = Object.values(sortedOccurrences).flat();

    // Sample x cards from the pool
    return weightedSample(cardPool, x);
};

function calculateCurrentCombinations(onTable1){
    const numCards = onTable1.length;
    if(numCards === 0){
        return [];
    }
    const totalCombinations = 1 << numCards;

    let sums = [];

    for (let i = 1; i < totalCombinations; i++) { 
        let sum = 0;
        let cardIds = [];  

        for (let j = 0; j < numCards; j++) {
            if (i & (1 << j)) { 
                sum += onTable1[j].points; 
                cardIds.push(onTable1[j]); 
            }
        }
        if (sum <= 10) sums.push({ 'sum': sum, cardIds: [...cardIds] });
    }
    return sums;
};

function filterIllegalMoves(onTable, legalMoves){
    let problamatic = [];
    legalMoves.forEach(move => {
        if(move.card.points > 7){
            onTable.forEach(card => {
                if(card.points === move.card.points && move.taking.length != 1){
                    problamatic.push(move);
                }
            });
        };
    });

    if(problamatic.length === 0){
        return legalMoves;
    };

    return legalMoves.filter(move => {
        if (problamatic.includes(move)) {
            return false; 
        }
        return true;
    });
};

function legalMoves(kaffek, onTable){
    let sums = calculateCurrentCombinations(onTable);
    let legalMoves = [];
    kaffek.forEach(card => {
        let test = false;
        sums.forEach(sum => {
            if(sum.sum === card.points){
                legalMoves.push({'card':card, 'taking':sum.cardIds});
                test = true;
            }
        });
        if (!test){
            legalMoves.push({'card':card, 'taking':[]});
        }
    });

    legalMoves = filterIllegalMoves(onTable, legalMoves);

    return legalMoves;
};

function calculateExpected(scoreArray, remaining) {
    let expected = 0;

    // l7aya win  
    const l7aya = scoreArray.some(card => card.value === "7♦️");
    if (l7aya) expected += 1;

    // dineri 
    const dineri = scoreArray.filter(card => card.value.includes('♦️')).length;
    const remainingDineri = remaining.filter(card => card.value.includes('♦️')).length;
    const dineriPossible = dineri + remainingDineri;
    if (dineriPossible >= 5) {
        const neededDineri = Math.max(5 - dineri, 0);
        const probabilityD = hypergeometricProbability(remaining.length, remainingDineri, neededDineri);
        expected += probabilityD;
    }

    // lbermila ye 8oli
    const sbou3 = scoreArray.filter(card => card.value.includes('7')).length;
    const remainingSbou3 = remaining.filter(card => card.value.includes('7')).length;
    const totalSbou3 = sbou3 + remainingSbou3;

    if (totalSbou3 >= 3) {
        const neededSbou3 = Math.max(3 - sbou3, 0);
        const probability7 = hypergeometricProbability(remaining.length, remainingSbou3, neededSbou3);
        expected += probability7;

    } else if (totalSbou3 === 2) {
        const stout = scoreArray.filter(card => card.value.includes('6')).length;
        const remainingStout = remaining.filter(card => card.value.includes('6')).length;
        const totalStout = stout + remainingStout;

        if (totalStout >= 3) {
            const neededStout = Math.max(3 - stout, 0);
            const probability6 = hypergeometricProbability(remaining.length, remainingStout, neededStout);
            expected += probability6;
        } else if (totalStout === 2) {
            expected += 0;
        }
    }

    const currentCards = scoreArray.length;
    const neededCards = Math.max(20 - currentCards, 0);
    if (neededCards > 0) {
        const probabilityCards = hypergeometricProbability(remaining.length, remaining.length, neededCards);
        expected += probabilityCards;
    } else {
        expected += 1;
    }

    return Math.min(expected, 4); 
};

// proba li 9ritha fel fac sol7et finally
function hypergeometricProbability(totalRemaining, successesInRemaining, neededSuccesses) {
    if (neededSuccesses === 0) return 1;
    if (successesInRemaining < neededSuccesses) return 0;

    let probability = 1;
    for (let i = 0; i < neededSuccesses; i++) {
        probability *= (successesInRemaining - i) / (totalRemaining - i);
    }
    return probability;
};

// the better the eval function the better the bot plays
function evaluateState(S){
    return calculateExpected(S.Mekeltek, S.remaining) + S.chkeybek - calculateExpected(S.Mekelti, S.remaining) - S.chkeybi;
};

function nextState(S, move) {
    let newS = { 
        ...S,
        Bot: [...S.Bot],
        playerExpectedHand: [...S.playerExpectedHand],
        Table: [...S.Table],
        Mekelti: [...S.Mekelti],
        Mekeltek: [...S.Mekeltek],
        remaining: [...S.remaining]
    };

    newS.turn = S.turn === 1 ? 0 : 1;

    if (move.taking.length === 0) {
        if (S.turn === 1) {
            newS.Bot = newS.Bot.filter(card => card.id !== move.card.id);
        } else {
            newS.playerExpectedHand = newS.playerExpectedHand.filter(card => card.id !== move.card.id);
        }
        newS.Table = [...newS.Table, move.card]; 
    } else {
        if (S.turn === 1) {
            newS.Bot = newS.Bot.filter(card => card.id !== move.card.id);
            newS.Mekelti = [...newS.Mekelti, move.card];
        } else {
            newS.playerExpectedHand = newS.playerExpectedHand.filter(card => card.id !== move.card.id);
            newS.Mekeltek = [...newS.Mekeltek, move.card]; 
        }

        let newTable = [...newS.Table];
        move.taking.forEach(card => {
            if (S.turn === 1) {
                newS.Mekelti = [...newS.Mekelti, card]; 
            } else {
                newS.Mekeltek = [...newS.Mekeltek, card];
            }
            newTable = newTable.filter(tab => tab.id !== card.id);
        });
        newS.Table = newTable;

        if (newS.Table.length === 0) {
            if (S.turn === 1) {
                newS.chkeybi += 1;
            } else {
                newS.chkeybek += 1;
            }
        }
    }
    return newS;
};

function isOver(S){
    return S.Bot.length === 0 && S.playerExpectedHand.length === 0;
};

function recursiveCreateTree(node){
    if (node.end === true){
        return;
    }
    let nextMoves = node.state.turn ? legalMoves(node.state.Bot, node.state.Table) : legalMoves(node.state.playerExpectedHand, node.state.Table);
    nextMoves.forEach(move => {
        let newState = nextState(node.state, move);
        let childNode = new stateNode(newState, node);
        node.appendState(childNode, move);
        recursiveCreateTree(childNode);
    });
};

function Minimax(node, maximize){
    if (node.end || node.state.Bot.length === 0){
        return node.eval;
    }
    if (maximize){
        let max = -Infinity;
        node.next.forEach(child => {
            let score = Minimax(child.node, !maximize);
            max = Math.max(score, max);
        });
        return max;
    }
    else {
        let min = Infinity;
        node.next.forEach(child => {
            let score = Minimax(child.node, !maximize);
            min = Math.min(score, min);
        });
        return min;
    }
};

function printTreeDFS(node, depth = 0) {
    // // Print the current node
    // console.log(`Depth ${depth}:`, node.state);
    // console.log("Eval:", node.eval);
    // console.log("End:", node.end);
    // console.log("------------------");

    // // Recursively print child nodes
    node.next.forEach(child => {
        printTreeDFS(child.node, depth + 1);
    });
}

export function BestMove(state){
    let Bot = state.botPile;
    let Table = state.onTable;
    let Mekelti = state.botScore;
    let Mekeltek = state.advScore;
    let chkeybi = state.myChkeyeb;
    let chkeybek = state.yourChkeyeb;
    let turn = state.turn;

    // let playerExpectedHand = guessCards(Bot.length - 1, Bot, Table, Mekelti, Mekeltek);
    let playerExpectedHand = state.playerPile;

    let remaining = ref.filter(cards => 
        !Table.some(row => row.id === cards.id) && 
        !Bot.some(row => row.id === cards.id) &&
        !Mekelti.some(row => row.id === cards.id) &&
        !Mekeltek.some(row => row.id === cards.id) &&
        !playerExpectedHand.some(row => row.id === cards.id)
    );

    let S = {Bot, playerExpectedHand, Table, remaining, Mekelti, Mekeltek, chkeybi, chkeybek, turn};

    console.log(evaluateState(S));
    
    let initialState = new stateNode(S, null);

    recursiveCreateTree(initialState);
    
    let bestScore = Infinity;
    let bestMove = null;
    for (let child of initialState.next) {
        let score = Minimax(child.node, false);
        if (score < bestScore) {
            bestScore = score;
            bestMove = child.way;
        }
    }
    return bestMove;
};
