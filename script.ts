/**
 * Adds a new panel to the page. If the maximum panels have been reached
 * then hide the panel addition element.
 * @returns void
 */

const moveAddPanel = () : void => {
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

/**
 * Creates a new element. Used to reduce the amount of lines needed to add
 * new elements to the DOM. Elements type, text, and classes only accept
 * valid string parameters: i.e. 'h1' or '.example h1'.
 * @return The newly created element as HTMLElement
 */
const createElem = (
    type      : string,
    parent?   : HTMLElement,
    text?     : string | null,
    classes?  : string,
    onclick?  : Function,
    ...params : any[]
): HTMLElement => {
    const newElem : HTMLElement = document.createElement(type);
    if (parent)   { parent.appendChild(newElem); }
    if (classes)  { newElem.classList.add(classes); }
    if (text)     { newElem.textContent = text; }
    if (onclick)  { newElem.onclick = (event) => onclick(event, ...params); }

    return newElem;
}

 /*
 * Creates a new panel. Used dynamically when the add panel button is pressed.
 * Function createElem() used to simplify element creation.
 * @return void
 */
const createPanel = (panelName : string | null): void => {

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

    // Creating panel elements
    const panelDiv         = createElem('div', scores, undefined, 'score-panel');
    const panelTitle       = createElem('h1', panelDiv, `${panelName}`, 'score-panel-title');
    const panelDisplay     = createElem('div', panelDiv, undefined, 'score-panel-display');
    const displayText      = createElem('h2', panelDisplay, "0", 'score-text', );
    const panelButtons     = createElem('div', panelDiv, undefined, 'score-panel-btns');
    const incrementButtons = createElem('div', panelButtons, undefined, undefined);
    
    // Creating three increment buttons (panel-btn : children of increment-btns)
    const firstButton  = createElem('button', incrementButtons, "+1", 'panel-btn');
    const secondButton = createElem('button', incrementButtons, "+2", 'panel-btn');
    const thirdButton  = createElem('button', incrementButtons, "+3", 'panel-btn');
    const removeButton = createElem('button', panelButtons, "Remove", 'remove-panel-btn');
    
    // Attaching event handlers to newly created buttons (panel-btn and remove-panel-btn)
    firstButton.onclick  = (event) => addScore(event, 1);
    secondButton.onclick = (event) => addScore(event, 2);
    thirdButton.onclick  = (event) => addScore(event, 3);
    removeButton.onclick = (event) => removePanel(event);
    
    panelScores.push(0);
    moveAddPanel();
}

const removePanel = (event: Event): void => {
    const panelGrid:  HTMLElement | null = document.getElementById('scores-grid');
    const buttonElem: HTMLElement | null = event.currentTarget as HTMLElement | null;

    if (!buttonElem || !panelGrid) {
        console.error("Unable to find required elements for removePanel()");
        return;
    }

    const panel: HTMLElement | null  = buttonElem.closest('.score-panel');
    let   index: number | undefined;

    if (panel) { index = getPanelIndex(panel); }
    if (!panel || !index) {
        console.error("Unable to find required elements for removePanel()");
        return;
    } 

    panelScores.splice(index, 1);
    panelGrid.removeChild(panel);
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

const newGame = () => {
    currentTime = 300;
    resetAllPanels();
    highlightWinningTeam();
}


const addScore = (event: Event, increment: number) =>  {

    const buttonElem = event.currentTarget;

    if (!(buttonElem instanceof HTMLElement)) {
        console.error("Unable to find necessary elements for addScore()");
        return;
    }

    const panelElem : HTMLElement | null = buttonElem.closest('.score-panel');

    if (!panelElem || !buttonElem) {
        console.error("Unable to find necessary elements for addScore()");
        return;
    }

    const displayText : HTMLElement | null   = panelElem.querySelector('.score-panel-display h2');
    const scoresIndex : number | undefined   = getPanelIndex(panelElem);

    if (!displayText || !scoresIndex || !panelScores) {
        console.error("Unable to find necessary elements for addScore()");
        return;
    }

    panelScores[scoresIndex] += increment;
    displayText.textContent  = `${panelScores[scoresIndex]}`;

    if (scoresIndex == 0 || scoresIndex == 1) { highlightWinningTeam(); }
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
    const homePanel  : HTMLElement | null  = document.querySelector('#home-team .score-panel-display');
    const guestPanel : HTMLElement | null  = document.querySelector('#guest-team .score-panel-display')

    if (!homePanel || !guestPanel || !panelScores) {
        console.error("Unable to find required elements for function highlightWinningTeam()");
        return;
    }

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

const startTimer = () : number | undefined => {
    if (!timerElem) { 
        console.log("Unable to find timer element for startTimer()");    
        return; 
    }

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
    let retrievedTime : string | null = prompt("Enter the time in seconds");
        currentTime                   = Number(retrievedTime);
}

const pauseTimer = () => {
    let pauseBtn : HTMLElement | null = document.getElementById("pauseBtn");

    if (!pauseBtn) {
        console.error("Unable to find element '#pauseBtn' for function pauseTimer!");
        return;
    }

    running = !running;
    if (!running) {
        stopTimer();
        pauseBtn.textContent = "Resume";
    } else {
        timerInterval        = startTimer();
        pauseBtn.textContent = "Pause";
    }
}


const MAXIMUM_PANELS : number   = 9;
const panelScores    : number[] = [0, 0, 0, 0];

const timerElem      : Element | null  = document.querySelector('.timer-body-label');
let   currentTime    : number   = 300;
let   timerInterval  : number | undefined;

let running          : boolean = true;

const newPanelBtn : HTMLElement | null = document.querySelector('.new-panel-btn');
if (newPanelBtn) { newPanelBtn.onclick = () => createPanel(null) };

document.querySelectorAll('.increment-btns').forEach(panelBtns => {
    const btns : HTMLElement[] = Array.from(panelBtns.querySelectorAll('.panel-btn'));
    if (btns.length === 3) {
        btns[0].onclick = (event: Event) => addScore(event, 1);
        btns[1].onclick = (event: Event) => addScore(event, 2);
        btns[2].onclick = (event: Event) => addScore(event, 3);
    }
});

startTimer();



