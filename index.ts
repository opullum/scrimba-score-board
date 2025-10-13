
function moveAddPanel() {
    const gridContainer = document.querySelector('.scores');
    const addPanelElem = gridContainer.querySelector('.new-panel-btn');
    console.log(addPanelElem);
    gridContainer.appendChild(addPanelElem);

    console.log(panelScores.length);
    if (panelScores.length >= MAXIMUM_PANELS) {
        console.log("Reached here!");
        addPanelElem.style.display = 'none';
    } else { addPanelElem.style.display = 'inline-block'; }
}

// Appends new panel to the Grid
function newPanel(panelName=null) {

    if (panelName == null) {
        panelName = prompt("Enter a name for the new panel");
        console.log(panelName == "");
    }

    /**
     * Panel Format (divs):
     * score-panel
     *  score-panel-title
     *  score-panel-display
     *      score-text
     *  score-panel-btns
     *      increment-btns
     *          panel-btns
     *      remove-panel-btn
     */

    const scores = document.getElementById('scores-grid');

    // TODO: Condense each of these into a single function to create a new element in the DOM
    // Create the score panel (holds all panel elements)
    const panelDiv = document.createElement('div');
    panelDiv.classList.add('score-panel');
    scores.appendChild(panelDiv);

    // Score panel title (score-panel-title)
    const panelTitle = document.createElement('h1');
    panelTitle.textContent = `${panelName}`;
    panelTitle.classList.add('score-panel-title');
    panelDiv.appendChild(panelTitle);
    
    // Score panel display (score-panel-display)
    const panelDisplay = document.createElement('div');
    panelDisplay.classList.add('score-panel-display');
    panelDiv.appendChild(panelDisplay);

    // Score text (score-text : child of score-panel-display)
    const displayText = document.createElement('h2');
    displayText.textContent = "0";
    displayText.classList.add('score-text');
    panelDisplay.appendChild(displayText);
    
    // Container to hold score panel buttons (score-panel-btns)
    const panelButtons = document.createElement('div');
    panelButtons.classList.add('score-panel-btns');
    panelDiv.appendChild(panelButtons);
    
    // Container to hold increment buttons (increment-btns : child of score-panel-buttons)
    const incrementButtons = document.createElement('div');
    incrementButtons.classList.add('increment-btns');
    panelButtons.appendChild(incrementButtons);
    
    // Creating three increment buttons (panel-btn : children of increment-btns)
    const firstButton = document.createElement('button');
    firstButton.classList.add('panel-btn');
    firstButton.textContent = "+1";
    incrementButtons.appendChild(firstButton);

    const secondButton = document.createElement('button');
    secondButton.classList.add('panel-btn');
    secondButton.textContent = "+2";
    incrementButtons.appendChild(secondButton);
    
    const thirdButton = document.createElement('button');
    thirdButton.classList.add('panel-btn');
    thirdButton.textContent = "+3";
    incrementButtons.appendChild(thirdButton);

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-panel-btn');
    removeButton.textContent = "Remove";
    panelButtons.appendChild(removeButton);
    
    // Attaching event handlers to newly created buttons (panel-btn and remove-panel-btn)
    firstButton.onclick = (event) => addScore(event, 1);
    secondButton.onclick = (event) => addScore(event, 2);
    thirdButton.onclick = (event) => addScore(event, 3);

    removeButton.onclick = (event) => removePanel(event);
    
    panelScores.push(0);
    moveAddPanel();
}

function getPanelIndex(panelElem) {
    const grid = panelElem.parentNode; // The grid container
    const children = Array.from(grid.children);
    return children.indexOf(panelElem);
}

function resetAllPanels() {
    document.querySelectorAll('.score-text').forEach((panelText) => {
        panelText.textContent = "0";
    })
    for (let i = 0; i < panelScores.length; i++) {
        panelScores[i] = 0;
    }
}

function removePanel(event) {
    const panelGrid = document.getElementById('scores-grid');
    const buttonElem = event.currentTarget;
    const panel = buttonElem.closest('.score-panel');
    const index = getPanelIndex(panel);
    panelScores.splice(index, 1);
    panelGrid.removeChild(panel);
    moveAddPanel();
}

function addScore(event, increment) {
    const buttonElem = event.currentTarget;
    console.log(buttonElem);
    // const panelElem = buttonElem.parentNode.parentNode.parentNode;
    const panelElem = buttonElem.closest('.score-panel');
    const displayText = panelElem.querySelector('.score-panel-display h2');
    const scoresIndex = getPanelIndex(panelElem);

    panelScores[scoresIndex] += increment;
    displayText.textContent = `${panelScores[scoresIndex]}`;

    if (scoresIndex == 0 || scoresIndex == 1) { highlightWinning(); }
}

function formatTime(timeSeconds) {
    let remainingMinutes = Math.floor(timeSeconds / 60);
    let remainingSeconds = timeSeconds % 60;
    return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function highlightWinning() {
    let homePanel = document.getElementById('home-team').querySelector('.score-panel-display');
    let guestPanel = document.getElementById('guest-team').querySelector('.score-panel-display');

    console.log("reached here");
    console.log(`Home: ${panelScores[0]} Guest: ${panelScores[1]}`);

    if (panelScores[0] > panelScores[1]) {
        console.log("1");
        homePanel.style.boxShadow = "0 0 20px rgba(38, 131, 63, 0.5)";
        guestPanel.style.boxShadow = 'none';
    } else if (panelScores[0] < panelScores[1]) {
        console.log("2");
        homePanel.style.boxShadow = 'none';
        guestPanel.style.boxShadow = "0 0 20px rgba(38, 131, 63, 0.5)";
    } else {
        console.log("3");
        homePanel.style.boxShadow = 'none';
        guestPanel.style.boxShadow = 'none';
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            timerElem.textContent = formatTime(currentTime);
        }
    }, 1000);
    return timerInterval;
}

function stopTimer() {
    clearInterval(timerInterval);
}

function setTime() {
    let retrievedTime = prompt("Enter the time in seconds");
    currentTime = Number(retrievedTime);
}

function newGame() {
    currentTime = 300;
    resetAllPanels();
    highlightWinning();
}

function pauseTimer() {
    let pauseBtn = document.getElementById("pauseBtn");
    running = !running;
    if (!running) {
        stopTimer();
        pauseBtn.textContent = "Resume";
    } else {
        timerInterval = startTimer();
        pauseBtn.textContent = "Pause";
    }
}

document.querySelectorAll('.increment-btns').forEach(panelBtns => {
    const btns = panelBtns.querySelectorAll('.panel-btn');
    if (btns.length === 3) {
        btns[0].onclick = (event) => addScore(event, 1);
        btns[1].onclick = (event) => addScore(event, 2);
        btns[2].onclick = (event) => addScore(event, 3);
    }
});

const MAXIMUM_PANELS = 9;
let panelScores = [0, 0, 0, 0];
let currentTime = 300;
let timerElem = document.querySelector('.timer-body-label');

let timerInterval;
let running = true;
startTimer();



