



  
  

    
  
  const socket =window.io()
  
  function bgchange(){
    alertsweet()
     socket.emit("bgcahne",[$("#imgname").val(),$("#numtabbg").val()] )
  
     
  }
  
  function bgtoutchange(){
    alertsweet()
      socket.emit("bgcahne",[$("#imgname").val()] )
  
  }

  
  function bgtoutchange_remove(){
    alertsweet()
      socket.emit("bgcahne",["vide"] )
  
  }
  
  function setanimation(){
      alertsweet()
      var animoption =document.getElementById("animoption").value
  
      var tabletid =document.getElementById("numtabanimiation").value
      console.log(animoption)
      console.log(tabletid)
  
      socket.emit("setanimation",[animoption,tabletid])
     }
  
  
  function sendColor(event){
    var numtab = document.getElementById("numtab")
    var colorhex=event.target.value
              socket.emit("setcolor",[numtab.value,colorhex])
              $.notify("Device "+numtab.value+" color is changed",{position:"top center",className:"success"});

              
          }
  
  
          function sendbgColor(event){
              var numtab = document.getElementById("numtab")
              var colorhex=event.target.value
              socket.emit("setbgcolor",[numtab.value,colorhex])
              alertsweet()
          }
  
  
  function send(){
    
  
  var names =document.getElementsByClassName("names")
  var fontsz =document.getElementsByClassName("sizfon")
  var orionta =document.getElementsByClassName("orionta")
  socket.emit("lesnom",[
         [names[0].value,fontsz[0].value,0],
         [names[1].value,fontsz[1].value,0],
         [names[2].value,fontsz[2].value,0],
         [names[3].value,fontsz[3].value,0],
         [names[4].value,fontsz[4].value,0],
         [names[5].value,fontsz[5].value,0],
         [names[6].value,fontsz[6].value,0],
         [names[7].value,fontsz[7].value,0],
         [names[8].value,fontsz[8].value,0],
         [names[9].value,fontsz[9].value,0],
         [names[10].value,fontsz[10].value,0],
         [names[11].value,fontsz[11].value,0],
         [names[12].value,fontsz[12].value,0],
         [names[13].value,fontsz[13].value,0],
  
  
  ])
  alertsweet()
  }
  function alertsweet(){
    $.notify("changed  successfully",{position:"top center",className:"success"});

  
  }
  
  
  function sendspisfivtext(evaluetarget ,i){ 
    alertsweet()
    var txt=document.getElementsByClassName("names")[i].value
    
  
  //socket.emit("retateinfo",[indexT,selectob.value])      
        socket.emit("texttotablet",[evaluetarget.target.value,txt])  
  
     }
  
  
  
  function sendmargin(m,event){
    if(m!="time"){
      document.getElementById("nm"+m).style.display="block"
      document.getElementById("nm"+m).innerHTML=(event.target.value*2).toFixed(0)+"<br/>%"
    } 
   
    socket.emit("positionmoneteur",[m,event.target.value])  
    //}
  }
  
  
  
  
  function sendfontsize(indexfont ,selectinput,e){ 
    if(indexfont!="time"){
      document.getElementById("nf"+indexfont).style.display="block"
      document.getElementById("nf"+indexfont).innerHTML=(event.target.value/3).toFixed(0)+"<br/>%"
    }
  
  
    socket.emit("fontsize",[indexfont,e.target.value])  
  
  }
  
  
  
  
  function sendmodirateur(indexmodi,e){ 

    //
    if(e.key==="Enter"){
         $.notify("Device "+ indexmodi +" changed to  "+e.target.value+"  successfully",{position:"top center",className:"success"});


  
   
    socket.emit("lesmodirateur",[indexmodi,e.target.value])  
    }
  }
  
  function reset(){
    
      var names =document.getElementsByClassName("names")
      var fontsz =document.getElementsByClassName("fontsz")
      var orionta =document.getElementsByClassName("orionta")
  
  
  for (let i = 0; i < names.length; i++) {
      names[i].value="";
       
      
  }
    
  }
  
  
  function setsamvalue(){
      var inpuvalueall=document.getElementById("inpuvalueall").value
      var names =document.getElementsByClassName("names")
      var siz =document.getElementsByClassName("sizfon")
          for (let i = 0; i < names.length-2; i++) {
              names[i].value=inpuvalueall;   
              siz[i].value="33"
              console.log(siz[i].value)
          }
  
  }
  
  
  function fullscreenmodrateur(){
    socket.emit("fullscrenn")  
  
  }
  
  
  
  // Function to add a moderator div
  var nmodi=1
  function addModerateur() {
   
    if(nmodi<60 && nmodi>=0){
      nmodi++
      document.getElementById("nmodi").innerHTML=nmodi
      $('.moderateur-div:hidden:first').css("display","flex"); // Show the first hidden moderator div
  
     }
  }
  
  // Function to remove a moderator div
  function removeModerateur() {
    
     if(nmodi <=60 && nmodi>1){
      nmodi--
      document.getElementById("nmodi").innerHTML=nmodi
      $('.moderateur-div:visible:last').hide(); // Hide the last visible moderator div
  
     }
  
  }
  
  selectoption()
  function selectoption(){
  
    for (let i = 0; i < 59; i++) {
      var option =   document.getElementsByName("selecttext")[i].options[i+1]
      option.selected=true;
  
     
      
    }
  }


  socket.on("tabletCountplus",(count)=>{
   const  countm = document.getElementById("countm")
   countm.innerHTML=count
    $.notify("new device connected "+count +" connected device",{position:"top center",className:"success"});

  })  

  socket.on("tabletCount",(count)=>{
    const  countm = document.getElementById("countm")
    countm.innerHTML=count
     $.notify("new device desconnected "+count +" connected device",{position:"top center",className:"danger"});
 
   })  

  

  