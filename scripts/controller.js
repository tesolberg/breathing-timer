var moduleRunning = false;

const startStopBtn = document.getElementById("startbtn");
//const circle = document.getElementById("circle");


function StartBtnClicked(){
    if(moduleRunning){
        moduleRunning = false;
        StopTimer();
    }
    else{
        moduleRunning = true;

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
circle.onclick = SkipClicked;
