// Enum
const phase = {
    HYPERVENTILATION: "hyperventilation",
    BREATHHOLD: "breathHold",
    RECOVERYBREATH: "recoveryBreath",
}

// Settings
var breathingInterval = 1500;   // Duration of one full breath
var numberOfRounds = 3;         // Number of rounds of full excercise
var numberOfBreaths = 3;        // Number of breaths per round

// Variables
var roundCount = 0;             // Current round
var breathCount = 0;            // Current breath this round
var breatheIn = false;          // Breathe in = true, breathe out = false
var skip = false;               // Skips current phase if set to true
var exit = false;               // Halts execution if set to true
var currentPhase = phase.RECOVERYBREATH;  // Current phase of current round


function ContinueRound() {
    // Cycles phase 
    console.log(currentPhase);
    switch (currentPhase) {
        case phase.RECOVERYBREATH:
            breathCount = 0;
            // Increment round number
            roundCount++;
            currentPhase = phase.HYPERVENTILATION
            
            // Start hyperventilation
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
    }

    
}

function RecoveryBreath(){
    ContinueRound
}

function HoldBreath(){
    ContinueRound
}


function HyperventilateInOrOut() {
    // IF skip or max breaht count reached and finished with out breath -> return control to round manager
    if (skip || (breathCount >= numberOfBreaths && !breatheIn)) {
        skip = false;
        ContinueRound();
    }
    else {
        // Flip bool
        breatheIn = !breatheIn;

        // Increment breath count on every breath out
        if (breatheIn) breathCount++;

        if (breathCount == 1 && breatheIn) console.log("Round: " + roundCount + " begins...");

        // Log result
        breatheIn ? console.log("Breathe in... (" + breathCount + ")") : console.log("Breathe out... (" + breathCount + ")")

        // Wait for breathingInterval / 2 then continue round
        setTimeout(HyperventilateInOrOut, breathingInterval);
    }
}


function StartTimer(){
    


    ContinueRound();
}

StartTimer();








// function StartExcercise() {
//     // Reset counters
//     roundCount = 0;
//     breathCount = 0;
//     breatheIn = false;

//     // Start first round
//     InitNextStep()
// }

// function InitNextStep(){

// }

// function StartNextRound() {
//     if (roundCount < numberOfRounds) {
//         roundCount++;

//         // Create new round and initiate with callback to this function
//         InitNewRound(StartNextRound);
//     }
// }

// function InitNewRound(callback) {
//     // Reset breath counter
//     breathCount = 0;

//     while (breathCount < numberOfBreaths) {
//         breathCount++;

//     }


//     StartNextRound()
// }




// function RunTimer() {
//     var timer = setInterval(() => {
//         BreathInOut()
//     }, breathingInterval);

//     setTimeout(() => {
//         clearInterval(timer);
//     }, numberOfBreaths * breathingInterval * 2);
// }

// RunTimer();


