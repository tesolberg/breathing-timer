var circle = document.getElementById('circle')
var numberOfBreathsInput = document.getElementById('numberOfBreathsInput')
var incrementBreathsBtn = document.getElementById('incrementBreaths')
var subtractBreathsBtn = document.getElementById('subtractBreaths')

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

function circleEnlarge(transitionTime) {
  circle.style.transform = 'scale(3)';
  circle.style.transition = 'all ' + transitionTime +'ms';  
}


function circleShrink(transitionTime) {
  circle.style.transform = 'scale(1)';
  circle.style.transition = 'all ' + transitionTime +'ms';      
}

function Increment () {
  numberOfBreathsInput.value = Number(numberOfBreathsInput.value) + 1;
}

function Subtract () {
  numberOfBreathsInput.value = Number(numberOfBreathsInput.value) - 1;
}

incrementBreathsBtn.addEventListener('click', Increment);
subtractBreathsBtn.addEventListener('click', Subtract);