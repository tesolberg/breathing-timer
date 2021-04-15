/////////////////
////// API //////
/////////////////

function StartTimer(){ContinueRound();}

function StopTimer(){exit = true;}

var breathingInterval = 1500;   // Duration of one full breath cycle
var breathHoldLength = 5;       // Duration of breath hold phase
var numberOfRounds = 3;         // Number of rounds (one round: hyperventilation, breath hold and recovery breath)
var numberOfBreaths = 3;        // Number of breaths per hyperventilation phase



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


function ContinueRound() {
    if (exit){
        exit = false;
        return;
    } 

    // Cycles phase 
    switch (currentPhase) {
        case phase.RECOVERYBREATH:
            currentPhase = phase.HYPERVENTILATION
            console.log("Starting breathing");
            breathCount = 0;
            // Increment round number
            roundCount++;
            
            // Start hyperventilation
            console.log("Round: " + roundCount + " begins...");
            HyperventilateInOrOut();        
            break;
        case phase.HYPERVENTILATION:
            currentPhase = phase.BREATHHOLD
            console.log("Starting breath hold now");
            breathHoldCount = 0;
            HoldBreath();
            break;
        case phase.BREATHHOLD:
            currentPhase = phase.RECOVERYBREATH
            console.log("Starting recovery breath");
            RecoveryBreath();
            break;        
    }
}


// TODO
function RecoveryBreath(){
    ContinueRound();
}


function HoldBreath(){
    // IF skip or max breaht hold count reached -> return control to round manager
    if (skip || exit || (breathHoldCount >= breathHoldLength)) {
        skip = false;
        ContinueRound();
    }
    else {
        // Increment breath hold count
        breathHoldCount++;

        console.log(breathHoldCount);
        
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
    }
}
