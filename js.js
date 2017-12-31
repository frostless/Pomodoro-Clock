$(document).ready(function () {
var per = 0;
var filler = $('#filler');
//0:sessionPaused 1:running 2:break running 3:break paused
var state = 0;
var timeLapsed;
//for window setTimeInterval
var timer;
var breakTime = $('#breaktime');
var sessionTime = $('#sessiontime');
var timetext = $('#timetext');

const colorPool = ['#2d6fd8','#7d7e84','#9b258d','#ba1665','#8df449','#bcaa98']
var color;


$('#breakminus,#sessionminus').on('click',function(){
  //should not response when timer is running
  if(state == 1||state == 2) return;
   //reset per and timelapsed if session time changed
  if($(this).attr('id') == "sessionminus") {
    //not allowed to clicked if break running
    if (state ==3) return;
    per = 0;
    timeLapsed = 0;
    color = colorPool[Math.floor((Math.random() * 6))];
  }
   //reset per and timelapsed if breaker time changed
   if($(this).attr('id') == "breakminus"&&state==3) {
    //not allowed to clicked if break running
    per = 0;
    timeLapsed = 0;
    color = colorPool[Math.floor((Math.random() * 6))];
  }
  
  if($(this).parent().find('span').text()>1){
     var newTime = $(this).parent().find('span').text();
    var ele = $(this).parent().find('span');
    newTime--;
  $(ele).text(newTime);
  }
})


$('#breakplus,#sessionplus').on('click',function(){
  //when either timer is running
  if(state == 1||state == 2) return;
  //reset per and timelapsed if session time changed
  if($(this).attr('id') == "sessionplus"){
    if (state == 3) return;
    per = 0;
    timeLapsed = 0
    color = colorPool[Math.floor((Math.random() * 6))];
  }
  
   //reset per and timelapsed if breaker time changed
   if($(this).attr('id') == "breakplus"&&state == 3) {
    //not allowed to clicked if break running
    per = 0;
    timeLapsed = 0;
    color = colorPool[Math.floor((Math.random() * 6))];
  }
  
  if($(this).parent().find('span').text()<100){
     var newTime = $(this).parent().find('span').text();
    var ele = $(this).parent().find('span');
    newTime++;
  $(ele).text(newTime);
  }
})


$('.clockcontainer').on('click',function(){
  //coule be  break factor or session factor
   var factor = state ==0||state ==1?$(sessionTime).text():$(breakTime).text();
       
  timeLapsed = timeLapsed >0? timeLapsed : factor*60;
  //if timer paused
 if (state == 0){
   //reset gardient if time lapsed change
   if(per == 0 && timeLapsed == 0)  cleanUpLinearGardient();
      state = 1;
        color = color?color:colorPool[Math.floor((Math.random() * 6))];
        timer = setInterval(function(){sessionTimer(factor,color)}, 1000);
  
 } else if (state == 1) {
   //pause the timer
   clearInterval(timer);
   //change to session paused
   state = 0;
 } else if (state == 2) {
   clearInterval(timer);
   //change to  break paused
   state = 3;
 } else {
   state = 2; //change to break running
   color = color?color:colorPool[Math.floor((Math.random() * 6))];
     timer = setInterval(function(){breakTimer(factor,color)}, 1000);
 }
 
})
//function to transfer seconds to time format
var transferFromSecondsToTime = function(seconds){
  if (seconds <= 0) return "00:00";
  var h = Math.floor(seconds/3600)>0?      Math.floor(seconds/3600):null;

  var m = seconds%3600;
  m = Math.floor(m/60);
  m = m <10?'0'+m:m;
  var s = seconds%3600%60
 
  s = s <10?'0'+s:s;
  
  return h == null?  m + ':' + s:h.toString() + ':' + m + ':' + s;

}
//clean up function for gardient
var cleanUpLinearGardient = function(){
  $(filler).css('background','none');
}

//call back function session timer
//parameter is set to c because dont want to mix up the local and global variable
var sessionTimer = function(factor,c){ 

      if (per>100) {
    per=0;
    clearInterval(timer);//clear timer
    //clean up the filler
    cleanUpLinearGardient();
    state = 2;//break timer
    //initialize the break timer
     var factor = $(breaktime).text();
     timeLapsed = factor*60;
     color = colorPool[Math.floor((Math.random() * 6))];
     timer = setInterval(function(){breakTimer(factor,color)}, 1000);
        $('#sessiontext').text("Break!")
    return;
  }

  per += (1/(60*factor))*100;
 
  var height = per + '%';
 
    $(filler).css("background", "linear-gradient(to top, "+color+" "+height+",#536359 "+height+")");
     
     var displayTime = transferFromSecondsToTime(--timeLapsed)
     $(timetext).text(displayTime);
     
}
//parameter is set to c because dont want to mix up the local and global variable
var breakTimer = function(factor,c){
   if (per>100) {
    per=0;
    clearInterval(timer);//clear timer
    //clean up the filler
    cleanUpLinearGardient();
    state = 1; //session timer
    //initialize the session timer
    var factor = $(sessionTime).text();
      timeLapsed = factor*60;
     color = colorPool[Math.floor((Math.random() * 6))];
     timer = setInterval(function(){sessionTimer(factor,color)}, 1000);
     $('#sessiontext').text("Session")
    return;
  }

  per += (1/(60*factor))*100;
 
  var height = per + '%';

    $(filler).css("background", "linear-gradient(to top, "+color+" "+height+",#536359 "+height+")");
     
     var displayTime = transferFromSecondsToTime(--timeLapsed)
     $(timetext).text(displayTime);
     
} 



)
