var breathingInterval = 1500;
var numberOfBreaths = 3;
var breathCount = 0;

var breatheIn = false;

function BreathInOut(){
    breatheIn = !breatheIn;
    breatheIn ? console.log("Breathe in...") : console.log("Breathe out...")
}

function RunTimer(){
    var timer = setInterval(() => {
        BreathInOut()
    }, breathingInterval);

    setTimeout(() => {
        clearInterval(timer);
    }, numberOfBreaths * breathingInterval * 2);
}

RunTimer();