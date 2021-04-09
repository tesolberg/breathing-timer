var circleScale = document.getElementById('circlescale');
var hyperVentFreq = document.getElementById('hyperventfreq');
var circle = document.getElementById('circle');
var breathNumber = document.getElementById('hyperventnumber');
var startButton = document.getElementById('startbtn');
var circleNormalSize = 1;
var i = 0;


function changeHyperVentFreq () {
  circle.style.transition = "all " + hyperVentFreq.value + "s";
}

function changeCircleScale() {
  circle.style.transform = "scale( " + circleScale.value + ")";
  setTimeout(() => {circle.style.transform = "scale( " + circleNormalSize + ")";}, 2000);
}



startButton.addEventListener('click', changeCircleScale);