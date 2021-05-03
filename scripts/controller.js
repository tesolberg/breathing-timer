// Connecting to View
const startStopBtn = document.getElementById("startStopBtn");
const circle_ = document.getElementById("circle");
const textInCircle = document.getElementById("circleText");
const breathingSpeedInput_ = document.getElementById("breathingSpeedInput");
const numberOfBreathsInput_ = document.getElementById("numberOfBreathsInput");
const breathHoldDurationInput_ = document.getElementById("breathHoldDurationInput");
const numberOfRoundsInput_ = document.getElementById("numberOfRoundsInput");


startStopBtn.onclick = StartBtnClicked;
circle_.onclick = SkipClicked;

var moduleRunning = false;  // Tracking if the timer is running or not

// Function for controlling View based on Model
var controllerModelListener = function OnModelChanged() {

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

    // Displaying instructions
    console.log(instruction);
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

        console.log(breathingSpeedInput_.value);

        // Set breathing speed
        switch (breathingSpeedInput_.value){
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

        StartTimer();
    }
}

function SkipClicked() {
    skip = true;
}


