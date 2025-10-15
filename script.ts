/**
 * Adds a new panel to the page. If the maximum panels have been reached
 * then hide the panel addition element.
 * @returns void
 */

const moveAddPanel = (): void => {
    const gridContainer : HTMLElement | null = document.querySelector('.scores')
    if (!gridContainer) {
        console.error("Unable to find gridContainer for function moveAddPanel()");
        return;
    }

    const addPanelElem: HTMLElement | null = gridContainer.querySelector('.new-panel-btn');
    if (!addPanelElem) {
        console.error("Unable to find addPanelElem for function moveAddPanel()");
        return;
    }

    gridContainer.appendChild(addPanelElem);

    if (panelScores.length >= MAXIMUM_PANELS) {
        addPanelElem.style.display = 'none';
    } else { 
        addPanelElem.style.display = 'inline-block'; 
    }
}

const addElem = (
    type     : string,
    parent?  : HTMLElement,
    text?    : string | null,
    classes? : string,
    onclick? : Function
) => {
    const newElem = document.createElement(type);
    if (parent)   { parent.appendChild(newElem); }
    if (classes)  { newElem.classList.add(classes); }
    if (text)     { newElem.textContent = text; }
    if (onclick)  { newElem.onclick = (event) => onclick(event); }
}

 /*
 * Creates a new panel. Used dynamically when the add panel button is pressed.
 * @param panelName The name of the new panel.
 * @returns void
 */
const newPanel = (panelName : string | null): void => {

    if (panelName == null) {
        while (panelName == null) {
            panelName = prompt("Enter a name for the new panel");
        }
    }
    const scores = document.getElementById('scores-grid');
    if (!scores) {
        console.error("Unable to find scores grid for function newPanel()");
        return;
    }

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

const getPanelIndex   = (panelElem : HTMLElement): number | undefined => {
    const grid        = panelElem.parentNode; // The grid container
    if (!grid) {
        console.error("Unable to find grid element in getPanelIndex()");
        return;
    }
    const  children   = Array.from(grid.children);
    return children.indexOf(panelElem);
}

const resetAllPanels = (): void => {
    document.querySelectorAll('.score-text').forEach((panelText) => {
        panelText.textContent = "0";
    })
    for (let i = 0; i < panelScores.length; i++) {
        panelScores[i] = 0;
    }
}

const removePanel = (event: Event): void => {
    const panelGrid:  HTMLElement | null = document.getElementById('scores-grid');
    const buttonElem: HTMLElement | null = event.currentTarget as HTMLElement | null;

    if (!buttonElem || !panelGrid) {
        console.error("Unable to find required elements for removePanel()");
        return;
    }

    const panel  :    HTMLElement | null  = buttonElem.closest('.score-panel');
    let index    :    number | undefined;

    if (panel) { index = getPanelIndex(panel); } 
    if (!panel || !index) {
        console.error("Unable to find required elements for removePanel()");
        return;
    } 

    panelScores.splice(index, 1);
    panelGrid.removeChild(panel);
    moveAddPanel();
}

const addScore = (event: Event, increment: number) =>  {
    const buttonElem = event.currentTarget;
    console.log(buttonElem);
    // const panelElem = buttonElem.parentNode.parentNode.parentNode;
    const panelElem   = buttonElem.closest('.score-panel');
    const displayText = panelElem.querySelector('.score-panel-display h2');
    const scoresIndex = getPanelIndex(panelElem);

    panelScores[scoresIndex] += increment;
    displayText.textContent = `${panelScores[scoresIndex]}`;

    if (scoresIndex == 0 || scoresIndex == 1) { highlightWinning(); }
}

function formatTime(timeSeconds: number) {
    let remainingMinutes = Math.floor(timeSeconds / 60);
    let remainingSeconds = timeSeconds % 60;
    return `${remainingMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Modifies the Home Team and Guest Panel teams with a slight glow to highlight the
 * current winner team (based on points)
 * @returns none
 */
const highlightWinningTeam = () : void => {
    let homePanel  : HTMLElement = document.getElementById('home-team').querySelector('.score-panel-display');
    let guestPanel : HTMLElement = document.getElementById('guest-team').querySelector('.score-panel-display');

    if (panelScores[0] > panelScores[1]) {
        homePanel.style.boxShadow  = "0 0 20px rgba(38, 131, 63, 0.5)";
        guestPanel.style.boxShadow = 'none';
    } else if (panelScores[0] < panelScores[1]) {
        homePanel.style.boxShadow  = 'none';
        guestPanel.style.boxShadow = "0 0 20px rgba(38, 131, 63, 0.5)";
    } else { 
        homePanel.style.boxShadow  = 'none';
        guestPanel.style.boxShadow = 'none';
    }
}

const startTimer = () => {
    timerInterval = setInterval(() => {
        if (currentTime > 0) {
            currentTime--;
            timerElem.textContent = formatTime(currentTime);
        }
    }, 1000);
    return timerInterval;
}

const stopTimer = () => {
    clearInterval(timerInterval);
}

const setTime = () => {
    let retrievedTime = prompt("Enter the time in seconds");
    currentTime = Number(retrievedTime);
}

const newGame = () => {
    currentTime = 300;
    resetAllPanels();
    highlightWinning();
}

const pauseTimer = () => {
    let pauseBtn : HTMLElement = document.getElementById("pauseBtn");

    running = !running;
    if (!running) {
        stopTimer();
        pauseBtn.textContent = "Resume";
    } else {
        timerInterval        = startTimer();
        pauseBtn.textContent = "Pause";
    }
}

document.querySelectorAll('.increment-btns').forEach(panelBtns => {
    const btns : HTMLElement[] = panelBtns.querySelectorAll('.panel-btn');
    if (btns.length === 3) {
        btns[0].onclick = (event: Event) => addScore(event, 1);
        btns[1].onclick = (event: Event) => addScore(event, 2);
        btns[2].onclick = (event: Event) => addScore(event, 3);
    }
});

const MAXIMUM_PANELS : number   = 9;
const panelScores    : number[] = [0, 0, 0, 0];

const timerElem      : Element  = document.querySelector('.timer-body-label');
let   currentTime    : number   = 300;
let timerInterval;

let running          : boolean = true;
startTimer();



