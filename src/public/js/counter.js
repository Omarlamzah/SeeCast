
var timefromm
var xx=0
var cinter1
var cinter2

var countelemnt =document.getElementById("countdown")
socket.on("lesmodirateur",lesmodirateur=>{
  countelemnt.style.display="block"
xx=0
    timefromm=lesmodirateur[1]   
    
    if(lesmodirateur[0]=="time"){
      countelemnt.style.color="black"; 
      countelemnt.innerText=lesmodirateur[1];
        startTimer(lesmodirateur[1] * 60); 
        if(countelemnt.innerText=="00:00"){
          startTimer(lesmodirateur[1] * 0); 
          clearInterval(ticker);
        

          clearInterval(cinter1)
          clearInterval(cinter2)
         
  }
      
    }
    
})





let timeInSecs;
let ticker;

function startTimer(secs) {
clearInterval(ticker);
timeInSecs = parseInt(secs);
ticker = setInterval("tick()", 100);
}

function tick() {
xx++
var dif=(100000/(timefromm*60*1000))
  // chncount(100-dif*xx)
let secs = timeInSecs;
if (secs > 0) {
  timeInSecs--;
} else {
  clearInterval(ticker);
  startTimer(5 * 60); // 5 minutes in seconds
}
let mins = Math.floor(secs / 60);
secs %= 60;
let result =
  (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
  countelemnt.innerHTML = result;
  if(mins<1){
    countelemnt.style.color="red";
    
  }


if(result=="00:00"){



  countelemnt.innerHTML="00:00"
   clearInterval(ticker);
   
}
}