var circleScale = document.getElementById('circlescale');
var hyperVentFreq = document.getElementById('hyperventfreq')
var circle = document.getElementById('circle');


function changeHyperVentFreq () {
  circle.style.transition = "all " + hyperVentFreq.value + "s";
}

function changeCircleScale() {
  circle.style.transform = "scale( " + circleScale.value + ")";
}


function onKeyConfirm(event) {
  if (circleScale.value.length > 0 && event.keyCode === 13) {
    changeCircleScale();
    circleScale.value = "";
  }
}


addEventListener("input", changeHyperVentFreq);
circleScale.addEventListener("input", changeCircleScale);
//circleScale.addEventListener("keypress", onKeyConfirm);
