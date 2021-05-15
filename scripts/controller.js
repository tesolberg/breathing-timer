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

// Function for controlling View based on Model
var controllerModelListener = function () {

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

