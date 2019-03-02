let qTable = {};
const learningRate = 0.1; // Learning Rate
const discountFactor = 0.9; // Discount Factor of Future Rewards
let randomize = 0.1; // Randomization Rate on Action

const availableActions = ['up', 'down', 'left', 'right'];

let died = 0;
let score = 0;
let bestScore = 0;
let interval = 60;
let gen = 0;

function getActualState() {
    /*
    const snakePos = getSnakePos();
    const foodPos = getFoodPos();
    const tailPos = getTailPos();
    const distFood = getDistFood();
    const tileLength = getTileLength();

    const stateName = `${(foodPos.x - snakePos.x)/16},${(foodPos.y - snakePos.y)/16},${(tailPos.x - snakePos.x)/16},${(tailPos.y - snakePos.y)/16},${distFood.x},${distFood.y}`;
    // const stateName = `${(tailPos.x - snakePos.x)/16},${(tailPos.y - snakePos.y)/16},${distFood.x},${distFood.y}`;
    */

    const stateName = `${whatIsForward()},${whatIsLeft()},${whatIsRight()}`;

    return stateName;
}

function getQTable(stateName) {
    if (qTable[stateName] === undefined) {
        qTable[stateName] = { 'up': 0, 'down': 0, 'left': 0, 'right': 0 };
    } else {
        return qTable[stateName];
    }

    return qTable[stateName];
}

function getBestAction(stateName) {
    const Q = getQTable(stateName);

    let maxValue = Q[availableActions[0]];
    let choseAction = availableActions[0];

    if (Math.random() < randomize) {
        choseAction = availableActions[getRandomInt(0, 4)];
        return choseAction;
    }

    for (let i = 0; i < availableActions.length; i++) {
        if (Q[availableActions[i]] > maxValue) {
            maxValue = Q[availableActions[i]];
            choseAction = availableActions[i];
        }
    }

    if (maxValue === 0) {
        choseAction = availableActions[getRandomInt(0, 4)];
    }
    
    return choseAction;
}

function updateQTable(actualStateName, nextStateName, reward, action) {
    const q0 = getQTable(actualStateName);
    const q1 = getQTable(nextStateName);

    const newValue = reward + discountFactor * Math.max(q1.up, q1.down, q1.left, q1.right) - q0[action];
    qTable[actualStateName][action] = q0[action] + learningRate * newValue;
}

function trainSnake() {
    const actualStateName = getActualState();
    const action = getBestAction(actualStateName);
    const reward = game(action);

    if (reward === 10) {
        score++;
        if (score > bestScore) {
            bestScore = score;
        }
    } else if (reward === -10) {
        score = 0;
        died++;
    }

    const nextStateName = getActualState();
    updateQTable(actualStateName, nextStateName, reward, action);
}


var slider = document.getElementById("slider");
var scoreHtml = document.getElementById("score");
var bestScoreHtml = document.getElementById("bestscore");
var genHtml = document.getElementById("gen");

function changeInterval() {
    return slider.value;
}

function setScore() {
    scoreHtml.innerText = 'Score : ' + score;
    bestScoreHtml.innerText = 'Best score : ' + bestScore;
    genHtml.innerHTML = 'Gen : ' + gen;
}

function runTrainer() {
    while(died < 1000) {
        if(initializeGame()) {
            game('up');
        } else {
            trainSnake();
        }
    }

    gen++;
    randomize != 0 ? randomize -= 0.01: randomize = 0;

    died = 0;
    showGame();
}

function showGame() {
    if(initializeGame()) {
        game('up');
    } else {
        trainSnake();
    }

    if(died !== 1) {
        setScore();
        interval = changeInterval();
        setTimeout(showGame, interval);
    } else {
        console.log(qTable);
        runTrainer();
    }
}

runTrainer();