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

function StartTimer() {
    // Cancel any stale callback left over from a previous run before starting fresh
    CancelScheduledTick();
    ContinueRound();
}

function StopTimer() {
    // Cancel any pending tick first, then run cleanup synchronously ourselves.
    // (The old code just set exit=true and relied on the currently-pending
    // callback to notice it and clean up later. Now that we cancel that
    // callback, nothing else would ever run the cleanup.)
    CancelScheduledTick();

    roundCount = 0;
    counter = 0;
    skip = false;
    exit = false;
    breatheIn = false;
    currentPhase = phase.POSTRECOVERYBREATH;
    instruction = "Breathing exercise finished";

    ModelChanged();
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
var activeTimer = null;                     // id of the currently pending setTimeout, so stale callbacks can be cancelled
var phaseStartTime = 0;                     // performance.now() at the start of the current ticking phase, used to schedule ticks without drift
var hyperventStep = 0;                      // half-breath tick counter within the hyperventilation phase (counter only advances on breathe-in)

// Function for running the delegate/event
function ModelChanged() {
    modelChangedEvent.forEach(element => {
        element();
    });
}

// Schedules fn to run once, tracking the timer id so it can be cancelled if the round is stopped/restarted
function ScheduleTick(fn, delay) {
    activeTimer = setTimeout(fn, delay);
}

// Cancels any pending tick so a stopped/superseded round can't fire into a new one
function CancelScheduledTick() {
    if (activeTimer !== null) {
        clearTimeout(activeTimer);
        activeTimer = null;
    }
}

// Returns the delay (ms, never negative) until the given tick number of a phase that started at phaseStartTime,
// so repeated ticks stay aligned to real elapsed time instead of drifting from setTimeout scheduling overhead.
function DelayUntilTick(tickNumber, intervalMs) {
    return Math.max(0, (phaseStartTime + tickNumber * intervalMs) - performance.now());
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
            ScheduleTick(ContinueRound, 5000);
            break;

        case phase.PREHYPERVENTILATION:
            currentPhase = phase.HYPERVENTILATION
            counter = 0;
            hyperventStep = 0;
            phaseStartTime = performance.now();
            HyperventilateInOrOut();
            break;

        case phase.HYPERVENTILATION:
            currentPhase = phase.BREATHHOLD
            phaseStartTime = performance.now();
            HoldBreath();
            break;

        case phase.BREATHHOLD:
            currentPhase = phase.RECOVERYBREATH
            phaseStartTime = performance.now();
            RecoveryBreath();
            break;
        
        case phase.RECOVERYBREATH:
            instruction = "Breathe out...";
            currentPhase = phase.POSTRECOVERYBREATH
            ModelChanged();
            ScheduleTick(ContinueRound, 3000);
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

        // Schedule next tick against the phase start time so ticks don't drift.
        // counter starts at -1 (carried over from the previous phase), so the next
        // invocation's tick index is counter + 1, not counter.
        ScheduleTick(RecoveryBreath, DelayUntilTick(counter + 1, 1000));
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

        // Schedule next tick against the phase start time so ticks don't drift.
        // counter starts at -1 (carried over from the previous phase), so the next
        // invocation's tick index is counter + 1, not counter.
        ScheduleTick(HoldBreath, DelayUntilTick(counter + 1, 1000));
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
        hyperventStep++;

        // Flip bool
        breatheIn = !breatheIn;

        // Increment breath count on every breath out
        if (breatheIn) counter++;

        // Setting instruction
        if (counter > numberOfBreaths - 1){
            instruction = "Get ready for breath hold...";
        }
        else breatheIn ? instruction = "Breathe in..." : instruction = "Breathe out...";

        // Schedule next tick against the phase start time so ticks don't drift
        ScheduleTick(HyperventilateInOrOut, DelayUntilTick(hyperventStep, breathingInterval));

        // Raise event
        ModelChanged();
    }
}


