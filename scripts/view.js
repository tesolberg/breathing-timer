var circle = document.getElementById('circle')

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
