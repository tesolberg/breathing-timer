var breathingInterval = 1000;
var numberOfBreaths = 3;
var breathCount = 0;

var breatheIn = false;

function BreathInOut(){
    breatheIn = !breatheIn;
    console.log(breatheIn);
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