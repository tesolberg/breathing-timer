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

function setCircleColor(color) {
  switch(color) {
    case "blue":
      circle.style.background = "rgb(46, 65, 114)";
      break;
    
    case "orange":
      circle.style.background = "rgb(242, 102, 46)";
      break;
  
    case "green":
      circle.style.background = "rgb(93, 135, 60)";
      break;
    
    case "purple":
      circle.style.background = "rgb(90, 56, 123)";
      break;
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

