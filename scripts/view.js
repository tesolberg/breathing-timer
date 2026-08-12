var circle = document.getElementById('circle')
var numberOfBreathsInput = document.getElementById('numberOfBreathsInput')
var incrementBreathsBtn = document.getElementById('incrementBreaths')
var subtractBreathsBtn = document.getElementById('subtractBreaths')

var numberOfRoundsInput = document.getElementById('numberOfRoundsInput')
var incrementRoundsBtn = document.getElementById('incrementRounds')
var subtractRoundsBtn = document.getElementById('subtractRounds')

var breathHoldDurationInput = document.getElementById('breathHoldDurationInput')
var incrementHoldBtn = document.getElementById('incrementHold')
var subtractHoldBtn = document.getElementById('subtractHold')

/////////
///API///
/////////

// Lazily created AudioContext. Browsers require a user gesture before audio can play,
// so this is created/resumed from the Start button click handler in controller.js.
var audioCtx = null;

function ensureAudioContext() {
  if (!audioCtx) {
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

// Plays a short beep. Used as a non-visual cue for phase changes, since users
// often have their eyes closed during breathing exercises.
function playTone(frequencyHz, durationMs) {
  var ctx = ensureAudioContext();
  if (!ctx) return;

  var oscillator = ctx.createOscillator();
  var gain = ctx.createGain();
  oscillator.frequency.value = frequencyHz;
  oscillator.connect(gain);
  gain.connect(ctx.destination);

  var now = ctx.currentTime;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

  oscillator.start(now);
  oscillator.stop(now + durationMs / 1000);
}

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// Air-themed phase palette: each phase reads as a different quality of air.
// Set as a custom property (rather than circle.style.background directly) so the
// CSS can layer a soft highlight gradient on top of it -- see .dot in style.css.
var PHASE_COLORS = {
  blue: "hsl(221, 55%, 62%)",    // still air -- get ready
  orange: "hsl(35, 90%, 60%)",   // moving air -- hyperventilation
  purple: "hsl(265, 45%, 68%)",  // suspended air -- breath hold
  green: "hsl(160, 50%, 55%)",   // fresh breeze -- recovery
};

function setCircleColor(color) {
  if (PHASE_COLORS[color]) {
    circle.style.setProperty('--phase-color', PHASE_COLORS[color]);
  }
}


//////////////////Circle size functions////////////////////////////////////

function circleEnlarge(transitionTime) {
  circle.style.transform = 'scale(3)';
  circle.style.transition = 'all ' + transitionTime +'ms';  
}


function circleShrink(transitionTime) {
  circle.style.transform = 'scale(1)';
  circle.style.transition = 'all ' + transitionTime +'ms';      
}


/////////////////////////Number of Breaths////////////////////////////////

function incrementBreaths () {
  numberOfBreathsInput.value = Number(numberOfBreathsInput.value) + 1;
}

function subtractBreaths () {
  numberOfBreathsInput.value = Math.max(Number(numberOfBreathsInput.value) - 1, 1);
}

incrementBreathsBtn.addEventListener('click', incrementBreaths);
subtractBreathsBtn.addEventListener('click', subtractBreaths);

/////////////////////////Number of Rounds////////////////////////////////


function incrementRounds () {
  numberOfRoundsInput.value = Number(numberOfRoundsInput.value) + 1;
}

function subtractRounds () {
  numberOfRoundsInput.value = Math.max(Number(numberOfRoundsInput.value) - 1, 1);
}

incrementRoundsBtn.addEventListener('click', incrementRounds);
subtractRoundsBtn.addEventListener('click', subtractRounds);

/////////////////////////Breath Hold Duration////////////////////////////////


function incrementHoldBreath () {
  breathHoldDurationInput.value = Number(breathHoldDurationInput.value) + 1;
}

function subtractHoldBreath () {
  breathHoldDurationInput.value = Math.max(Number(breathHoldDurationInput.value) - 1, 1);
}

incrementHoldBtn.addEventListener('click', incrementHoldBreath);
subtractHoldBtn.addEventListener('click', subtractHoldBreath);

