var moduleRunning = false;

const startStopBtn = document.getElementById("startbtn");
const circle_ = document.getElementById("circle");

function StartBtnClicked(){
    // Stop
    if(moduleRunning){
        moduleRunning = false;
        startStopBtn.innerHTML = "Start";
        StopTimer();
    }
    // Start
    else{
        moduleRunning = true;

        // Update button text
        startStopBtn.innerHTML = "Stop";

        // Update values from user input
        breathingInterval = document.getElementById("puste_hastighet").value;        
        breathHoldLength = document.getElementById("holde_pusten").value;        
        numberOfRounds = document.getElementById("runder").value;        
        numberOfBreaths = document.getElementById("hyperventnumber").value;
        StartTimer();
    }
}

function SkipClicked(){
    skip = true;
}

startStopBtn.onclick = StartBtnClicked;
circle_.onclick = SkipClicked;
