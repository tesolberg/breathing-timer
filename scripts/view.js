var circle = document.getElementById('circle')
var numberOfBreathsInput = document.getElementById('numberOfBreathsInput')
var incrementBreathsBtn = document.getElementById('incrementBreaths')
var subtractBreathsBtn = document.getElementById('subtractBreaths')

/////////
///API///
/////////

//input id's: hyperventnumber, runder, puste_hastighet, holde_pusten, startbtn, timerText



function circleEnlarge(transitionTime) {
  circle.style.transform = 'scale(5)';
  circle.style.transition = 'all ' + transitionTime +'ms';  
}


function circleShrink(transitionTime) {
  circle.style.transform = 'scale(2)';
  circle.style.transition = 'all ' + transitionTime +'ms';      
}


function Increment () {
  numberOfBreathsInput.value = Number(numberOfBreathsInput.value) + 1;
}

function Subtract () {
  numberOfBreathsInput.value = Number(numberOfBreathsInput.value) - 1;
}

incrementBreathsBtn.addEventListener('click', Increment);
subtractBreathsBtn.addEventListener('click', Subtract)