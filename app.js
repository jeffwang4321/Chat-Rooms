//207.102.105.88:8080
// Import the Express module
var express = require('express');

// Create a new instance of Express
var app = express();

// Create a Node.js based http server on port 4141
var server = require('http').createServer(app).listen(process.env.PORT || 8080);

//Get index.html
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

console.log("Server started.");


var io = require('socket.io')(server);
io.sockets.on('connection', function(socket){
    //On connection
    console.log('New user connected!');
    socket.playername ="";
    socket.gameid="";
    socket.emit('showtitle');

    // Create room or join room 
    socket.on('hostCreateNewGame',function(data){
        console.log('hostCreateNewGame' + ' Playername ' + data.playerName + ' attempting to join game: ' + data.gameID );
        
        // A reference to the player's Socket.IO socket object (set values playername and gameid)
        this.playername = data.playerName;
        this.gameid = data.gameID;

        // If the room exists... Join the room
        if( io.sockets.adapter.rooms["/" + data.gameID] != undefined ){
            this.join(data.gameId);
            io.to(this.gameid).emit('addToChat', this.playername + " has joined");

        } else {
            // Otherwise, create new room and join
            console.log('create new room');
            this.join(data.gameID);
            io.to(this.gameid).emit('addToChat', this.playername + " has joined the chat");
        }
    });
    
    // Send message back to the game room 
    socket.on('sendMsgToServer',function(msg){
        console.log('Game id: ' + this.gameid + ' ' + this.playername + ": " + msg);
        io.to(this.gameid).emit('addToChat', this.playername + ": " + msg);
    });

    socket.on('disconnect',function(){         
        io.to(this.gameid).emit('addToChat', this.playername + " has left the chat");
    });
        
});


