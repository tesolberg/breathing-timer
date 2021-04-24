// Enum for tracking phases
const phase = {
    HYPERVENTILATION: "hyperventilation",
    BREATHHOLD: "breathHold",
    RECOVERYBREATH: "recoveryBreath",
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

// Settings
var breathingInterval = 1600;   // Duration of one full breath cycle (ms)
var breathHoldLength = 7;       // Duration of breath hold phase (s)
var numberOfRounds = 3;         // Number of rounds (one round: hyperventilation, breath hold and recovery breath)
var numberOfBreaths = 4;        // Number of breaths per hyperventilation phase

// Model changed event
var modelChangedEvent = [];     // Subscribe to get noticed when model changes its values

// Variables
var roundCount = 0;                         // Current round
var counter = 0;                            // Current breath/breath hold in seconds
var breatheIn = false;                      // Breathe in = true, breathe out = false
var currentPhase = phase.RECOVERYBREATH;    // Current phase of current round


//////////////////
//// INTERNAL ////
//////////////////



// Internal variables
var skip = false;                           // Skips current phase if set to true
var exit = false;                           // Halts execution if set to true


// Function for running the delegate/event
function ModelChanged(){
    modelChangedEvent.forEach(element => {
        element();
    });
}

// Primary loop
function ContinueRound() {
    if (exit) {
        // Cleanup
        exit = false;
        currentPhase = phase.RECOVERYBREATH;

        ModelChanged();
        return;
    }

    // Cycles phase 
    switch (currentPhase) {
        case phase.RECOVERYBREATH:
            // Increment round number
            roundCount++;

            // Exit after completing all rounds
            if (roundCount > numberOfRounds){
                ModelChanged();
                return;
            }
            
            // For debug
            console.log("Round: " + roundCount + " begins...");
            console.log("Starting breathing");

            currentPhase = phase.HYPERVENTILATION

            // Start hyperventilation
            HyperventilateInOrOut();
            break;
        case phase.HYPERVENTILATION:
            console.log("Starting breath hold now");        // For debug
            currentPhase = phase.BREATHHOLD
            HoldBreath();
            break;
        case phase.BREATHHOLD:
            console.log("Recovery breath.. breathe in..."); // For debug
            currentPhase = phase.RECOVERYBREATH
            RecoveryBreath();
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

        console.log(counter);
        
        ModelChanged(); // Raise event

        // Wait 1 second and start function again
        setTimeout(RecoveryBreath, 1000);
    }
}


function HoldBreath() {
    // IF skip or max breaht hold count reached -> return control to round manager
    if (skip || exit || (counter >= breathHoldLength)) {
        skip = false;
        counter = 0;
        breatheIn = false;

        ContinueRound();
    }
    else {
        // Increment breath hold count
        counter++;

        ModelChanged();

        console.log(counter);

        // Wait 1 second and start function again
        setTimeout(HoldBreath, 1000);
    }
}


function HyperventilateInOrOut() {
    // IF skip or max breaht count reached and finished with out breath -> return control to round manager
    if (skip || exit || (counter >= numberOfBreaths && !breatheIn)) {
        skip = false;
        counter = 0;
        breatheIn = false;

        ContinueRound();
    }
    else {
        // Flip bool
        breatheIn = !breatheIn;

        // Increment breath count on every breath out
        if (breatheIn) counter++;

        // For debugging
        breatheIn ? console.log("Breathe in... (" + counter + ")") : console.log("Breathe out... (" + counter + ")")

        // Wait for breathingInterval / 2 then continue hyperventilation
        setTimeout(HyperventilateInOrOut, breathingInterval);
        
        // Raise event
        ModelChanged();
    }
}


