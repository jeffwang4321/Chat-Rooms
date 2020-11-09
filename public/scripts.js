var socket = io();

//innitialize function (show titlepage)
socket.on('showtitle',function(){
    console.log('showtitle');
    titlepage.style.display = 'block';
    joinpage.style.display = 'none';
    chatpage.style.display = 'none';
});

//Btn click function (show joinpage)
function btnjoin(){
    console.log('btnjoin');
    titlepage.style.display = 'none';
    joinpage.style.display = 'block';
    chatpage.style.display = 'none';
}

//Btn click function (show chatpage)
function btnstart(){
    console.log('btnstart');
    titlepage.style.display = 'none';
    joinpage.style.display = 'none';
    chatpage.style.display = 'block';
    
    var data = {
        gameID : inputGameID.value || (Math.random() * 10000 | 0).toString(),
        playerName : inputPlayerName.value || 'Anonymous'
    };
    socket.emit('hostCreateNewGame', data);

    //Show Chat Room ID at top
    gameidtext.innerHTML += '<h2> Game ID: ' + data.gameID + '</h2>';
}


//add a chat cell to our chat list view, and scroll to the bottom
socket.on('addToChat',function(data){
    console.log('got a chat message');
    chattext.innerHTML += '<div class="chatCell">' + data + '</div>';
    chattext.scrollTop = chattext.scrollHeight;   
});

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
document.onkeyup = function(event){
    chatinput.focus();  
}