// Enum for tracking phases
const phase = {
    PREHYPERVENTILATION: "preHyperventilation",
    HYPERVENTILATION: "hyperventilation",
    PREBREATHHOLD: "prebreathHold",
    BREATHHOLD: "breathHold",
    PRERECOVERYBREATH: "preRecoveryBreath",
    RECOVERYBREATH: "recoveryBreath",
    POSTRECOVERYBREATH: "postRecoveryBreath",
}


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

// Settings (test settings below, overwritten by controller at start)
var breathingInterval = 1600;   // Duration of one full breath cycle (ms)
var breathHoldLength = 7;       // Duration of breath hold phase (s)
var numberOfRounds = 3;         // Number of rounds (one round: hyperventilation, breath hold and recovery breath)
var numberOfBreaths = 4;        // Number of breaths per hyperventilation phase

// Model changed event
var modelChangedEvent = [];     // Subscribe to get noticed when model changes its values

// Variables
var roundCount = 0;                             // Current round
var counter = 0;                                // Current breath/breath hold in seconds
var breatheIn = false;                          // Breathe in = true, breathe out = false
var currentPhase = phase.POSTRECOVERYBREATH;    // Current phase of current round
var instruction = "";


//////////////////
//// INTERNAL ////
//////////////////

// Internal variables
var skip = false;                           // Skips current phase if set to true
var exit = false;                           // Halts execution if set to true

// Function for running the delegate/event
function ModelChanged() {
    modelChangedEvent.forEach(element => {
        element();
    });
}

// Primary loop
function ContinueRound() {
    if (exit) {
        // Cleanup
        exit = false;
        currentPhase = phase.POSTRECOVERYBREATH;
        instruction = "Breathing exercise finished";

        ModelChanged();
        return;
    }

    // Cycles phase 
    switch (currentPhase) {
        case phase.POSTRECOVERYBREATH:
            roundCount++;

            if (roundCount > numberOfRounds) {
                exit = true;
                ContinueRound();
                return;
            }

            instruction = "Get ready for round " + roundCount + " (skip any phase by clicking the circle)";
            currentPhase = phase.PREHYPERVENTILATION
            ModelChanged();
            setTimeout(ContinueRound, 5000);
            break;

        case phase.PREHYPERVENTILATION:
            currentPhase = phase.HYPERVENTILATION
            counter = 0;
            HyperventilateInOrOut();
            break;

        case phase.HYPERVENTILATION:
            currentPhase = phase.BREATHHOLD
            HoldBreath();
            break;

        case phase.BREATHHOLD:
            currentPhase = phase.RECOVERYBREATH
            RecoveryBreath();
            break;
        
        case phase.RECOVERYBREATH:
            instruction = "Breathe out...";
            currentPhase = phase.POSTRECOVERYBREATH
            ModelChanged();
            setTimeout(ContinueRound, 3000);
            break;
    }
}

function RecoveryBreath() {
    // IF skip or recovery breath duration reached -> return control to round manager
    if (skip || exit || (counter >= 15)) {
        skip = false;
        counter = 0;
        breatheIn = false;

        ContinueRound();
    }
    else {
        // Increment breath hold count
        counter++;
        breatheIn = true;

        instruction = "Breathe in... hold breath for 15 seconds";

        ModelChanged(); // Raise event

        // Wait 1 second and start function again
        setTimeout(RecoveryBreath, 1000);
    }
}


function HoldBreath() {
    // IF skip or max breaht hold count reached -> return control to round manager
    if (skip || exit || (counter >= breathHoldLength)) {
        skip = false;
        counter = -1;
        breatheIn = false;

        ContinueRound();
    }
    else {
        // Increment breath hold count
        counter++;

        // Set instructions
        if (counter > breathHoldLength - 3){
            instruction = "Recovery breath in " + String(breathHoldLength - counter + 1);
        }
        else instruction = "Hold your breath...";

        ModelChanged();

        // Wait 1 second and start function again
        setTimeout(HoldBreath, 1000);
    }
}


function HyperventilateInOrOut() {
    // IF skip or max breaht count reached and finished with out breath -> return control to round manager
    if (skip || exit || (counter >= numberOfBreaths && !breatheIn)) {
        skip = false;
        counter = -1;
        breatheIn = false;

        ContinueRound();
    }
    else {
        // Flip bool
        breatheIn = !breatheIn;

        // Increment breath count on every breath out
        if (breatheIn) counter++;

        // Setting instruction
        if (counter > numberOfBreaths - 1){
            instruction = "Get ready for breath hold...";
        }
        else breatheIn ? instruction = "Breathe in..." : instruction = "Breathe out...";

        // Wait for breathingInterval then continue hyperventilation
        setTimeout(HyperventilateInOrOut, breathingInterval);

        // Raise event
        ModelChanged();
    }
}


