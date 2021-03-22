var numberInput = document.getElementById('numberinput');
var circle = document.getElementById('circle');


function changeCircleScale() {
  circle.style.transform = "scale( " + numberinput.value + ")";
}


function onKeyConfirm(event) {
  if (numberInput.value.length > 0 && event.keyCode === 13) {
    numberInput.value = "";

  }
}


addEventListener("input", changeCircleScale);
numberInput.addEventListener("keypress", onKeyConfirm);
