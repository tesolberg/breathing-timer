// Connecting to View
const startStopBtn = document.getElementById("startbtn");
const circle_ = document.getElementById("circle");
const textInCircle = document.getElementById("timerText");
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

        // Update values from user input
        // breathingInterval = document.getElementById("puste_hastighet").value;
        // breathHoldLength = document.getElementById("holde_pusten").value;
        // numberOfRounds = document.getElementById("runder").value;
        // numberOfBreaths = document.getElementById("hyperventnumber").value;
        StartTimer();
    }
}

function SkipClicked() {
    skip = true;
}


