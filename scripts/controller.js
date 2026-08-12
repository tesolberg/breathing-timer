// Connecting to View
const startStopBtn = document.getElementById("startStopBtn");
const circle_ = document.getElementById("circle");
const textInCircle = document.getElementById("circleText");
const instructionText_ = document.getElementById("instructionText");
const breathingSpeedInput_ = document.getElementById("breathingSpeedInput");
const numberOfBreathsInput_ = document.getElementById("numberOfBreathsInput");
const breathHoldDurationInput_ = document.getElementById("breathHoldDurationInput");
const numberOfRoundsInput_ = document.getElementById("numberOfRoundsInput");

startStopBtn.onclick = StartBtnClicked;
circle_.onclick = SkipClicked;
textInCircle.onclick = SkipClicked;

var moduleRunning = false;  // Tracking if the timer is running or not
var testMode = false;

var lastCuedPhase = null;        // Last phase we already played a transition cue for
var lastCuedInstruction = null;  // Last instruction we already played a cue for (catches "finished", which doesn't change currentPhase)

// Non-visual (audio + vibration) cues for phase transitions, since users often
// have their eyes closed during a breathing exercise and would otherwise miss them.
function PlayPhaseCue() {
    if (instruction === "Breathing exercise finished") {
        if (lastCuedInstruction !== instruction) {
            playTone(523, 180);
            vibrate([120, 80, 120, 80, 120]);
        }
        lastCuedInstruction = instruction;
        lastCuedPhase = currentPhase;
        return;
    }
    lastCuedInstruction = instruction;

    if (currentPhase === lastCuedPhase) return;
    lastCuedPhase = currentPhase;

    switch (currentPhase) {
        case phase.HYPERVENTILATION:
            playTone(440, 150);
            vibrate(100);
            break;
        case phase.BREATHHOLD:
            playTone(220, 300);
            vibrate(200);
            break;
        case phase.RECOVERYBREATH:
            playTone(330, 150);
            vibrate(100);
            break;
    }
}

// Function for controlling View based on Model
var controllerModelListener = function () {

    PlayPhaseCue();

    // Controlling circle
    if (breatheIn) {
        circleEnlarge(breathingInterval);
    }
    else {
        circleShrink(breathingInterval);
    }

    if (counter < 0 || currentPhase === phase.POSTRECOVERYBREATH || currentPhase === phase.PREHYPERVENTILATION) {
        textInCircle.innerHTML = "";
    }
    else {
        textInCircle.innerHTML = counter;
    }

    UpdateCircleColor();

    // Update cursor
    if (SkipEnabled()) {
        circle_.style.cursor = "pointer";
        textInCircle.style.cursor = "pointer";
    }
    else {
        circle_.style.cursor = "default";
        textInCircle.style.cursor = "default";
    }


    // Displaying instructions
    instructionText_.innerHTML = instruction;
}

// Connecting to Model
modelChangedEvent.push(controllerModelListener);    // Subscribe to model changed event


function StartBtnClicked() {
    // Stop
    if (moduleRunning) {
        moduleRunning = false;
        startStopBtn.innerHTML = "Start";
        StopTimer();
    }
    // Start
    else {
        moduleRunning = true;

        // Create/unlock the AudioContext here, inside a user-gesture handler,
        // since browsers block audio playback that isn't triggered by one.
        ensureAudioContext();
        lastCuedPhase = null;
        lastCuedInstruction = null;

        // Update button text
        startStopBtn.innerHTML = "Stop";

        //Update values from user input
        numberOfBreaths = numberOfBreathsInput_.value;
        breathHoldLength = breathHoldDurationInput_.value;
        numberOfRounds = numberOfRoundsInput_.value;

        // Set breathing speed
        switch (breathingSpeedInput_.value) {
            case "0": {
                breathingInterval = 1600;
                break;
            }
            case "1": {
                breathingInterval = 1200;
                break;
            }
            case "2": {
                breathingInterval = 1600;
                break;
            }
            case "3": {
                breathingInterval = 2000;
                break;
            }
        }

        if (testMode) {
            numberOfBreaths = 3;
            breathHoldLength = 5;
            numberOfRounds = 5;
            breathingInterval = 1200;
        }

        StartTimer();
    }
}

function SkipEnabled() {
    return currentPhase === phase.HYPERVENTILATION ||
        currentPhase === phase.BREATHHOLD ||
        currentPhase === phase.RECOVERYBREATH;
}

function SkipClicked() {
    if (SkipEnabled()) {
        skip = true;
    }
}

function UpdateCircleColor() {
    switch (currentPhase) {
        case "preHyperventilation":
            setCircleColor("blue");
            break;
        case "hyperventilation":
            setCircleColor("orange");
            break;
        case "breathHold":
            setCircleColor("purple");
            break;
        case "recoveryBreath":
            setCircleColor("green");
            break;
        case "postRecoveryBreath":
            setCircleColor("blue");
            break;
    }
}

function Test() {
    testMode = true;
    StartBtnClicked();
}

