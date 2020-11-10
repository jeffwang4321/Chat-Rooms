// Note: The console.logs appears on the client side (Chrome -> F12 -> Console)
var socket = io();

//Start function (show titlepage)
socket.on('showtitle',function(){
    console.log('showtitle');
    titlepage.style.display = 'block';
    joinpage.style.display = 'none';
    chatpage.style.display = 'none';
});

//Btn click join (show joinpage)
function btnjoin(){
    console.log('btnjoin');
    titlepage.style.display = 'none';
    joinpage.style.display = 'block';
    chatpage.style.display = 'none';
    document.getElementById('btncolor').style.background=randomColor() 
}

//Btn click color (Generate random color)
function btncolor(){
    document.getElementById('btncolor').style.background=randomColor() 
}

//Btn click start (create/ join room & show chatpage)
function btnstart(){
    console.log('btnstart');
    titlepage.style.display = 'none';
    joinpage.style.display = 'none';
    chatpage.style.display = 'block';
    
    // Set gameID, playerName & playerColor or default to random 4 digit gameID & Anonymous
    var data = {
        gameID : inputGameID.value || (Math.random() * 10000 | 0).toString(),
        playerName : inputPlayerName.value || 'Anonymous',
        playerColor : document.getElementById('btncolor').style.background
    };
    socket.emit('hostCreateNewGame', data);
}


//Add a chat cell to our chat list view (Distinct client colors included!), and scroll to the bottom 
socket.on('addToChat',function(msg, playercolor){
    console.log('got a chat message');

    var messageNode = document.createTextNode(msg);
    var messageElement = document.createElement('div');
    messageElement.setAttribute("id", "chatCell");
    messageElement.style.color = playercolor;

    messageElement.appendChild(messageNode);
    document.getElementById('chattext').appendChild(messageElement);

    chattext.scrollTop = chattext.scrollHeight;   
});


//Update the Game ID & numUser info on top of chat list
socket.on('updatechatinfo',function(numUsers, gameid){
    gameidtext.innerHTML = '<h2> Game ID: ' +gameid + '&#160; &#160;Users: ' +numUsers  + '/10 </h2>';
});


//Btn click send (Calls server to send chat, server checks rooms)
chatform.onsubmit = function(e){
    //prevent the form from refreshing the page
    e.preventDefault();
    
    //call sendMsgToServer socket function, with form text value as argument
    socket.emit('sendMsgToServer', chatinput.value);
    chatinput.value = "";
}


//Optional for chat page (focus chat input box)
//Run on page load, alway focus chat input
document.addEventListener('DOMContentLoaded', function() {
    chatinput.focus();                     
});
    
//Run on key press, alway focus chat input
document.onkeyup = function(){
    chatinput.focus();  
}

// Random color function from: //https://stackoverflow.com/questions/10014271/generate-random-color-distinguishable-to-humans
function randomColor() {
    var max = 0xffffff;
    return '#' + Math.round( Math.random() * max ).toString( 16 );
}