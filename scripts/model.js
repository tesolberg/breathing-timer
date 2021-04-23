/////////////////
////// API //////
/////////////////

function StartTimer() { ContinueRound(); }

function StopTimer() {
    exit = true;
    roundCount = 0;
    currentPhase = phase.RECOVERYBREATH;
    breatheIn = false;
}

var breathingInterval = 1600;   // Duration of one full breath cycle (ms)
var breathHoldLength = 7;       // Duration of breath hold phase (s)
var numberOfRounds = 3;         // Number of rounds (one round: hyperventilation, breath hold and recovery breath)
var numberOfBreaths = 4;        // Number of breaths per hyperventilation phase

var modelChangedEvent = [];     // Void no arguments delegate for model changed


//////////////////
//// INTERNAL ////
//////////////////

// Enum for tracking phases
const phase = {
    HYPERVENTILATION: "hyperventilation",
    BREATHHOLD: "breathHold",
    RECOVERYBREATH: "recoveryBreath",
}

// Variables
var roundCount = 0;                         // Current round
var breathCount = 0;                        // Current breath this round
var breathHoldCount = 0;                    // Counter for seconds during breath hold
var breatheIn = false;                      // Breathe in = true, breathe out = false
var skip = false;                           // Skips current phase if set to true
var exit = false;                           // Halts execution if set to true
var currentPhase = phase.RECOVERYBREATH;    // Current phase of current round



// Function for running the delegate
function ModelChanged(){
    modelChangedEvent.forEach(element => {
        element();
    });
}


function ContinueRound() {
    if (exit) {
        exit = false;
        return;
    }

    // Cycles phase 
    switch (currentPhase) {
        case phase.RECOVERYBREATH:
            // Increment round number
            roundCount++;

            // Exit after completing all rounds
            if (roundCount > numberOfRounds) return;
            console.log("Round: " + roundCount + " begins...");

            currentPhase = phase.HYPERVENTILATION
            console.log("Starting breathing");
            breathCount = 0;

            PlayBreathAnimation(false);      // TODO: Decouple

            // Start hyperventilation
            HyperventilateInOrOut();
            break;
        case phase.HYPERVENTILATION:
            currentPhase = phase.BREATHHOLD
            console.log("Starting breath hold now");
            breathHoldCount = 0;
            PlayBreathAnimation(false);      // TODO: Decouple
            HoldBreath();
            break;
        case phase.BREATHHOLD:
            currentPhase = phase.RECOVERYBREATH
            breathHoldCount = 0;
            console.log("Recovery breath.. breathe in...");
            PlayBreathAnimation(true);      // TODO: Decouple
            RecoveryBreath();
            break;
    }
}


// TODO
function RecoveryBreath() {
    // IF skip or recovery breath duration reached -> return control to round manager
    if (skip || exit || (breathHoldCount >= 15)) {
        skip = false;
        ContinueRound();
    }
    else {
        // Increment breath hold count
        breathHoldCount++;

        console.log(breathHoldCount);
        DisplayTextInCircle(breathHoldCount);
        


        // Wait 1 second and start function again
        setTimeout(RecoveryBreath, 1000);
    }
}


function HoldBreath() {
    // IF skip or max breaht hold count reached -> return control to round manager
    if (skip || exit || (breathHoldCount >= breathHoldLength)) {
        skip = false;
        ContinueRound();
    }
    else {
        // Increment breath hold count
        breathHoldCount++;

        console.log(breathHoldCount);
        DisplayTextInCircle(breathHoldCount);

        // Wait 1 second and start function again
        setTimeout(HoldBreath, 1000);
    }
}


function HyperventilateInOrOut() {
    // IF skip or max breaht count reached and finished with out breath -> return control to round manager
    if (skip || exit || (breathCount >= numberOfBreaths && !breatheIn)) {
        skip = false;
        ContinueRound();
    }
    else {
        // Flip bool
        breatheIn = !breatheIn;

        // Increment breath count on every breath out
        if (breatheIn) breathCount++;

        // Log result
        breatheIn ? console.log("Breathe in... (" + breathCount + ")") : console.log("Breathe out... (" + breathCount + ")")

        // Wait for breathingInterval / 2 then continue hyperventilation
        setTimeout(HyperventilateInOrOut, breathingInterval);

        PlayBreathAnimation(breatheIn); //TODO: Decouple
        DisplayTextInCircle(breathCount);
        
        // Raise event
        ModelChanged();
    }
}

function PlayBreathAnimation(inbreath) {
    if (inbreath) {
        circleEnlarge(breathingInterval);
    }
    else {
        circleShrink(breathingInterval);
    }
}

var circleText = document.getElementById("timerText");

function DisplayTextInCircle(text){
    circleText.innerHTML = text;
}